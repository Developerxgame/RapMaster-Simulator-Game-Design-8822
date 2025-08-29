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
      className="min-h-screen bg-gradient-to-br from-ios-indigo via-ios-purple to-rap-dark relative overflow-hidden"
      onClick={handleSkip}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-rap-gold rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {showContent && (
          <>
            {/* Logo */}
            <motion.div
              className="mb-12"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-rap-gold to-ios-orange rounded-ios-xl shadow-ios-xl flex items-center justify-center mb-6">
                <SafeIcon icon={FiMusic} className="text-4xl text-white" />
              </div>
            </motion.div>

            {/* Game title */}
            <motion.h1
              className="text-5xl font-bold text-center mb-3 text-white"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              RapMaster
            </motion.h1>

            <motion.h2
              className="text-xl font-medium text-center mb-8 text-white/80"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Simulator
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-base text-center mb-16 text-white/70 max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Build your rap empire from rookie to legend
            </motion.p>

            {/* Skip hint */}
            <motion.p
              className="text-sm text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              Tap to continue
            </motion.p>
          </>
        )}

        {/* Footer */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <p className="text-sm text-white/50">
            Powered by <span className="text-rap-gold font-semibold">FHX STUDIOS</span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}