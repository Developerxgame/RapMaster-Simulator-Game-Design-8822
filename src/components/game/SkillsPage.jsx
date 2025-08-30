import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiZap, FiTrendingUp, FiBook, FiMic, FiHeart, FiBriefcase, FiMusic } = FiIcons;

export default function SkillsPage() {
  const { state, dispatch } = useGame();
  const { player } = state;

  const skills = [
    {
      id: 'lyrics',
      name: 'Lyrics',
      icon: FiBook,
      color: 'text-blue-400',
      bgColor: 'bg-ios-blue',
      description: 'Improve your wordplay and storytelling',
      benefits: 'Better track quality, higher sales',
      current: player.skills.lyrics,
      max: 100
    },
    {
      id: 'flow',
      name: 'Flow',
      icon: FiMusic,
      color: 'text-green-400',
      bgColor: 'bg-ios-green',
      description: 'Master your rhythm and delivery',
      benefits: 'More engaging performances, viral potential',
      current: player.skills.flow,
      max: 100
    },
    {
      id: 'charisma',
      name: 'Charisma',
      icon: FiHeart,
      color: 'text-pink-400',
      bgColor: 'bg-ios-pink',
      description: 'Build your stage presence and personality',
      benefits: 'Faster fan growth, better collaborations',
      current: player.skills.charisma,
      max: 100
    },
    {
      id: 'business',
      name: 'Business',
      icon: FiBriefcase,
      color: 'text-yellow-400',
      bgColor: 'bg-ios-orange',
      description: 'Learn the music industry and marketing',
      benefits: 'Higher profits, better deals',
      current: player.skills.business,
      max: 100
    },
    {
      id: 'production',
      name: 'Production',
      icon: FiMic,
      color: 'text-purple-400',
      bgColor: 'bg-ios-purple',
      description: 'Create your own beats and mix tracks',
      benefits: 'Lower costs, unique sound',
      current: player.skills.production,
      max: 100
    }
  ];

  // Calculate upgrade cost based on current level - escalating system
  const getUpgradeCost = (currentLevel) => {
    if (currentLevel < 25) return 2;   // 0-24: 2 energy
    if (currentLevel < 50) return 4;   // 25-49: 4 energy
    if (currentLevel < 75) return 6;   // 50-74: 6 energy
    if (currentLevel < 90) return 8;   // 75-89: 8 energy
    if (currentLevel < 95) return 12;  // 90-94: 12 energy
    if (currentLevel < 98) return 16;  // 95-97: 16 energy
    if (currentLevel < 99) return 25;  // 98: 25 energy
    return 100; // 99-100: 100 energy (max level)
  };

  const upgradeSkill = (skillId) => {
    const skill = skills.find(s => s.id === skillId);
    const cost = getUpgradeCost(skill.current);
    
    if (player.energy >= cost && skill.current < skill.max) {
      dispatch({
        type: 'UPDATE_PLAYER',
        payload: {
          energy: player.energy - cost,
          skills: {
            ...player.skills,
            [skillId]: player.skills[skillId] + 1
          }
        }
      });

      // Add notification for milestone achievements
      const newLevel = player.skills[skillId] + 1;
      if (newLevel === 25 || newLevel === 50 || newLevel === 75 || newLevel === 90 || newLevel === 95 || newLevel === 100) {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now(),
            type: 'success',
            title: `${skill.name} Milestone!`,
            message: `Your ${skill.name.toLowerCase()} skill reached level ${newLevel}! ${newLevel === 100 ? 'MASTERED!' : 'Energy cost increases next upgrade.'}`,
            timestamp: new Date().toISOString()
          }
        });
      }
    }
  };

  const canUpgrade = (skill) => {
    const cost = getUpgradeCost(skill.current);
    return player.energy >= cost && skill.current < skill.max;
  };

  const getSkillLevel = (value) => {
    if (value >= 95) return { name: 'Legendary', color: 'text-rap-gold' };
    if (value >= 90) return { name: 'Master', color: 'text-ios-purple' };
    if (value >= 75) return { name: 'Expert', color: 'text-ios-blue' };
    if (value >= 50) return { name: 'Advanced', color: 'text-ios-green' };
    if (value >= 25) return { name: 'Intermediate', color: 'text-ios-orange' };
    return { name: 'Beginner', color: 'text-ios-gray' };
  };

  const getNextMilestone = (currentLevel) => {
    const milestones = [25, 50, 75, 90, 95, 100];
    return milestones.find(milestone => milestone > currentLevel) || 100;
  };

  return (
    <div className="min-h-screen bg-ios-bg pb-24 pt-24">
      <div className="px-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Skills Training</h1>
          <p className="text-ios-gray">Invest energy to improve your abilities</p>
        </div>

        {/* Energy Status */}
        <div className="bg-white p-4 rounded-ios-lg shadow-ios">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-ios-orange/10 rounded-ios">
                <SafeIcon icon={FiZap} className="text-ios-orange" />
              </div>
              <span className="font-medium text-gray-900">Energy: {player.energy}/100</span>
            </div>
            <span className="text-sm text-ios-gray">Escalating energy costs</span>
          </div>
        </div>

        {/* Energy Cost System Explanation */}
        <div className="bg-white p-4 rounded-ios-lg shadow-ios">
          <h3 className="font-bold text-gray-900 mb-3">Energy Cost System</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-ios-gray">Levels 0-24:</span>
              <span className="font-medium text-ios-orange">2 Energy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ios-gray">Levels 25-49:</span>
              <span className="font-medium text-ios-orange">4 Energy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ios-gray">Levels 50-74:</span>
              <span className="font-medium text-ios-orange">6 Energy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ios-gray">Levels 75-89:</span>
              <span className="font-medium text-ios-orange">8 Energy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ios-gray">Levels 90-94:</span>
              <span className="font-medium text-ios-red">12 Energy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ios-gray">Levels 95-97:</span>
              <span className="font-medium text-ios-red">16 Energy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ios-gray">Level 98:</span>
              <span className="font-medium text-ios-red">25 Energy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ios-gray">Level 99:</span>
              <span className="font-medium text-rap-gold">100 Energy</span>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="space-y-4">
          {skills.map((skill, index) => {
            const cost = getUpgradeCost(skill.current);
            const canUpgradeSkill = canUpgrade(skill);
            const skillLevel = getSkillLevel(skill.current);
            const progress = (skill.current / skill.max) * 100;
            const nextMilestone = getNextMilestone(skill.current);

            return (
              <motion.div
                key={skill.id}
                className="bg-white p-4 rounded-ios-lg shadow-ios"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Skill Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 ${skill.bgColor}/10 rounded-ios-lg`}>
                      <SafeIcon icon={skill.icon} className={`text-xl ${skill.bgColor.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{skill.name}</h3>
                      <p className={`text-sm font-medium ${skillLevel.color}`}>{skillLevel.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{skill.current}/{skill.max}</div>
                    <div className="text-xs text-ios-gray">Level</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-ios-gray5 rounded-full h-3 mb-2 relative">
                    <motion.div
                      className={`h-3 rounded-full ${
                        progress >= 95 ? 'bg-rap-gold' :
                        progress >= 90 ? 'bg-ios-purple' :
                        progress >= 75 ? 'bg-ios-blue' :
                        progress >= 50 ? 'bg-ios-green' :
                        progress >= 25 ? 'bg-ios-orange' : 'bg-ios-gray'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                    {/* Milestone markers */}
                    {[25, 50, 75, 90, 95].map((milestone) => (
                      <div
                        key={milestone}
                        className="absolute top-0 bottom-0 w-0.5 bg-white"
                        style={{ left: `${milestone}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-ios-gray">
                    <span>{progress.toFixed(1)}% Complete</span>
                    <span>Next milestone: {nextMilestone}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4 p-3 bg-ios-gray6 rounded-ios">
                  <p className="text-sm text-gray-700 mb-1">{skill.description}</p>
                  <p className="text-xs text-ios-gray">Benefits: {skill.benefits}</p>
                </div>

                {/* Upgrade Section */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-ios-gray">
                    Upgrade cost: <span className={`font-medium ${
                      cost <= 6 ? 'text-ios-orange' : 
                      cost <= 16 ? 'text-ios-red' : 
                      'text-rap-gold'
                    }`}>
                      {cost} energy
                    </span>
                    {cost > 6 && (
                      <div className="text-xs text-ios-red mt-1">
                        {cost === 100 ? '⚠️ Final upgrade requires full energy!' : '⚠️ High energy cost'}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => upgradeSkill(skill.id)}
                    disabled={!canUpgradeSkill}
                    className={`px-4 py-2 rounded-ios font-semibold transition-all ${
                      canUpgradeSkill
                        ? `${skill.bgColor} text-white shadow-ios hover:shadow-ios-lg active:scale-95`
                        : 'bg-ios-gray4 text-ios-gray cursor-not-allowed'
                    }`}
                  >
                    {skill.current >= skill.max ? 'MASTERED' : 
                     player.energy < cost ? 'Need Energy' : 
                     cost === 100 ? 'FINAL UPGRADE' : 'Upgrade'}
                  </button>
                </div>

                {/* Progress to next milestone */}
                {skill.current < 100 && (
                  <div className="mt-3 p-2 bg-ios-blue/5 rounded-ios">
                    <div className="text-xs text-ios-blue text-center">
                      {nextMilestone - skill.current} levels to next milestone ({nextMilestone})
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Training Tips */}
        <div className="bg-white p-4 rounded-ios-lg shadow-ios">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
            <SafeIcon icon={FiTrendingUp} className="text-ios-blue" />
            <span>Training Tips</span>
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• Energy costs increase as skills get higher</p>
            <p>• Reaching level 100 requires 100 energy (full bar)</p>
            <p>• Plan your upgrades around energy availability</p>
            <p>• Higher skills dramatically improve content quality</p>
            <p>• Mastered skills (100) unlock special bonuses</p>
          </div>
        </div>

        {/* Skill Synergies */}
        <div className="bg-white p-4 rounded-ios-lg shadow-ios">
          <h3 className="font-bold text-gray-900 mb-3">Skill Synergies</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-ios-blue/5 rounded-ios">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-ios-blue font-medium">Lyrics</span>
                <span className="text-ios-gray">+</span>
                <span className="text-ios-green font-medium">Flow</span>
              </div>
              <div className="text-sm text-rap-gold font-medium">Elite track quality</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-ios-pink/5 rounded-ios">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-ios-pink font-medium">Charisma</span>
                <span className="text-ios-gray">+</span>
                <span className="text-ios-orange font-medium">Business</span>
              </div>
              <div className="text-sm text-rap-gold font-medium">Maximum earnings</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-ios-purple/5 rounded-ios">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-ios-purple font-medium">Production</span>
                <span className="text-ios-gray">+</span>
                <span className="text-ios-blue font-medium">Lyrics</span>
              </div>
              <div className="text-sm text-rap-gold font-medium">Signature sound</div>
            </div>
          </div>
        </div>

        {/* Mastery Rewards */}
        <div className="bg-gradient-to-r from-rap-gold to-ios-orange p-4 rounded-ios-lg text-white shadow-ios-lg">
          <h3 className="font-bold mb-3">🏆 Mastery Rewards</h3>
          <div className="space-y-2 text-sm text-white/90">
            <p><span className="font-semibold">Lyrics 100:</span> Write legendary verses</p>
            <p><span className="font-semibold">Flow 100:</span> Perfect rhythm mastery</p>
            <p><span className="font-semibold">Charisma 100:</span> Instant viral potential</p>
            <p><span className="font-semibold">Business 100:</span> Maximum profit margins</p>
            <p><span className="font-semibold">Production 100:</span> Studio ownership unlock</p>
          </div>
        </div>
      </div>
    </div>
  );
}