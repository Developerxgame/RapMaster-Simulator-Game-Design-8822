import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiBriefcase, FiMusic, FiGlobe, FiShoppingBag } = FiIcons;

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useGame();

  // Only 5 tabs as requested - enhanced size and styling
  const navItems = [
    { icon: FiHome, path: '/game/home', label: 'Home' },
    { icon: FiBriefcase, path: '/game/job', label: 'Work' },
    { icon: FiMusic, path: '/game/studio', label: 'Studio' },
    { icon: FiGlobe, path: '/game/social', label: 'Social' },
    { icon: FiShoppingBag, path: '/game/shop', label: 'Shop' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    dispatch({ type: 'SET_CURRENT_PAGE', payload: path.split('/').pop() });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-ios-gray5 safe-area-bottom z-40">
      {/* Enhanced navbar size and improved styling */}
      <div className="flex items-center justify-around px-3 py-4 pb-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center py-3 px-4 rounded-2xl transition-all duration-200 min-w-16 ${
                isActive
                  ? 'text-ios-blue bg-ios-blue/10 scale-105 shadow-lg'
                  : 'text-ios-gray hover:text-gray-900 hover:bg-ios-gray6'
              }`}
            >
              {/* iOS-style app icon design */}
              <div
                className={`p-3 rounded-2xl transition-all mb-2 shadow-sm ${
                  isActive ? 'bg-ios-blue/20 shadow-ios transform scale-110' : 'bg-transparent'
                }`}
              >
                <SafeIcon icon={item.icon} className="text-2xl" />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}