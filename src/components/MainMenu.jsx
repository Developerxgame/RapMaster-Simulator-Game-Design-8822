import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiSettings, FiFolderOpen, FiShoppingBag, FiMusic } = FiIcons;

export default function MainMenu() {
  const navigate = useNavigate();
  const { state } = useGame();

  const menuItems = [
    {
      icon: FiPlay,
      label: 'Start Game',
      action: () => navigate(state.gameStarted ? '/game/home' : '/character-creation'),
      primary: true,
      color: 'bg-gradient-to-r from-ios-blue to-ios-indigo'
    },
    {
      icon: FiFolderOpen,
      label: 'Continue',
      action: () => navigate('/game/home'),
      primary: false,
      disabled: !state.gameStarted,
      color: 'bg-ios-green'
    },
    {
      icon: FiSettings,
      label: 'Settings',
      action: () => console.log('Settings'),
      primary: false,
      color: 'bg-ios-gray'
    },
    {
      icon: FiShoppingBag,
      label: 'Store',
      action: () => console.log('Shop'),
      primary: false,
      color: 'bg-ios-purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ios-bg to-white flex flex-col px-6 py-12">
      {/* Status Bar Spacer */}
      <div className="h-8"></div>

      {/* Logo Section */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-20 h-20 bg-gradient-to-br from-rap-gold to-ios-orange rounded-ios-xl shadow-ios-lg flex items-center justify-center mb-6">
          <SafeIcon icon={FiMusic} className="text-3xl text-white" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">RapMaster</h1>
        <p className="text-lg text-ios-gray mb-12">Build your rap empire</p>

        {/* Menu Items */}
        <div className="w-full max-w-sm space-y-3">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={item.action}
              disabled={item.disabled}
              className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-ios-lg font-semibold text-white transition-all duration-200 ${
                item.disabled
                  ? 'bg-ios-gray3 text-ios-gray cursor-not-allowed'
                  : `${item.color} shadow-ios hover:shadow-ios-lg active:scale-95`
              }`}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={!item.disabled ? { scale: 1.02 } : {}}
              whileTap={!item.disabled ? { scale: 0.98 } : {}}
            >
              <SafeIcon icon={item.icon} className="text-xl" />
              <span className="text-base font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="text-center text-ios-gray text-sm pt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <p>Version 1.0.0</p>
        <p className="mt-1">© 2024 FHX Studios</p>
      </motion.div>
    </div>
  );
}