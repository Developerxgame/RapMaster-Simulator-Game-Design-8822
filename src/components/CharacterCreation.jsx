import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiMapPin, FiArrowRight, FiShuffle, FiChevronLeft } = FiIcons;

export default function CharacterCreation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useGame();
  const [step, setStep] = useState(1);
  const [character, setCharacter] = useState({
    stageName: '',
    avatar: 1,
    city: 'Los Angeles'
  });

  // Get slot from navigation state (for new careers from save page)
  const targetSlot = location.state?.slot;

  // Enhanced avatars with rapper/musician vibe
  const avatars = [
    { id: 1, name: 'Street Style MC', emoji: '🎤', description: 'Classic street rapper' },
    { id: 2, name: 'Trap Artist', emoji: '👨‍🎤', description: 'Modern trap vibes' },
    { id: 3, name: 'Female MC', emoji: '👩‍🎤', description: 'Powerful female rapper' },
    { id: 4, name: 'Underground Legend', emoji: '🎭', description: 'Raw underground style' },
    { id: 5, name: 'Luxury Rapper', emoji: '💎', description: 'High-end lifestyle' },
    { id: 6, name: 'Rising Star', emoji: '⭐', description: 'Next generation talent' },
    { id: 7, name: 'Conscious MC', emoji: '🧠', description: 'Deep lyrical content' },
    { id: 8, name: 'Party Rapper', emoji: '🎉', description: 'High-energy performer' }
  ];

  const cities = [
    { name: 'Los Angeles', boost: 'Fame Boost', flag: '🌴', color: 'bg-ios-orange', description: 'Entertainment capital' },
    { name: 'New York', boost: 'Reputation Boost', flag: '🗽', color: 'bg-ios-blue', description: 'Hip-hop birthplace' },
    { name: 'Atlanta', boost: 'Fan Growth', flag: '🍑', color: 'bg-ios-green', description: 'Trap music hub' },
    { name: 'Chicago', boost: 'Business Boost', flag: '🏙️', color: 'bg-ios-purple', description: 'Drill scene center' }
  ];

  const randomNames = [
    'Lil Cipher', 'MC Thunder', 'Rap Phantom', 'Young Legend', 'Flow Master',
    'Beat King', 'Rhyme Slayer', 'Street Prophet', 'Golden Voice', 'Mic Drop',
    'Cash Flow', 'Fire Bars', 'Ice Cold', 'Real Talk', 'Boss Mode',
    'Night Hawk', 'City King', 'Pure Energy', 'Diamond Mind', 'Storm Rider'
  ];

  const generateRandomName = () => {
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    setCharacter({ ...character, stageName: randomName });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleStartCareer();
    }
  };

  const findAvailableSlot = () => {
    // If we have a target slot, use it
    if (targetSlot) return targetSlot;

    // Otherwise find first available slot
    for (let i = 1; i <= 3; i++) {
      const save = localStorage.getItem(`rapCareer_slot_${i}`);
      if (!save) return i;
    }
    return null; // No slots available
  };

  const handleStartCareer = () => {
    const slot = findAvailableSlot();
    if (!slot) {
      alert('No available slots! This should not happen.');
      return;
    }

    // Create initial game state
    const gameState = {
      player: {
        stageName: character.stageName,
        avatar: character.avatar,
        city: character.city,
        age: 20,
        year: 2020,
        week: 1,
        fame: 0,
        reputation: 0,
        fans: 0,
        netWorth: 100,
        energy: 100,
        skills: {
          lyrics: 1,
          flow: 1,
          charisma: 1,
          business: 1,
          production: 1
        },
        socialMedia: {
          rapgram: { followers: 0, posts: 0 },
          raptube: { subscribers: 0, videos: 0, totalViews: 0 },
          rapify: { listeners: 0, streams: 0 },
          riktok: { followers: 0, videos: 0 }
        },
        achievements: [],
        inventory: []
      },
      tracks: [],
      albums: [],
      musicVideos: [],
      concerts: [],
      socialPosts: [],
      releases: [],
      earnings: {
        total: 0,
        thisWeek: 0,
        streaming: 0,
        youtube: 0,
        concerts: 0,
        merchandise: 0
      },
      gameStarted: true,
      currentPage: 'home',
      notifications: [],
      randomEvents: [],
      lastPlayed: new Date().toISOString(),
      slot: slot
    };

    // Save to specific slot
    localStorage.setItem(`rapCareer_slot_${slot}`, JSON.stringify(gameState));

    // Load into current game state
    dispatch({ type: 'LOAD_GAME_STATE', payload: gameState });

    navigate('/game/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rap-gold/20 via-ios-orange/20 to-ios-red/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md px-6 py-4 shadow-ios sticky top-0 z-50">
        <div className="flex items-center justify-between pt-8">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : navigate('/menu'))}
            className="p-2 hover:bg-ios-gray6 rounded-full transition-colors"
          >
            <SafeIcon icon={FiChevronLeft} className="text-xl text-ios-blue" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-900">Create Your Rap Persona</h1>
            <div className="flex justify-center space-x-2 mt-2">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step >= num ? 'bg-rap-gold' : 'bg-ios-gray4'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Step 1: Avatar Selection */}
        {step === 1 && (
          <motion.div className="space-y-6" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <div className="text-center">
              <SafeIcon icon={FiUser} className="text-4xl text-rap-gold mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Style</h2>
              <p className="text-ios-gray">Pick your rapper persona</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {avatars.map((avatar) => (
                <motion.button
                  key={avatar.id}
                  onClick={() => setCharacter({ ...character, avatar: avatar.id })}
                  className={`p-4 rounded-2xl transition-all ${
                    character.avatar === avatar.id
                      ? 'bg-gradient-to-br from-rap-gold to-ios-orange shadow-ios-lg border-2 border-rap-gold text-white'
                      : 'bg-white shadow-ios border-2 border-transparent hover:shadow-ios-lg'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-3xl mb-2">{avatar.emoji}</div>
                  <div className={`text-sm font-medium ${character.avatar === avatar.id ? 'text-white' : 'text-gray-900'}`}>
                    {avatar.name}
                  </div>
                  <div className={`text-xs ${character.avatar === avatar.id ? 'text-white/80' : 'text-ios-gray'}`}>
                    {avatar.description}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Stage Name */}
        {step === 2 && (
          <motion.div className="space-y-6" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <div className="text-center">
              <div className="text-4xl mb-4">🎤</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Rap Name</h2>
              <p className="text-ios-gray">What will fans call you?</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-ios p-4">
                <input
                  type="text"
                  value={character.stageName}
                  onChange={(e) => setCharacter({ ...character, stageName: e.target.value })}
                  placeholder="Enter your stage name"
                  className="w-full text-lg font-medium text-gray-900 placeholder-ios-gray bg-transparent border-none outline-none"
                  maxLength={20}
                />
              </div>

              <button
                onClick={generateRandomName}
                className="w-full flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-rap-gold to-ios-orange text-white rounded-2xl hover:shadow-ios-lg transition-all active:scale-95"
              >
                <SafeIcon icon={FiShuffle} className="text-lg" />
                <span className="font-medium">Generate Random Name</span>
              </button>

              {/* Name suggestions */}
              <div className="bg-white/50 p-4 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-2">💡 Name Tips:</h3>
                <div className="text-sm text-ios-gray space-y-1">
                  <p>• Keep it short and memorable</p>
                  <p>• Make it sound cool when announced</p>
                  <p>• Consider your rap style and personality</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: City Selection */}
        {step === 3 && (
          <motion.div className="space-y-6" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <div className="text-center">
              <SafeIcon icon={FiMapPin} className="text-4xl text-rap-gold mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your City</h2>
              <p className="text-ios-gray">Each city provides unique benefits for your career</p>
            </div>

            <div className="space-y-3">
              {cities.map((city) => (
                <motion.button
                  key={city.name}
                  onClick={() => setCharacter({ ...character, city: city.name })}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                    character.city === city.name
                      ? 'bg-gradient-to-r from-rap-gold to-ios-orange shadow-ios-lg text-white'
                      : 'bg-white shadow-ios hover:shadow-ios-lg'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${city.color} rounded-2xl flex items-center justify-center text-xl shadow-lg`}>
                      {city.flag}
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${character.city === city.name ? 'text-white' : 'text-gray-900'}`}>
                        {city.name}
                      </div>
                      <div className={`text-sm ${character.city === city.name ? 'text-white/80' : 'text-ios-blue'}`}>
                        {city.boost}
                      </div>
                      <div className={`text-xs ${character.city === city.name ? 'text-white/60' : 'text-ios-gray'}`}>
                        {city.description}
                      </div>
                    </div>
                  </div>
                  {character.city === city.name && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-rap-gold rounded-full"></div>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Character Preview */}
            <div className="bg-white rounded-2xl shadow-ios p-4">
              <h3 className="font-semibold text-gray-900 mb-3">🎯 Your Rap Persona</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ios-gray">Style:</span>
                  <span className="font-medium text-gray-900">
                    {avatars.find((a) => a.id === character.avatar)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ios-gray">Stage Name:</span>
                  <span className="font-medium text-rap-gold">
                    {character.stageName || 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ios-gray">Home City:</span>
                  <span className="font-medium text-gray-900">{character.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ios-gray">Starting Age:</span>
                  <span className="font-medium text-gray-900">20 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ios-gray">Career Length:</span>
                  <span className="font-medium text-ios-purple">40 years max</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Next Button */}
        <div className="fixed bottom-8 left-6 right-6">
          <button
            onClick={handleNext}
            disabled={step === 2 && !character.stageName.trim()}
            className={`w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-2xl font-semibold text-white transition-all ${
              step === 2 && !character.stageName.trim()
                ? 'bg-ios-gray3 cursor-not-allowed'
                : 'bg-gradient-to-r from-rap-gold to-ios-orange shadow-ios-lg hover:shadow-ios-xl active:scale-95'
            }`}
          >
            <span>{step === 3 ? 'Start Your Rap Career' : 'Continue'}</span>
            <SafeIcon icon={FiArrowRight} className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}