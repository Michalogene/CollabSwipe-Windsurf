import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  Search,
  Paperclip,
  Send,
  Smile,
  Video,
  Phone,
  Info,
  Settings,
  ChevronDown,
  Compass,
  MessageSquare,
  Briefcase,
  Star,
  Pencil,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
// import { getUserConversations, getConversationMessages, sendMessage, subscribeToMessages } from '../services/chat';

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

// Helper pour générer des avatars
const avatar = (id: number) => `https://i.pravatar.cc/120?img=${id}`;

// Données de démo pour les conversations
const demoConversations: Conversation[] = [
  {
    id: '1',
    match_id: 'match1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    otherUser: {
      id: 'alex',
      first_name: 'Alex',
      last_name: 'Chen',
      activity: 'CTO',
      avatar_url: avatar(12),
    },
    lastMessage: "Let's review the Figma link.",
    lastMessageTime: '2m ago',
    unreadCount: 0,
  },
  {
    id: '2',
    match_id: 'match2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    otherUser: {
      id: 'maria',
      first_name: 'Maria',
      last_name: 'Rodriguez',
      activity: 'Designer',
      avatar_url: avatar(45),
    },
    lastMessage: 'Prefeses your conversation, t...',
    lastMessageTime: '5m ago',
    unreadCount: 0,
  },
  {
    id: '3',
    match_id: 'match3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    otherUser: {
      id: 'james',
      first_name: 'James',
      last_name: 'Kim',
      activity: 'Developer',
      avatar_url: avatar(33),
    },
    lastMessage: "Let's review the Figma link in...",
    lastMessageTime: '1h ago',
    unreadCount: 0,
  },
];

// Messages de démo pour Alex Chen
const demoMessages = [
  {
    id: '1',
    content: "Hi Sarah, checked the wireframes.",
    sender_id: 'alex',
    created_at: new Date().toISOString(),
    is_read: true,
  },
  {
    id: '2',
    content: 'Thanks, Alex. The endpoints are ready on GitHub.',
    sender_id: 'sarah',
    created_at: new Date().toISOString(),
    is_read: true,
  },
  {
    id: '3',
    content: 'Looking good! What about the API endpoints?',
    sender_id: 'alex',
    created_at: new Date().toISOString(),
    is_read: true,
  },
  {
    id: '4',
    content: 'https://figma.com/tiow-ntGxPIRGI/',
    sender_id: 'alex',
    created_at: new Date().toISOString(),
    is_read: true,
    isLink: true,
  },
];

const ChatPage: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user, profile } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(id || '1');
  const [conversations] = useState<Conversation[]>(demoConversations);
  const [messages, setMessages] = useState<Message[]>(demoMessages);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find((c) => c.id === selectedConversation);

  useEffect(() => {
    if (user) {
      // loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      // loadMessages();
      // Pour la démo, on utilise les messages statiques
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || !user || sendingMessage) return;

    setSendingMessage(true);
    const tempMessage = messageText;
    setMessageText('');

    // Pour la démo, on ajoute directement le message
    const newMessage: Message = {
      id: Date.now().toString(),
      content: tempMessage,
      sender_id: user.id,
      created_at: new Date().toISOString(),
      is_read: false,
    };
    setMessages((prev) => [...prev, newMessage]);

    try {
      // const result = await sendMessage(selectedConversation, user.id, tempMessage);
      // if (result.error) {
      //   console.error('Erreur envoi message:', result.error);
      //   setMessageText(tempMessage);
      // }
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

  const isActive = (path: string) => location.pathname === path;

  const filteredConversations = conversations.filter((conv) =>
    `${conv.otherUser.first_name} ${conv.otherUser.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar Fixe */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-100 flex flex-col z-10">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">CollabSwipe</span>
          </div>
        </div>

        {/* Dropdown Talent Mode */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
            Mode
          </div>
          <div className="relative">
            <button className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors">
              <span className="font-medium text-gray-900">Talent Mode</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navigation Principale */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <Link
            to="/discover"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              isActive('/discover')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Explore</span>
          </Link>

          <Link
            to="/messages"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative ${
              isActive('/messages')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </Link>

          <Link
            to="/projects"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all"
          >
            <Briefcase className="h-4 w-4" />
            <span>My Projects</span>
          </Link>

          <Link
            to="/favorites"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all"
          >
            <Star className="h-4 w-4" />
            <span>Favorites</span>
          </Link>

        </nav>

        {/* User Profile Footer */}
        <div className="border-t border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src={avatar(64)}
              alt="Profile"
              className="h-9 w-9 rounded-full ring-2 ring-gray-100"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {profile?.first_name && profile?.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : 'Sarah Lee'}
              </div>
              <div className="text-xs text-gray-500 truncate">Product Lead</div>
            </div>
            <Link
              to="/profile"
              className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-5 w-5 text-gray-500" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Chat Interface */}
      <main className="flex-1 ml-64 overflow-hidden bg-slate-50">
        <div className="h-full flex items-center justify-center p-8">
          {/* Chat Container */}
          <div className="w-full max-w-6xl h-[80vh] bg-white rounded-2xl shadow-sm flex overflow-hidden">
            {/* Left Panel - Conversation List (35%) */}
            <div className="w-[35%] border-r border-gray-100 flex flex-col">
              {/* Search and Compose */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-full bg-gray-50 border-0 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                  <Pencil className="h-4 w-4" />
                  <span>Compose</span>
                </button>
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => {
                  const isSelected = selectedConversation === conversation.id;
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`px-4 py-3 cursor-pointer transition-colors ${
                        isSelected ? 'bg-gray-50' : 'hover:bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={conversation.otherUser.avatar_url || avatar(12)}
                          alt={conversation.otherUser.first_name}
                          className="h-12 w-12 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-900 text-sm">
                              {conversation.otherUser.first_name} {conversation.otherUser.last_name}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mb-1">
                            ({conversation.otherUser.activity})
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Panel - Active Chat (65%) */}
            <div className="flex-1 flex flex-col">
              {currentConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentConversation.otherUser.avatar_url || avatar(12)}
                        alt={currentConversation.otherUser.first_name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {currentConversation.otherUser.first_name}{' '}
                          {currentConversation.otherUser.last_name} - {currentConversation.otherUser.activity}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Video className="h-5 w-5 text-gray-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Phone className="h-5 w-5 text-gray-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Info className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Messages Area - Scrollable */}
                  <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50"
                  >
                    {messages.map((message) => {
                      const isMe = message.sender_id === user?.id || message.sender_id === 'sarah';
                      const isLink = (message as any).isLink;

                      if (isLink) {
                        // Link Preview Card (Incoming message style)
                        return (
                          <div key={message.id} className="flex justify-start">
                            <div className="max-w-md bg-gray-100 rounded-xl p-3 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-sm">F</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 truncate font-medium">
                                  {message.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={message.id}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-md px-4 py-2.5 rounded-2xl ${
                              isMe
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input Area */}
                  <div className="px-6 py-4 border-t border-gray-100 bg-white">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 rounded-full bg-gray-50 border-0 py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Paperclip className="h-5 w-5 text-gray-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Smile className="h-5 w-5 text-gray-600" />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim() || sendingMessage}
                        className={`p-2 rounded-lg transition-colors ${
                          messageText.trim() && !sendingMessage
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Sélectionnez une conversation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
