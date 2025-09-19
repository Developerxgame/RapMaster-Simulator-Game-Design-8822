import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import { getNextCareerLevel, canLevelUp } from '../../utils/careerSystem';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiStar, FiUsers, FiTarget } = FiIcons;

export default function CareerLevelCard({ player }) {
  const currentLevel = player.careerLevel;
  const nextLevel = getNextCareerLevel(currentLevel);
  const canLevel = nextLevel ? canLevelUp(player.fame, player.reputation, currentLevel) : false;

  if (!currentLevel) return null;

  const progressToNext = nextLevel ? {
    fame: Math.min(100, (player.fame / nextLevel.fameRange[0]) * 100),
    reputation: Math.min(100, (player.reputation / nextLevel.reputationRange[0]) * 100)
  } : { fame: 100, reputation: 100 };

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-2xl shadow-ios border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Current Level Display */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-16 h-16 ${currentLevel.color} rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg`}>
            {currentLevel.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{currentLevel.title}</h3>
            <p className="text-sm text-ios-gray">{currentLevel.description}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                Level {currentLevel.id}/8
              </span>
              {canLevel && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium animate-pulse">
                  🎉 Ready to Level Up!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Progress */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700 flex items-center space-x-1">
              <SafeIcon icon={FiStar} className="text-ios-orange" />
              <span>Fame</span>
            </span>
            <span className="text-xs font-bold text-gray-900">{player.fame}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-ios-orange h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${player.fame}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700 flex items-center space-x-1">
              <SafeIcon icon={FiTrendingUp} className="text-ios-blue" />
              <span>Reputation</span>
            </span>
            <span className="text-xs font-bold text-gray-900">{player.reputation}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-ios-blue h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${player.reputation}%` }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Career Benefits */}
      <div className="bg-gray-50 p-3 rounded-xl mb-4">
        <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center space-x-1">
          <SafeIcon icon={FiTarget} className="text-ios-purple" />
          <span>Current Level Benefits</span>
        </h4>
        <div className="flex flex-wrap gap-1">
          {currentLevel.unlocks.map((unlock, index) => (
            <span
              key={index}
              className="text-xs bg-white text-gray-700 px-2 py-1 rounded-full border border-gray-200"
            >
              {unlock}
            </span>
          ))}
        </div>
      </div>

      {/* Next Level Requirements */}
      {nextLevel && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
              <span>{nextLevel.icon}</span>
              <span>Next: {nextLevel.title}</span>
            </h4>
            {canLevel && (
              <div className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-bold animate-pulse">
                READY!
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-600 mb-3">
            Requirements: {nextLevel.fameRange[0]} Fame • {nextLevel.reputationRange[0]} Reputation
          </div>
          
          {/* Progress to Next Level */}
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Fame Progress</span>
                <span className={player.fame >= nextLevel.fameRange[0] ? 'text-green-600 font-bold' : 'text-gray-500'}>
                  {player.fame}/{nextLevel.fameRange[0]}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${player.fame >= nextLevel.fameRange[0] ? 'bg-green-500' : 'bg-ios-orange'}`}
                  style={{ width: `${Math.min(100, progressToNext.fame)}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Reputation Progress</span>
                <span className={player.reputation >= nextLevel.reputationRange[0] ? 'text-green-600 font-bold' : 'text-gray-500'}>
                  {player.reputation}/{nextLevel.reputationRange[0]}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${player.reputation >= nextLevel.reputationRange[0] ? 'bg-green-500' : 'bg-ios-blue'}`}
                  style={{ width: `${Math.min(100, progressToNext.reputation)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Next Level Preview */}
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="text-xs text-gray-600 mb-1">Unlock at {nextLevel.title}:</div>
            <div className="flex flex-wrap gap-1">
              {nextLevel.unlocks.slice(0, 2).map((unlock, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium"
                >
                  {unlock}
                </span>
              ))}
              {nextLevel.unlocks.length > 2 && (
                <span className="text-xs text-blue-600">+{nextLevel.unlocks.length - 2} more</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Legend Status */}
      {!nextLevel && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl border border-yellow-200 text-center">
          <div className="text-2xl mb-2">🏆</div>
          <div className="text-sm font-bold text-gray-900">LEGEND STATUS ACHIEVED!</div>
          <div className="text-xs text-gray-600 mt-1">
            You've reached the pinnacle of musical success. Continue creating to maintain your legacy!
          </div>
        </div>
      )}
    </motion.div>
  );
}