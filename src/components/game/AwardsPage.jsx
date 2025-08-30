import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiAward, FiStar, FiTrendingUp, FiMusic, FiUsers, FiDollarSign, FiCrown, FiTarget } = FiIcons;

export default function AwardsPage() {
  const { state } = useGame();
  const { player, releases, earnings } = state;
  const [selectedCategory, setSelectedCategory] = useState('achievements');

  // Calculate achievements
  const achievements = [
    {
      id: 'first_track',
      title: 'First Steps',
      description: 'Create your first track',
      icon: FiMusic,
      achieved: state.tracks.length > 0,
      reward: 'Unlocked studio recording',
      rarity: 'Common',
      color: 'bg-ios-gray'
    },
    {
      id: 'viral_hit',
      title: 'Viral Sensation',
      description: 'Get a track with 1M+ views',
      icon: FiTrendingUp,
      achieved: releases.some(r => r.views >= 1000000),
      reward: '+50 Fame bonus',
      rarity: 'Rare',
      color: 'bg-ios-blue'
    },
    {
      id: 'chart_topper',
      title: 'Chart Domination',
      description: 'Reach #1 on the charts',
      icon: FiCrown,
      achieved: releases.some(r => r.chartPosition === 1),
      reward: 'Industry Legend status',
      rarity: 'Legendary',
      color: 'bg-rap-gold'
    },
    {
      id: 'millionaire',
      title: 'Millionaire Status',
      description: 'Accumulate $1,000,000 net worth',
      icon: FiDollarSign,
      achieved: player.netWorth >= 1000000,
      reward: 'Luxury lifestyle unlocked',
      rarity: 'Epic',
      color: 'bg-ios-purple'
    },
    {
      id: 'fan_army',
      title: 'Fan Army',
      description: 'Gain 100,000 fans',
      icon: FiUsers,
      achieved: player.fans >= 100000,
      reward: 'Massive social media boost',
      rarity: 'Epic',
      color: 'bg-ios-green'
    },
    {
      id: 'skill_master',
      title: 'Skill Master',
      description: 'Max out any skill to 100',
      icon: FiTarget,
      achieved: Object.values(player.skills).some(skill => skill >= 100),
      reward: 'Elite performance bonus',
      rarity: 'Legendary',
      color: 'bg-ios-orange'
    }
  ];

  // Calculate awards/records
  const awards = [
    {
      title: 'Most Viewed Release',
      value: Math.max(...releases.map(r => r.views), 0).toLocaleString(),
      release: releases.find(r => r.views === Math.max(...releases.map(rel => rel.views), 0))?.title || 'None',
      icon: FiTrendingUp,
      color: 'text-ios-blue'
    },
    {
      title: 'Highest Chart Position',
      value: releases.filter(r => r.chartPosition).length > 0 
        ? `#${Math.min(...releases.filter(r => r.chartPosition).map(r => r.chartPosition))}`
        : 'No chart entries',
      release: releases.find(r => r.chartPosition === Math.min(...releases.filter(rel => rel.chartPosition).map(rel => rel.chartPosition)))?.title || 'None',
      icon: FiCrown,
      color: 'text-rap-gold'
    },
    {
      title: 'Total Career Earnings',
      value: `$${earnings.total.toLocaleString()}`,
      release: 'All releases combined',
      icon: FiDollarSign,
      color: 'text-ios-green'
    },
    {
      title: 'Peak Weekly Views',
      value: Math.max(...releases.map(r => r.peakWeeklyViews || 0), 0).toLocaleString(),
      release: releases.find(r => r.peakWeeklyViews === Math.max(...releases.map(rel => rel.peakWeeklyViews || 0), 0))?.title || 'None',
      icon: FiStar,
      color: 'text-ios-orange'
    }
  ];

  const categories = [
    { id: 'achievements', name: 'Achievements', icon: FiAward },
    { id: 'records', name: 'Records', icon: FiCrown }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const achievedCount = achievements.filter(a => a.achieved).length;
  const totalAchievements = achievements.length;
  const completionPercentage = (achievedCount / totalAchievements) * 100;

  return (
    <div className="min-h-screen bg-ios-bg pb-24 pt-24">
      <div className="px-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Awards & Achievements</h1>
          <p className="text-ios-gray">Track your career milestones</p>
        </div>

        {/* Progress Overview */}
        <motion.div
          className="bg-gradient-to-r from-ios-blue to-ios-purple p-6 rounded-ios-xl text-white shadow-ios-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🏆</div>
            <h2 className="text-xl font-bold">Career Progress</h2>
            <p className="text-white/80">{achievedCount}/{totalAchievements} Achievements Unlocked</p>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-3 mb-2">
            <motion.div
              className="bg-white h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          
          <div className="text-center text-white/90 text-sm">
            {completionPercentage.toFixed(1)}% Complete
          </div>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex bg-white rounded-ios-xl p-1 shadow-ios">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-ios-lg transition-all ${
                selectedCategory === category.id
                  ? 'bg-ios-blue text-white shadow-ios'
                  : 'text-ios-gray hover:text-gray-900'
              }`}
            >
              <SafeIcon icon={category.icon} className="text-lg" />
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Achievements Tab */}
        {selectedCategory === 'achievements' && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className={`bg-white rounded-ios-lg shadow-ios overflow-hidden ${
                  achievement.achieved ? 'ring-2 ring-ios-green' : ''
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 ${achievement.achieved ? achievement.color : 'bg-ios-gray4'} rounded-ios-lg flex items-center justify-center text-white text-2xl relative`}>
                      <SafeIcon icon={achievement.icon} />
                      {achievement.achieved && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-ios-green rounded-full flex items-center justify-center">
                          <SafeIcon icon={FiStar} className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-bold ${achievement.achieved ? 'text-gray-900' : 'text-ios-gray'}`}>
                          {achievement.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          achievement.rarity === 'Common' ? 'bg-ios-gray/20 text-ios-gray' :
                          achievement.rarity === 'Rare' ? 'bg-ios-blue/20 text-ios-blue' :
                          achievement.rarity === 'Epic' ? 'bg-ios-purple/20 text-ios-purple' :
                          'bg-rap-gold/20 text-rap-gold'
                        }`}>
                          {achievement.rarity}
                        </span>
                      </div>
                      
                      <p className={`text-sm ${achievement.achieved ? 'text-ios-gray' : 'text-ios-gray2'} mb-2`}>
                        {achievement.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${achievement.achieved ? 'text-ios-green' : 'text-ios-gray2'}`}>
                          Reward: {achievement.reward}
                        </span>
                        
                        {achievement.achieved ? (
                          <div className="flex items-center space-x-1 text-ios-green">
                            <SafeIcon icon={FiStar} className="text-sm" />
                            <span className="text-sm font-medium">Unlocked</span>
                          </div>
                        ) : (
                          <div className="text-ios-gray2 text-sm">Locked</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {achievement.achieved && (
                  <div className="bg-ios-green/10 px-4 py-2 border-t border-ios-green/20">
                    <div className="text-ios-green text-sm font-medium">
                      🎉 Achievement Unlocked! Bonus rewards activated.
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Records Tab */}
        {selectedCategory === 'records' && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {awards.map((award, index) => (
              <motion.div
                key={award.title}
                className="bg-white rounded-ios-lg shadow-ios p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-ios-blue to-ios-purple rounded-ios-lg flex items-center justify-center text-white">
                    <SafeIcon icon={award.icon} className="text-xl" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{award.title}</h3>
                    <div className={`text-2xl font-bold ${award.color} mb-1`}>
                      {award.value}
                    </div>
                    <p className="text-sm text-ios-gray">
                      {award.release !== 'None' && award.release !== 'All releases combined' && (
                        <>From: "{award.release}"</>
                      )}
                      {award.release === 'All releases combined' && award.release}
                      {award.release === 'None' && 'No records set yet'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Career Stats Summary */}
        <div className="bg-white rounded-ios-lg shadow-ios p-4">
          <h3 className="font-bold text-gray-900 mb-4">Career Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-ios-gray6 rounded-ios">
              <div className="text-xl font-bold text-ios-blue">{state.tracks.length}</div>
              <div className="text-sm text-ios-gray">Tracks Created</div>
            </div>
            <div className="text-center p-3 bg-ios-gray6 rounded-ios">
              <div className="text-xl font-bold text-ios-purple">{releases.length}</div>
              <div className="text-sm text-ios-gray">Releases</div>
            </div>
            <div className="text-center p-3 bg-ios-gray6 rounded-ios">
              <div className="text-xl font-bold text-ios-green">
                {releases.filter(r => r.isViral).length}
              </div>
              <div className="text-sm text-ios-gray">Viral Hits</div>
            </div>
            <div className="text-center p-3 bg-ios-gray6 rounded-ios">
              <div className="text-xl font-bold text-rap-gold">
                {releases.filter(r => r.chartPosition && r.chartPosition <= 10).length}
              </div>
              <div className="text-sm text-ios-gray">Top 10 Hits</div>
            </div>
          </div>
        </div>

        {/* Next Achievements */}
        <div className="bg-gradient-to-r from-ios-orange to-ios-red p-4 rounded-ios-lg text-white shadow-ios-lg">
          <h3 className="font-bold text-base mb-2">🎯 Next Goals</h3>
          <div className="text-sm text-white/90 space-y-1">
            {!achievements.find(a => a.id === 'viral_hit')?.achieved && (
              <p>• Get 1M views on a single release</p>
            )}
            {!achievements.find(a => a.id === 'chart_topper')?.achieved && (
              <p>• Reach #1 on the music charts</p>
            )}
            {!achievements.find(a => a.id === 'millionaire')?.achieved && (
              <p>• Become a millionaire ($1M net worth)</p>
            )}
            {!achievements.find(a => a.id === 'fan_army')?.achieved && (
              <p>• Build an army of 100K fans</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}