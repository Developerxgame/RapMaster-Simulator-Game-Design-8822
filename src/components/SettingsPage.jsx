import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiTrash2, FiExternalLink, FiHeart, FiTwitter, FiDollarSign, FiUser, FiCode, FiBrush, FiSettings, FiInfo, FiHome } = FiIcons;

export default function SettingsPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteCareer = () => {
    if (state.gameStarted && state.player.stageName) {
      // Find which slot this career is in and delete it
      for (let i = 1; i <= 3; i++) {
        const save = localStorage.getItem(`rapCareer_slot_${i}`);
        if (save) {
          try {
            const careerData = JSON.parse(save);
            if (careerData.player?.stageName === state.player.stageName) {
              localStorage.removeItem(`rapCareer_slot_${i}`);
              break;
            }
          } catch (error) {
            console.error(`Error checking save slot ${i}:`, error);
          }
        }
      }
    }
    
    // Reset game state
    dispatch({ type: 'RESET_GAME' });
    navigate('/menu');
  };

  const handleBackToMenu = () => {
    navigate('/menu');
  };

  const settings = [
    {
      title: 'Game Settings',
      items: [
        {
          icon: FiSettings,
          label: 'Auto-save',
          value: 'Enabled',
          description: 'Automatically saves your progress',
          action: () => {}
        }
      ]
    }
  ];

  const supportLinks = [
    {
      icon: FiTwitter,
      label: 'Follow on Twitter (X)',
      description: 'FHX Studios Official',
      action: () => window.open('https://x.com/Fhx_Studios?t=c8MULYBgZ69pYPWIHpC6gw&s=09', '_blank'),
      color: 'bg-blue-500'
    },
    {
      icon: FiHeart,
      label: 'Support on Patreon',
      description: 'Help us create more games',
      action: () => window.open('https://patreon.com/fhxstudios', '_blank'),
      color: 'bg-orange-500'
    }
  ];

  const credits = [
    {
      icon: FiUser,
      role: 'Publisher',
      name: 'FHX STUDIOS',
      color: 'text-rap-gold'
    },
    {
      icon: FiBrush,
      role: 'Concept',
      name: 'Fahim',
      color: 'text-ios-blue'
    },
    {
      icon: FiCode,
      role: 'Developer',
      name: 'FHX STUDIO',
      color: 'text-ios-green'
    },
    {
      icon: FiBrush,
      role: 'UI/UX',
      name: 'Fahim',
      color: 'text-ios-purple'
    }
  ];

  return (
    <div className="min-h-screen bg-ios-bg pb-8">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-ios sticky top-0 z-50">
        <div className="flex items-center justify-between pt-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-ios-gray6 rounded-full transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="text-xl text-ios-blue" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Back to Main Menu Button */}
        <motion.div
          className="bg-white rounded-ios-lg shadow-ios p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={handleBackToMenu}
            className="w-full bg-gradient-to-r from-ios-blue to-ios-purple text-white py-3 px-4 rounded-ios font-semibold hover:shadow-ios transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiHome} />
            <span>Back to Main Menu</span>
          </button>
        </motion.div>

        {/* Current Career Info */}
        {state.gameStarted && (
          <motion.div
            className="bg-white rounded-ios-lg shadow-ios p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">Current Career</h2>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-ios-blue to-ios-purple rounded-ios-lg flex items-center justify-center text-2xl text-white">
                🎤
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{state.player.stageName}</h3>
                <p className="text-ios-gray">Age {state.player.age} • {state.player.city}</p>
                <div className="flex items-center space-x-4 text-sm text-ios-gray mt-1">
                  <span>Fame: {state.player.fame}</span>
                  <span>•</span>
                  <span>Week {state.player.week}/{state.player.year}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-ios-red text-white py-3 px-4 rounded-ios font-semibold hover:shadow-ios transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiTrash2} />
              <span>Delete Career</span>
            </button>
          </motion.div>
        )}

        {/* Settings Sections */}
        {settings.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            className="bg-white rounded-ios-lg shadow-ios overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <div className="px-6 py-4 border-b border-ios-gray5">
              <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
            </div>
            <div className="divide-y divide-ios-gray5">
              {section.items.map((item, index) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-6 hover:bg-ios-gray6 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <SafeIcon icon={item.icon} className="text-xl text-ios-blue" />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{item.label}</div>
                      {item.description && (
                        <div className="text-sm text-ios-gray">{item.description}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-ios-gray font-medium">{item.value}</div>
                </button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Support Us */}
        <motion.div
          className="bg-white rounded-ios-lg shadow-ios overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="px-6 py-4 border-b border-ios-gray5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <SafeIcon icon={FiHeart} className="text-ios-red" />
              <span>Support Us</span>
            </h2>
          </div>
          <div className="divide-y divide-ios-gray5">
            {supportLinks.map((link, index) => (
              <button
                key={link.label}
                onClick={link.action}
                className="w-full flex items-center justify-between p-6 hover:bg-ios-gray6 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 ${link.color} rounded-ios`}>
                    <SafeIcon icon={link.icon} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{link.label}</div>
                    <div className="text-sm text-ios-gray">{link.description}</div>
                  </div>
                </div>
                <SafeIcon icon={FiExternalLink} className="text-ios-gray" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Credits */}
        <motion.div
          className="bg-white rounded-ios-lg shadow-ios overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="px-6 py-4 border-b border-ios-gray5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <SafeIcon icon={FiInfo} className="text-ios-blue" />
              <span>Credits</span>
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {credits.map((credit, index) => (
              <motion.div
                key={credit.role}
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={credit.icon} className={`text-xl ${credit.color}`} />
                  <span className="font-medium text-gray-900">{credit.role}</span>
                </div>
                <span className={`font-bold ${credit.color}`}>{credit.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Version Info */}
        <motion.div
          className="bg-gradient-to-r from-ios-blue to-ios-purple rounded-ios-lg shadow-ios p-6 text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-bold mb-2">RapMaster Simulator</h3>
          <p className="text-white/80 mb-2">Version 1.0.0</p>
          <p className="text-white/60 text-sm">© 2024 FHX Studios. All rights reserved.</p>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <motion.div
            className="bg-white rounded-ios-lg shadow-ios-xl p-6 w-full max-w-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-center mb-6">
              <SafeIcon icon={FiTrash2} className="text-4xl text-ios-red mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Career</h3>
              <p className="text-ios-gray">
                Are you sure you want to delete "{state.player.stageName}"? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-ios-gray5 text-gray-900 py-3 px-4 rounded-ios font-semibold hover:bg-ios-gray4 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCareer}
                className="flex-1 bg-ios-red text-white py-3 px-4 rounded-ios font-semibold hover:shadow-ios transition-all active:scale-95"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}