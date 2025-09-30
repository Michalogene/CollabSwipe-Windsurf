import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Search, Users, MessageSquare, FolderOpen, Bell, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: 'Découvrir', href: '/discover', icon: Search, label: 'Discover' },
    { name: 'Matches', href: '/matches', icon: Users, label: 'Matches' },
    { name: 'Messages', href: '/messages', icon: MessageSquare, label: 'Messages' },
    { name: 'Projets', href: '/projects', icon: FolderOpen, label: 'Projects' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsProfileOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
          <Link to="/discover" className="flex items-center space-x-2 z-10">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#D9A299' }}
            >
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900">ColabSwipe</span>
          </Link>

          {/* Desktop Navigation - Liquid Glass Pill */}
          <nav className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <div 
              className="flex items-center px-2 py-2 rounded-full backdrop-blur-sm border shadow-sm"
              style={{
                backgroundColor: 'rgba(240, 228, 211, 0.6)',
                borderColor: 'rgba(220, 197, 178, 0.3)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-neutral-800'
                        : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                    style={{
                      backgroundColor: isActive ? 'rgba(250, 247, 243, 0.9)' : 'transparent',
                      boxShadow: isActive ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
                    }}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:block p-2 text-neutral-600 hover:text-neutral-900 rounded-lg transition-all duration-200">
              <Bell className="w-5 h-5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg transition-all duration-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4" style={{ borderColor: '#F0E4D3' }}>
            <nav className="flex flex-col space-y-2 px-4">
              <div 
                className="flex flex-col space-y-1 p-2 rounded-2xl backdrop-blur-sm border"
                style={{
                  backgroundColor: 'rgba(240, 228, 211, 0.6)',
                  borderColor: 'rgba(220, 197, 178, 0.3)'
                }}
              >
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'text-neutral-800 font-medium'
                          : 'text-neutral-600'
                      }`}
                      style={{
                        backgroundColor: isActive ? 'rgba(250, 247, 243, 0.9)' : 'transparent',
                        boxShadow: isActive ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
              <button className="flex items-center space-x-3 px-4 py-3 text-neutral-600 hover:text-neutral-900 transition-colors">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden" onClick={toggleMobileMenu} />}
    </header>
  );
};

export default Header;