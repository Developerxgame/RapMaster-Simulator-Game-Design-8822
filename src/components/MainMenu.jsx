import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiSettings, FiFolderOpen, FiMusic, FiPlus, FiTrash2, FiEdit3, FiUser, FiChevronLeft } = FiIcons;

export default function MainMenu() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [showSaves, setShowSaves] = useState(false);
  const [savedCareers, setSavedCareers] = useState([]);

  useEffect(() => {
    loadSavedCareers();
  }, []);

  const loadSavedCareers = () => {
    const saves = [];
    for (let i = 1; i <= 3; i++) {
      const save = localStorage.getItem(`rapCareer_slot_${i}`);
      if (save) {
        try {
          const careerData = JSON.parse(save);
          saves.push({
            slot: i,
            ...careerData,
            lastPlayed: new Date(careerData.lastPlayed || Date.now()).toLocaleDateString()
          });
        } catch (error) {
          console.error(`Error loading save slot ${i}:`, error);
        }
      } else {
        saves.push({
          slot: i,
          empty: true
        });
      }
    }
    setSavedCareers(saves);
  };

  const handleStartNewGame = () => {
    const emptySlots = savedCareers.filter(save => save.empty);
    if (emptySlots.length === 0) {
      alert('Maximum 3 careers allowed! Please delete a career to create a new one.');
      return;
    }
    navigate('/character-creation');
  };

  const handleContinue = () => {
    setShowSaves(true);
  };

  const loadCareer = (career) => {
    if (career.empty) {
      navigate('/character-creation', { state: { slot: career.slot } });
      return;
    }

    try {
      dispatch({ type: 'LOAD_GAME_STATE', payload: career });
      navigate('/game/home');
    } catch (error) {
      console.error('Failed to load career:', error);
      alert('Failed to load career. The save file may be corrupted.');
    }
  };

  const deleteCareer = (slot) => {
    if (window.confirm('Are you sure you want to delete this career? This action cannot be undone.')) {
      localStorage.removeItem(`rapCareer_slot_${slot}`);
      loadSavedCareers();
    }
  };

  const hasAnyCareers = savedCareers.some(save => !save.empty);

  const menuItems = [
    {
      icon: FiPlus,
      label: 'New Career',
      action: handleStartNewGame,
      primary: true,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      description: 'Start your journey to rap stardom'
    },
    {
      icon: FiFolderOpen,
      label: 'Continue',
      action: handleContinue,
      primary: false,
      disabled: !hasAnyCareers,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      description: 'Resume your existing career'
    },
    {
      icon: FiSettings,
      label: 'Settings',
      action: () => navigate('/settings'),
      primary: false,
      color: 'bg-gradient-to-r from-gray-500 to-gray-600',
      description: 'Customize your experience'
    }
  ];

  if (showSaves) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="h-8"></div>
          
          {/* Enhanced Header */}
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => setShowSaves(false)}
              className="p-3 hover:bg-white/70 rounded-2xl transition-colors"
            >
              <SafeIcon icon={FiChevronLeft} className="text-xl text-blue-600" />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">Select Career</h1>
              <p className="text-sm text-gray-600">Choose a career to continue</p>
            </div>
            <div className="w-12"></div>
          </motion.div>

          {/* Enhanced Career Slots */}
          <div className="space-y-4">
            {savedCareers.map((career, index) => (
              <motion.div
                key={career.slot}
                className={`bg-white rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl ${
                  career.empty ? 'border-2 border-dashed border-gray-300' : 'border-gray-200'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {career.empty ? (
                  <button
                    onClick={() => loadCareer(career)}
                    className="w-full flex flex-col items-center justify-center py-8 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-3">
                      <SafeIcon icon={FiPlus} className="text-2xl text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold">Create New Career</span>
                    <span className="text-xs text-gray-400">Slot {career.slot}</span>
                  </button>
                ) : (
                  <div className="p-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg">
                        🎤
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {career.player?.stageName || 'Unknown Artist'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Age {career.player?.age || 20} • {career.player?.city || 'Unknown City'}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            Fame: {career.player?.fame || 0}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Fans: {career.player?.fans || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-xl mb-4">
                      <div className="grid grid-cols-3 gap-3 text-center text-xs">
                        <div>
                          <div className="font-semibold text-gray-900">{career.lastPlayed}</div>
                          <div className="text-gray-500">Last Played</div>
                        </div>
                        <div>
                          <div className="font-semibold text-orange-600">{career.player?.reputation || 0}</div>
                          <div className="text-gray-500">Reputation</div>
                        </div>
                        <div>
                          <div className="font-semibold text-blue-600">
                            W{career.player?.week || 1}/{career.player?.year || 2020}
                          </div>
                          <div className="text-gray-500">Progress</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => loadCareer(career)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all active:scale-95"
                      >
                        Continue Career
                      </button>
                      <button
                        onClick={() => deleteCareer(career.slot)}
                        className="bg-red-500 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all active:scale-95"
                      >
                        <SafeIcon icon={FiTrash2} className="text-sm" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Enhanced Career Counter */}
          <motion.div
            className="text-center text-gray-500 text-sm mt-6 bg-white/50 p-3 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {savedCareers.filter(save => !save.empty).length} / 3 careers created
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-md mx-auto px-4 py-8 flex flex-col min-h-screen">
        <div className="h-8"></div>

        {/* Enhanced Logo Section */}
        <motion.div
          className="flex-1 flex flex-col items-center justify-center"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl shadow-2xl flex items-center justify-center mb-6 relative"
            animate={{
              boxShadow: [
                "0 20px 40px rgba(251, 146, 60, 0.3)",
                "0 25px 50px rgba(251, 146, 60, 0.4)",
                "0 20px 40px rgba(251, 146, 60, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <SafeIcon icon={FiMusic} className="text-3xl text-white" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl blur-lg opacity-30"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-3 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            RapMaster
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 mb-2 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Build your rap empire
          </motion.p>

          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-12"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            v1.1.1 - Enhanced Experience
          </motion.div>

          {/* Enhanced Menu Items */}
          <div className="w-full space-y-4">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.label}
                onClick={item.action}
                disabled={item.disabled}
                className={`w-full p-4 rounded-2xl font-semibold text-white transition-all duration-300 shadow-lg ${
                  item.disabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : `${item.color} hover:shadow-xl active:scale-95`
                }`}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={!item.disabled ? { y: -2 } : {}}
                whileTap={!item.disabled ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <SafeIcon icon={item.icon} className="text-xl" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-base">{item.label}</div>
                      <div className="text-white/80 text-sm">{item.description}</div>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Footer */}
        <motion.div
          className="text-center text-gray-500 text-sm pt-6 bg-white/30 p-4 rounded-2xl backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="font-semibold">Version 1.1.1</p>
          <p className="mt-1">© 2024 FHX Studios - Enhanced iOS Experience</p>
        </motion.div>
      </div>
    </div>
  );
}