import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, ArrowLeft, Paperclip, Smile, RefreshCw } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserConversations, getConversationMessages, sendMessage, subscribeToMessages } from '../services/chat';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
  sender?: any;
}

interface Conversation {
  id: string;
  match_id: string;
  created_at: string;
  updated_at: string;
  otherUser: {
    id: string;
    first_name: string;
    last_name: string;
    activity?: string;
    avatar_url?: string;
  };
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

const ChatPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(id || null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages();
      
      const subscription = subscribeToMessages(selectedConversation, (payload) => {
        console.log('Nouveau message reçu:', payload);
        setMessages(prev => [...prev, payload.new]);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await getUserConversations(user.id);
      setConversations(data);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedConversation) return;
    
    try {
      const data = await getConversationMessages(selectedConversation);
      setMessages(data);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || !user || sendingMessage) return;

    setSendingMessage(true);
    const tempMessage = messageText;
    setMessageText('');

    try {
      const result = await sendMessage(selectedConversation, user.id, tempMessage);
      if (result.error) {
        console.error('Erreur envoi message:', result.error);
        setMessageText(tempMessage);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessageText(tempMessage);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center" style={{ backgroundColor: '#FAF7F3' }}>
        <div className="text-center">
          <LoadingSpinner size="xl" className="mb-4" />
          <h2 className="text-xl font-semibold text-neutral-700 mb-2">
            Chargement de vos conversations...
          </h2>
        </div>
      </div>
    );
  }

  return (

    <div className="min-h-screen pt-16" style={{ backgroundColor: '#FAF7F3' }}>
      <div className="h-[calc(100vh-4rem)] bg-white flex">
        {/* Conversations Sidebar */}
        <div className={`w-full md:w-80 bg-white border-r flex flex-col ${
          selectedConversation ? 'hidden md:flex' : 'flex'
        }`} style={{ borderColor: '#F0E4D3' }}>
          <div className="p-4 border-b" style={{ borderColor: '#F0E4D3' }}>
            <h2 className="text-xl font-semibold text-neutral-900">Messages</h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-neutral-50 transition-colors ${
                    selectedConversation === conversation.id ? 'border-primary-200' : ''
                  }`}
                  style={{ 
                    borderColor: '#F0E4D3',
                    backgroundColor: selectedConversation === conversation.id ? '#F0E4D3' : 'transparent'
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative flex-shrink-0">
                      {conversation.otherUser.avatar_url ? (
                        <img
                          src={conversation.otherUser.avatar_url}
                          alt={conversation.otherUser.first_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D9A299' }}>
                          <span className="text-white font-semibold">
                            {conversation.otherUser.first_name[0]}{conversation.otherUser.last_name[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-neutral-900 truncate">
                          {conversation.otherUser.first_name} {conversation.otherUser.last_name}
                        </h3>
                      </div>
                      <p className="text-sm text-neutral-600 truncate mb-1">
                        {conversation.lastMessage || 'Commencez la conversation...'}
                      </p>
                      {conversation.otherUser.activity && (
                        <p className="text-xs text-neutral-500">{conversation.otherUser.activity}</p>
                      )}
                    </div>

                    {conversation.unreadCount && conversation.unreadCount > 0 && (
                      <div className="w-5 h-5 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D9A299' }}>
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F0E4D3' }}>
                  <Send className="w-8 h-8" style={{ color: '#D9A299' }} />
                </div>
                <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                  Aucune conversation
                </h3>
                <p className="text-neutral-500 mb-4">
                  Vos conversations apparaîtront ici quand vous aurez des matches.
                </p>
                <button
                  onClick={() => navigate('/matches')}
                  className="px-6 py-2 rounded-lg font-medium text-white transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: '#D9A299' }}
                >
                  Voir mes matches
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${
          selectedConversation ? 'flex' : 'hidden md:flex'
        }`}>
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white" style={{ borderColor: '#F0E4D3' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="relative">
                      {currentConversation.otherUser.avatar_url ? (
                        <img
                          src={currentConversation.otherUser.avatar_url}
                          alt={currentConversation.otherUser.first_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D9A299' }}>
                          <span className="text-white font-semibold text-sm">
                            {currentConversation.otherUser.first_name[0]}{currentConversation.otherUser.last_name[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-neutral-900">
                        {currentConversation.otherUser.first_name} {currentConversation.otherUser.last_name}
                      </h3>
                      {currentConversation.otherUser.activity && (
                        <p className="text-sm text-neutral-500">
                          {currentConversation.otherUser.activity}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                      <Phone className="w-5 h-5 text-neutral-600" />
                    </button>
                    <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                      <Video className="w-5 h-5 text-neutral-600" />
                    </button>
                    <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-neutral-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: '#FAF7F3' }}>
                {messages.length > 0 ? (
                  messages.map((message, index) => {
                    const isMe = message.sender_id === user?.id;

                    return (
                      <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          isMe 
                            ? 'text-white' 
                            : 'bg-white text-neutral-900'
                        }`} style={{
                          backgroundColor: isMe ? '#D9A299' : 'white'
                        }}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F0E4D3' }}>
                      <Send className="w-8 h-8" style={{ color: '#D9A299' }} />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                      Commencez la conversation
                    </h3>
                    <p className="text-neutral-500">
                      Dites bonjour à {currentConversation.otherUser.first_name} !
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-white" style={{ borderColor: '#F0E4D3' }}>
                <div className="flex items-end space-x-2">
                  <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <Paperclip className="w-5 h-5 text-neutral-600" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tapez votre message..."
                      className="w-full resize-none border rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:border-transparent max-h-32"
                      style={{ 
                        borderColor: '#F0E4D3',
                        focusRingColor: '#D9A299'
                      }}
                      rows={1}
                      disabled={sendingMessage}
                    />
                    <button className="absolute right-2 bottom-2 p-1 hover:bg-neutral-100 rounded-lg transition-colors">
                      <Smile className="w-5 h-5 text-neutral-600" />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendingMessage}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      messageText.trim() && !sendingMessage
                        ? 'text-white shadow-card hover:shadow-card-hover'
                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    }`}
                    style={{
                      backgroundColor: messageText.trim() && !sendingMessage ? '#D9A299' : '#e5e7eb'
                    }}
                  >
                    {sendingMessage ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#FAF7F3' }}>
              <div className="text-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#F0E4D3' }}>
                  <Send className="w-12 h-12" style={{ color: '#D9A299' }} />
                </div>
                <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
                  Sélectionnez une conversation
                </h3>
                <p className="text-neutral-600">
                  Choisissez un match pour commencer à discuter
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;