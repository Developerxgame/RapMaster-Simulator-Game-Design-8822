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
          description: 'Automatically saves your progress every 30 seconds',
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
      color: 'text-yellow-600'
    },
    {
      icon: FiBrush,
      role: 'Concept & Design',
      name: 'Fahim',
      color: 'text-blue-600'
    },
    {
      icon: FiCode,
      role: 'Development',
      name: 'FHX STUDIO',
      color: 'text-green-600'
    },
    {
      icon: FiBrush,
      role: 'UI/UX Design',
      name: 'Fahim',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-8">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-md px-6 py-4 shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="flex items-center justify-between pt-8">
          <button
            onClick={() => navigate(-1)}
            className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="text-xl text-blue-600" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">Settings</h1>
            <p className="text-xs text-gray-600">v1.1.1</p>
          </div>
          <div className="w-12"></div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-md mx-auto">
        {/* Enhanced Back to Main Menu Button */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={handleBackToMenu}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-2xl font-semibold hover:shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-3"
          >
            <SafeIcon icon={FiHome} className="text-xl" />
            <span>Back to Main Menu</span>
          </button>
        </motion.div>

        {/* Enhanced Current Career Info */}
        {state.gameStarted && (
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <span className="text-2xl">🎤</span>
              <span>Current Career</span>
            </h2>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg">
                🎤
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{state.player.stageName}</h3>
                <p className="text-gray-600 font-medium">Age {state.player.age} • {state.player.city}</p>
                <div className="flex items-center space-x-3 text-sm text-gray-500 mt-2">
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    <span>Fame: {state.player.fame}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <span>Week {state.player.week}/{state.player.year}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Career Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                <div className="text-2xl font-bold text-green-600">${(state.player.netWorth / 1000).toFixed(1)}K</div>
                <div className="text-sm text-green-700">Net Worth</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">{state.player.fans.toLocaleString()}</div>
                <div className="text-sm text-purple-700">Fans</div>
              </div>
            </div>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-2xl font-semibold hover:shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-3"
            >
              <SafeIcon icon={FiTrash2} className="text-xl" />
              <span>Delete Career</span>
            </button>
          </motion.div>
        )}

        {/* Enhanced Settings Sections */}
        {settings.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {section.items.map((item, index) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <SafeIcon icon={item.icon} className="text-xl text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{item.label}</div>
                      {item.description && (
                        <div className="text-sm text-gray-600">{item.description}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-green-600 font-semibold">{item.value}</div>
                </button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Enhanced Support Us */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-pink-50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <SafeIcon icon={FiHeart} className="text-red-500" />
              <span>Support Us</span>
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {supportLinks.map((link, index) => (
              <button
                key={link.label}
                onClick={link.action}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 ${link.color} rounded-2xl shadow-md`}>
                    <SafeIcon icon={link.icon} className="text-white text-xl" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{link.label}</div>
                    <div className="text-sm text-gray-600">{link.description}</div>
                  </div>
                </div>
                <SafeIcon icon={FiExternalLink} className="text-gray-400" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Credits */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <SafeIcon icon={FiInfo} className="text-blue-600" />
              <span>Credits</span>
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {credits.map((credit, index) => (
              <motion.div
                key={credit.role}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={credit.icon} className={`text-2xl ${credit.color}`} />
                  <span className="font-semibold text-gray-900">{credit.role}</span>
                </div>
                <span className={`font-bold ${credit.color}`}>{credit.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Version Info */}
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-bold mb-2">🎵 RapMaster Simulator</h3>
          <p className="text-white/90 mb-2 font-semibold">Version 1.1.1 - Enhanced Experience</p>
          <p className="text-white/70 text-sm">© 2024 FHX Studios. All rights reserved.</p>
          <div className="mt-4 p-3 bg-white/10 rounded-xl">
            <p className="text-sm text-white/90">
              ✨ New in v1.1.1: Enhanced UI/UX, Bug fixes, iOS-style design improvements
            </p>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm border border-gray-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiTrash2} className="text-3xl text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Delete Career</h3>
              <p className="text-gray-600 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-gray-900">"{state.player.stageName}"</span>? 
                This action cannot be undone and all progress will be lost.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCareer}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-2xl font-semibold hover:shadow-xl transition-all active:scale-95"
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