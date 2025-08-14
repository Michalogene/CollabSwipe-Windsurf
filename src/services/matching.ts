import { supabase } from './supabase';

export interface Swipe {
  id: string;
  swiper_id: string;
  swiped_id: string;
  action: 'like' | 'pass' | 'super_like';
  created_at: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  is_active: boolean;
  user1?: any;
  user2?: any;
  otherUser?: any;
}

export const createSwipe = async (swiperId: string, swipedId: string, action: 'like' | 'pass' | 'super_like') => {
  try {
    console.log('Création swipe:', { swiperId, swipedId, action });
    
    // 1. Créer le swipe
    const { error: swipeError } = await supabase
      .from('swipes')
      .insert({
        swiper_id: swiperId,
        swiped_id: swipedId,
        action: action
      });
    
    if (swipeError) {
      console.error('Erreur création swipe:', swipeError);
      return { isMatch: false, error: swipeError };
    }
    
    // 2. Si c'est un like, vérifier s'il y a match
    if (action === 'like' || action === 'super_like') {
      const matchResult = await checkForMatch(swiperId, swipedId);
      return matchResult;
    }
    
    return { isMatch: false, error: null };
  } catch (error) {
    console.error('Erreur:', error);
    return { isMatch: false, error };
  }
};

export const checkForMatch = async (userId: string, targetUserId: string) => {
  try {
    console.log('Vérification match entre:', userId, 'et', targetUserId);
    
    // Vérifier si l'autre utilisateur a aussi liké
    const { data: reverseSwipe } = await supabase
      .from('swipes')
      .select('*')
      .eq('swiper_id', targetUserId)
      .eq('swiped_id', userId)
      .in('action', ['like', 'super_like'])
      .single();

    if (reverseSwipe) {
      console.log('Match trouvé ! Création du match...');
      
      // C'est un match ! Créer l'entrée
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .insert({
          user1_id: userId,
          user2_id: targetUserId
        })
        .select()
        .single();
      
      if (matchError) {
        console.error('Erreur création match:', matchError);
        return { isMatch: false, error: matchError };
      }
      
      // Créer automatiquement la conversation
      const { error: conversationError } = await supabase
        .from('conversations')
        .insert({
          match_id: matchData.id
        });
      
      if (conversationError) {
        console.error('Erreur création conversation:', conversationError);
      }
      
      console.log('Match créé avec succès:', matchData);
      return { isMatch: true, data: matchData, error: null };
    }
    
    console.log('Pas de match pour le moment');
    return { isMatch: false, error: null };
  } catch (error) {
    console.error('Erreur:', error);
    return { isMatch: false, error };
  }
};

export const getUserMatches = async (userId: string) => {
  try {
    console.log('Chargement matches pour utilisateur:', userId);
    
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        user1:profiles!matches_user1_id_fkey(*),
        user2:profiles!matches_user2_id_fkey(*)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur chargement matches:', error);
      return [];
    }
    
    // Transformer les données pour avoir "otherUser"
    const matches = (data || []).map(match => ({
      ...match,
      otherUser: match.user1_id === userId ? match.user2 : match.user1
    }));
    
    console.log(`${matches.length} matches trouvés`);
    return matches;
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};

export const getNewMatches = async (userId: string, since?: string) => {
  try {
    let query = supabase
      .from('matches')
      .select(`
        *,
        user1:profiles!matches_user1_id_fkey(*),
        user2:profiles!matches_user2_id_fkey(*)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (since) {
      query = query.gte('created_at', since);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erreur chargement nouveaux matches:', error);
      return [];
    }
    
    const matches = (data || []).map(match => ({
      ...match,
      otherUser: match.user1_id === userId ? match.user2 : match.user1
    }));
    
    return matches;
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};