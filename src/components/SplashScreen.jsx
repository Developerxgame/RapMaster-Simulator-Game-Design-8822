import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMusic, FiStar, FiTrendingUp } = FiIcons;

export default function SplashScreen() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
    const timer = setTimeout(() => {
      navigate('/menu');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSkip = () => {
    navigate('/menu');
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 relative overflow-hidden cursor-pointer"
      onClick={handleSkip}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Enhanced animated particles */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Enhanced floating music notes */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`note-${i}`}
            className="absolute text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          >
            {['🎵', '🎶', '🎤', '🎸'][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {showContent && (
          <>
            {/* Enhanced Logo with multiple layers */}
            <motion.div
              className="mb-12 relative"
              initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-30"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Main logo */}
              <div className="relative w-28 h-28 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl shadow-2xl flex items-center justify-center">
                <SafeIcon icon={FiMusic} className="text-5xl text-white" />
                
                {/* Inner glow */}
                <motion.div
                  className="absolute inset-2 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-2xl opacity-20"
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              
              {/* Orbital elements */}
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <SafeIcon icon={FiStar} className="text-yellow-500 text-sm" />
              </motion.div>
            </motion.div>

            {/* Enhanced Game title with gradient text */}
            <motion.div
              className="text-center mb-8"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-6xl font-bold text-center mb-3 bg-gradient-to-r from-white via-yellow-200 to-orange-200 bg-clip-text text-transparent">
                RapMaster
              </h1>
              <motion.h2
                className="text-2xl font-medium text-center text-white/90"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Simulator
              </motion.h2>
            </motion.div>

            {/* Enhanced version badge */}
            <motion.div
              className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <span className="text-white/90 font-semibold text-sm">Version 1.1.1</span>
            </motion.div>

            {/* Enhanced Subtitle with typing effect */}
            <motion.p
              className="text-lg text-center mb-16 text-white/80 max-w-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Build your rap empire from rookie to legend
            </motion.p>

            {/* Enhanced progress indicator */}
            <motion.div
              className="flex items-center space-x-3 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-white/60 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
              <span className="text-white/70 text-sm font-medium">Loading...</span>
            </motion.div>

            {/* Enhanced Skip hint */}
            <motion.p
              className="text-sm text-white/60 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              Tap anywhere to continue
            </motion.p>
          </>
        )}

        {/* Enhanced Footer */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <div className="bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full inline-block border border-white/10">
            <p className="text-sm text-white/70">
              Powered by <span className="text-yellow-400 font-bold">FHX STUDIOS</span>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}