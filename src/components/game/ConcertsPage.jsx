import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMic, FiUsers, FiDollarSign, FiZap, FiStar, FiMapPin, FiTrendingUp, FiMusic, FiAward } = FiIcons;

export default function ConcertsPage() {
  const { state, dispatch } = useGame();
  const { player, concerts = [] } = state;
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [performing, setPerforming] = useState(false);
  const [performanceStage, setPerformanceStage] = useState('preparing');
  const performanceRef = useRef(null);

  const venues = [
    {
      id: 1,
      name: 'Local Bar',
      capacity: 50,
      prestige: 1,
      pay: 500,
      energy: 20,
      fameBoost: 5,
      requirements: { fame: 0 },
      location: 'Downtown',
      emoji: '🍺',
      description: 'Small intimate venue for beginners',
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      id: 2,
      name: 'Underground Club',
      capacity: 200,
      prestige: 2,
      pay: 1500,
      energy: 30,
      fameBoost: 15,
      requirements: { fame: 20 },
      location: 'City Center',
      emoji: '🎭',
      description: 'Hip underground scene',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      id: 3,
      name: 'Music Festival',
      capacity: 1000,
      prestige: 3,
      pay: 5000,
      energy: 40,
      fameBoost: 50,
      requirements: { fame: 75 },
      location: 'Festival Grounds',
      emoji: '🎪',
      description: 'Major music festival stage',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      id: 4,
      name: 'Concert Hall',
      capacity: 2500,
      prestige: 4,
      pay: 15000,
      energy: 50,
      fameBoost: 100,
      requirements: { fame: 150 },
      location: 'Uptown',
      emoji: '🎵',
      description: 'Prestigious concert hall',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      id: 5,
      name: 'Arena',
      capacity: 10000,
      prestige: 5,
      pay: 50000,
      energy: 60,
      fameBoost: 250,
      requirements: { fame: 300 },
      location: 'Sports Complex',
      emoji: '🏟️',
      description: 'Massive arena for superstars',
      gradient: 'from-red-500 to-pink-600'
    },
    {
      id: 6,
      name: 'Stadium',
      capacity: 50000,
      prestige: 6,
      pay: 200000,
      energy: 80,
      fameBoost: 500,
      requirements: { fame: 500 },
      location: 'Stadium District',
      emoji: '🏟️',
      description: 'Legendary stadium shows',
      gradient: 'from-yellow-500 to-orange-600'
    }
  ];

  // Fixed performance handler
  const handlePerform = useCallback(
    (venue) => {
      if (player.energy < venue.energy) return;

      // Set initial states
      setPerforming(true);
      setSelectedVenue(venue);
      setPerformanceStage('preparing');

      // Create performance sequence
      const performanceSequence = () => {
        // Stage 1: Preparing (1 second)
        setTimeout(() => {
          if (performanceRef.current) {
            setPerformanceStage('performing');

            // Stage 2: Performing (2.5 seconds)
            setTimeout(() => {
              if (performanceRef.current) {
                setPerformanceStage('finishing');

                // Stage 3: Calculate results (0.5 seconds)
                setTimeout(() => {
                  if (performanceRef.current) {
                    // Performance calculations
                    const charismaBonus = player.skills.charisma / 10;
                    const flowBonus = player.skills.flow / 10;
                    const performanceQuality = Math.min(10, (charismaBonus + flowBonus) / 2);
                    const audienceMultiplier = Math.max(0.5, performanceQuality / 10);
                    const actualPay = Math.floor(venue.pay * audienceMultiplier);
                    const actualFameBoost = Math.floor(venue.fameBoost * audienceMultiplier);

                    const fanRatio = player.fans / venue.capacity;
                    const soldOut = fanRatio >= 1;
                    const soldOutBonus = soldOut ? 1.5 : Math.max(0.3, fanRatio);
                    const finalPay = Math.floor(actualPay * soldOutBonus);
                    const finalFameBoost = Math.floor(actualFameBoost * soldOutBonus);

                    const newConcert = {
                      id: Date.now(),
                      venue: venue.name,
                      date: `${player.week}/${player.year}`,
                      capacity: venue.capacity,
                      attendance: Math.min(venue.capacity, Math.floor(player.fans * 0.8)),
                      earnings: finalPay,
                      performanceQuality: performanceQuality,
                      soldOut: soldOut
                    };

                    // Update game state
                    dispatch({ type: 'ADD_CONCERT', payload: newConcert });
                    dispatch({
                      type: 'UPDATE_PLAYER',
                      payload: {
                        energy: player.energy - venue.energy,
                        netWorth: player.netWorth + finalPay,
                        fame: player.fame + finalFameBoost,
                        reputation: player.reputation + Math.floor(finalFameBoost / 3)
                      }
                    });

                    dispatch({
                      type: 'ADD_NOTIFICATION',
                      payload: {
                        id: Date.now(),
                        type: 'success',
                        title: soldOut ? '🎉 SOLD OUT SHOW!' : '🎤 Concert Complete!',
                        message: `${venue.name}: ${newConcert.attendance}/${venue.capacity} attendance. Earned $${finalPay}!`,
                        timestamp: new Date().toISOString()
                      }
                    });

                    // Final cleanup
                    setTimeout(() => {
                      if (performanceRef.current) {
                        setPerforming(false);
                        setSelectedVenue(null);
                        setPerformanceStage('preparing');
                      }
                    }, 1000);
                  }
                }, 500);
              }
            }, 2500);
          }
        }, 1000);
      };

      performanceSequence();
    },
    [player, dispatch]
  );

  // Cleanup effect
  useEffect(() => {
    return () => {
      setPerforming(false);
      setSelectedVenue(null);
      setPerformanceStage('preparing');
    };
  }, []);

  const canPerform = useCallback(
    (venue) => {
      return player.fame >= venue.requirements.fame && player.energy >= venue.energy;
    },
    [player.fame, player.energy]
  );

  const getAttendanceEstimate = useCallback(
    (venue) => {
      const fanRatio = player.fans / venue.capacity;
      if (fanRatio >= 1) return { text: 'SOLD OUT', color: 'text-green-500', bg: 'bg-green-100' };
      if (fanRatio >= 0.8) return { text: 'Nearly Full', color: 'text-blue-500', bg: 'bg-blue-100' };
      if (fanRatio >= 0.5) return { text: 'Good Crowd', color: 'text-orange-500', bg: 'bg-orange-100' };
      if (fanRatio >= 0.3) return { text: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-100' };
      return { text: 'Small Crowd', color: 'text-red-500', bg: 'bg-red-100' };
    },
    [player.fans]
  );

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Enhanced performance animation component
  const PerformanceAnimation = () => (
    <div
      ref={performanceRef}
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4 z-50 overflow-hidden"
      style={{ touchAction: 'none' }}
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <motion.div
        className="text-center bg-white/10 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/20 relative z-10 max-w-sm w-full mx-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Venue emoji with glow effect */}
        <motion.div
          className="text-6xl mb-6 relative"
          animate={{
            scale: performanceStage === 'performing' ? [1, 1.1, 1] : 1
          }}
          transition={{
            duration: 0.8,
            repeat: performanceStage === 'performing' ? Infinity : 0
          }}
        >
          {selectedVenue?.emoji}
          {performanceStage === 'performing' && (
            <motion.div
              className="absolute inset-0 text-6xl blur-sm opacity-50"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              {selectedVenue?.emoji}
            </motion.div>
          )}
        </motion.div>

        {/* Performance stage text */}
        <motion.h2
          className="text-xl font-bold text-white mb-4"
          key={performanceStage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {performanceStage === 'preparing' && 'Getting Ready...'}
          {performanceStage === 'performing' && `Performing at ${selectedVenue?.name}`}
          {performanceStage === 'finishing' && 'Show Complete!'}
        </motion.h2>

        <motion.p
          className="text-white/80 mb-8 text-base"
          key={`${performanceStage}-desc`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {performanceStage === 'preparing' && 'Warming up and checking the sound...'}
          {performanceStage === 'performing' && 'The crowd is loving every moment! 🔥'}
          {performanceStage === 'finishing' && 'What an incredible performance!'}
        </motion.p>

        {/* Loading indicator */}
        <div className="flex justify-center mb-6">
          <motion.div
            className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Attendance estimate */}
        {selectedVenue && (
          <motion.div
            className="text-white/70 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Expected attendance: {getAttendanceEstimate(selectedVenue).text}
          </motion.div>
        )}
      </motion.div>
    </div>
  );

  if (performing && selectedVenue) {
    return (
      <AnimatePresence mode="wait">
        <PerformanceAnimation />
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-ios-bg pb-20 pt-20 safe-area-top safe-area-bottom">
      <div className="px-4 space-y-6 max-w-md mx-auto">
        {/* Header */}
        <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🎤 Live Concerts</h1>
          <p className="text-ios-gray">Perform live and connect with your fans</p>
        </motion.div>

        {/* Player Status */}
        <motion.div
          className="bg-white p-4 rounded-2xl shadow-ios border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-orange-50 rounded-xl">
              <div className="text-lg font-bold text-orange-600">{player.energy}/100</div>
              <div className="text-xs font-medium text-orange-500">Energy</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <div className="text-lg font-bold text-blue-600">{formatNumber(player.fans)}</div>
              <div className="text-xs font-medium text-blue-500">Fans</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <div className="text-lg font-bold text-purple-600">{player.skills.charisma}/100</div>
              <div className="text-xs font-medium text-purple-500">Charisma</div>
            </div>
          </div>
        </motion.div>

        {/* Concert Tips */}
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl text-white shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className="font-bold mb-3 flex items-center">
            <span className="text-2xl mr-2">💡</span>
            Concert Tips
          </h3>
          <div className="text-sm text-white/90 space-y-1">
            <p>• Higher charisma and flow = better performances</p>
            <p>• More fans = higher attendance and pay</p>
            <p>• Sold out shows give bonus fame and earnings</p>
            <p>• Build your skills to unlock bigger venues</p>
          </div>
        </motion.div>

        {/* Available Venues */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Available Venues</h2>
          <div className="space-y-4">
            {venues.map((venue, index) => {
              const available = canPerform(venue);
              const attendanceData = getAttendanceEstimate(venue);
              return (
                <motion.div
                  key={venue.id}
                  className={`bg-white rounded-2xl shadow-lg border transition-all duration-300 ${
                    available ? 'hover:shadow-xl border-gray-200' : 'opacity-60 border-gray-100'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={available ? { y: -2 } : {}}
                >
                  <div className="p-4">
                    {/* Venue header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4 flex-1">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${venue.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}
                        >
                          {venue.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg truncate">{venue.name}</h3>
                          <div className="flex items-center space-x-2 text-gray-600 mb-1">
                            <SafeIcon icon={FiMapPin} className="text-sm flex-shrink-0" />
                            <span className="text-sm truncate">{venue.location}</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{venue.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="truncate">Capacity: {formatNumber(venue.capacity)}</span>
                            <span>•</span>
                            <span className="flex items-center space-x-1 truncate">
                              <SafeIcon icon={FiStar} className="text-amber-500 flex-shrink-0" />
                              <span>Prestige: {venue.prestige}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expected Attendance */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Expected Attendance:</span>
                        <span
                          className={`text-sm font-bold px-2 py-1 rounded-full ${attendanceData.bg} ${attendanceData.color}`}
                        >
                          {attendanceData.text}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            attendanceData.text === 'SOLD OUT'
                              ? 'bg-green-500'
                              : attendanceData.text === 'Nearly Full'
                              ? 'bg-blue-500'
                              : attendanceData.text === 'Good Crowd'
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, (player.fans / venue.capacity) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-3 bg-green-50 rounded-xl">
                        <SafeIcon icon={FiDollarSign} className="text-green-600 mx-auto mb-1" />
                        <div className="text-sm font-bold text-gray-900">${formatNumber(venue.pay)}</div>
                        <div className="text-xs text-green-600">Base Pay</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-xl">
                        <SafeIcon icon={FiZap} className="text-orange-600 mx-auto mb-1" />
                        <div className="text-sm font-bold text-gray-900">{venue.energy}</div>
                        <div className="text-xs text-orange-600">Energy</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-xl">
                        <SafeIcon icon={FiTrendingUp} className="text-blue-600 mx-auto mb-1" />
                        <div className="text-sm font-bold text-gray-900">+{venue.fameBoost}</div>
                        <div className="text-xs text-blue-600">Fame</div>
                      </div>
                    </div>

                    {/* Requirements */}
                    {!available && (
                      <div className="mb-3 p-3 bg-red-50 rounded-xl border border-red-200">
                        <p className="text-sm text-red-700 font-medium mb-1">Requirements:</p>
                        <div className="text-xs text-red-600">
                          {player.fame < venue.requirements.fame && (
                            <span>• Need {venue.requirements.fame} fame (you have {player.fame})</span>
                          )}
                          {player.energy < venue.energy && (
                            <span>• Need {venue.energy} energy (you have {player.energy})</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Perform Button */}
                    <button
                      onClick={() => handlePerform(venue)}
                      disabled={!available}
                      className={`w-full py-4 px-4 rounded-xl font-semibold transition-all duration-300 min-h-14 ${
                        available
                          ? `bg-gradient-to-r ${venue.gradient} text-white shadow-lg hover:shadow-xl active:scale-95`
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <SafeIcon icon={FiMic} />
                        <span>{available ? 'Perform Here' : 'Requirements Not Met'}</span>
                      </div>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Concert History */}
        {concerts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Concert History</h2>
            <div className="space-y-3">
              {concerts
                .slice(-5)
                .reverse()
                .map((concert, index) => (
                  <motion.div
                    key={concert.id}
                    className="bg-white p-4 rounded-2xl shadow-ios border border-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 truncate">{concert.venue}</h4>
                        <p className="text-sm text-gray-500">{concert.date}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>
                            {concert.attendance}/{concert.capacity} attendance
                          </span>
                          {concert.soldOut && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                              SOLD OUT!
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="text-lg font-bold text-green-600">${formatNumber(concert.earnings)}</div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <SafeIcon
                              key={i}
                              icon={FiStar}
                              className={`text-xs ${
                                i < concert.performanceQuality ? 'text-amber-500' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}