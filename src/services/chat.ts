import { supabase } from './supabase';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender?: any;
}

export interface Conversation {
  id: string;
  match_id: string;
  created_at: string;
  updated_at: string;
  match?: any;
  otherUser?: any;
  lastMessage?: string;
  unreadCount?: number;
}

export const getUserConversations = async (userId: string) => {
  try {
    console.log('Chargement conversations pour utilisateur:', userId);
    
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        match:matches(
          *,
          user1:profiles!matches_user1_id_fkey(*),
          user2:profiles!matches_user2_id_fkey(*)
        )
      `)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Erreur chargement conversations:', error);
      return [];
    }
    
    // Filtrer les conversations de l'utilisateur et transformer
    const userConversations = (data || [])
      .filter(conv => 
        conv.match && (conv.match.user1_id === userId || conv.match.user2_id === userId)
      )
      .map(conv => ({
        ...conv,
        otherUser: conv.match.user1_id === userId ? conv.match.user2 : conv.match.user1
      }));
    
    // Récupérer le dernier message et le nombre de non-lus pour chaque conversation
    for (const conv of userConversations) {
      // Dernier message
      const { data: lastMessage } = await supabase
        .from('messages')
        .select('content, created_at')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      // Messages non lus
      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conv.id)
        .neq('sender_id', userId)
        .eq('is_read', false);
      
      conv.lastMessage = lastMessage?.content || '';
      conv.lastMessageTime = lastMessage?.created_at || conv.updated_at;
      conv.unreadCount = unreadCount || 0;
    }
    
    console.log(`${userConversations.length} conversations trouvées`);
    return userConversations;
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};

export const getConversationMessages = async (conversationId: string) => {
  try {
    console.log('Chargement messages pour conversation:', conversationId);
    
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles(*)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Erreur chargement messages:', error);
      return [];
    }
    
    console.log(`${data?.length || 0} messages trouvés`);
    return data || [];
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};

export const sendMessage = async (conversationId: string, senderId: string, content: string) => {
  try {
    console.log('Envoi message:', { conversationId, senderId, content });
    
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content: content
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erreur envoi message:', error);
      return { data: null, error };
    }
    
    // Mettre à jour la conversation
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
    
    console.log('Message envoyé:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Erreur:', error);
    return { data: null, error };
  }
};

export const markMessagesAsRead = async (conversationId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .eq('is_read', false);
    
    if (error) {
      console.error('Erreur marquage messages lus:', error);
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
};

export const subscribeToMessages = (conversationId: string, callback: (payload: any) => void) => {
  console.log('Abonnement aux messages pour conversation:', conversationId);
  
  const subscription = supabase
    .channel(`messages:${conversationId}`)
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, 
      callback
    )
    .subscribe();
  
  return subscription;
};

export const subscribeToMatches = (userId: string, callback: (payload: any) => void) => {
  console.log('Abonnement aux nouveaux matches pour utilisateur:', userId);
  
  const subscription = supabase
    .channel(`matches:${userId}`)
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'matches',
        filter: `user1_id=eq.${userId}`
      }, 
      callback
    )
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'matches',
        filter: `user2_id=eq.${userId}`
      }, 
      callback
    )
    .subscribe();
  
  return subscription;
};