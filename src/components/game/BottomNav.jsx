import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiBriefcase, FiMusic, FiGlobe, FiShoppingBag, FiBarChart3, FiTrendingUp } = FiIcons;

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useGame();

  const navItems = [
    { icon: FiHome, path: '/game/home', label: 'Home' },
    { icon: FiBriefcase, path: '/game/job', label: 'Work' },
    { icon: FiMusic, path: '/game/studio', label: 'Studio' },
    { icon: FiGlobe, path: '/game/social', label: 'Social' },
    { icon: FiShoppingBag, path: '/game/shop', label: 'Shop' },
    { icon: FiBarChart3, path: '/game/stats', label: 'Stats' },
    { icon: FiTrendingUp, path: '/game/skills', label: 'Skills' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    dispatch({ type: 'SET_CURRENT_PAGE', payload: path.split('/').pop() });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-ios-gray5">
      <div className="flex items-center justify-around px-2 py-2 pb-8">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center py-1.5 px-2 rounded-ios transition-all duration-200 ${
                isActive 
                  ? 'text-ios-blue' 
                  : 'text-ios-gray hover:text-gray-900'
              }`}
            >
              <div className={`p-1.5 rounded-ios transition-all ${
                isActive ? 'bg-ios-blue/10' : 'hover:bg-ios-gray6'
              }`}>
                <SafeIcon icon={item.icon} className="text-lg" />
              </div>
              <span className="text-xs font-medium mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}