import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Search, Users, MessageSquare, FolderOpen, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: 'Découvrir', href: '/discover', icon: Search },
    { name: 'Matches', href: '/matches', icon: Users },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Projets', href: '/projects', icon: FolderOpen },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsProfileOpen(false);
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{ 
        backgroundColor: '#FAF7F3',
        borderColor: '#F0E4D3'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/discover" className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#D9A299' }}
            >
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900">ColabSwipe</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'font-medium text-neutral-900'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  style={{
                    backgroundColor: isActive ? '#F0E4D3' : 'transparent'
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-neutral-600 hover:text-neutral-900 rounded-lg transition-all duration-200">
              <Bell className="w-5 h-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-100 transition-all duration-200"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: '#DCC5B2' }}
                >
                  {user?.email ? getInitials(user.email) : 'U'}
                </div>
                <span className="hidden md:block text-sm font-medium text-neutral-700">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </button>

              {isProfileOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2"
                  style={{ borderColor: '#F0E4D3' }}
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Mon Profil</span>
                    </div>
                  </Link>
                  <hr className="my-2" style={{ borderColor: '#F0E4D3' }} />
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Se déconnecter</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t py-4" style={{ borderColor: '#F0E4D3' }}>
          <nav className="flex justify-around">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'font-medium text-neutral-900'
                      : 'text-neutral-600'
                  }`}
                  style={{
                    backgroundColor: isActive ? '#F0E4D3' : 'transparent'
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;