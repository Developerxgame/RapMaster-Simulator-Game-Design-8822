import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiZap, FiTrendingUp, FiBook, FiMic, FiHeart, FiBriefcase, FiMusic } = FiIcons;

export default function SkillsPage() {
  const { state, dispatch } = useGame();
  const { player } = state;
  const [selectedSkill, setSelectedSkill] = useState(null);

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

  const getUpgradeCost = (currentLevel) => {
    return currentLevel * 2; // Energy cost increases with level
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
    }
  };

  const canUpgrade = (skill) => {
    const cost = getUpgradeCost(skill.current);
    return player.energy >= cost && skill.current < skill.max;
  };

  const getSkillLevel = (value) => {
    if (value >= 80) return { name: 'Master', color: 'text-rap-gold' };
    if (value >= 60) return { name: 'Expert', color: 'text-ios-purple' };
    if (value >= 40) return { name: 'Advanced', color: 'text-ios-blue' };
    if (value >= 20) return { name: 'Intermediate', color: 'text-ios-green' };
    return { name: 'Beginner', color: 'text-ios-gray' };
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
            <span className="text-sm text-ios-gray">Used to upgrade skills</span>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="space-y-4">
          {skills.map((skill, index) => {
            const cost = getUpgradeCost(skill.current);
            const canUpgradeSkill = canUpgrade(skill);
            const skillLevel = getSkillLevel(skill.current);
            const progress = (skill.current / skill.max) * 100;

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
                  <div className="w-full bg-ios-gray5 rounded-full h-3 mb-2">
                    <motion.div
                      className={`h-3 rounded-full ${
                        progress >= 80 ? 'bg-rap-gold' :
                        progress >= 60 ? 'bg-ios-purple' :
                        progress >= 40 ? 'bg-ios-blue' :
                        progress >= 20 ? 'bg-ios-green' : 'bg-ios-gray'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                  <div className="text-xs text-ios-gray text-center">{progress.toFixed(1)}% Complete</div>
                </div>

                {/* Description */}
                <div className="mb-4 p-3 bg-ios-gray6 rounded-ios">
                  <p className="text-sm text-gray-700 mb-1">{skill.description}</p>
                  <p className="text-xs text-ios-gray">Benefits: {skill.benefits}</p>
                </div>

                {/* Upgrade Section */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-ios-gray">
                    Next upgrade: <span className="text-ios-orange font-medium">{cost} energy</span>
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
                    {skill.current >= skill.max ? 'Maxed' : 
                     player.energy < cost ? 'Need Energy' : 'Upgrade'}
                  </button>
                </div>
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
            <p>• Higher skills improve track quality and earnings</p>
            <p>• Energy cost increases as skills get higher</p>
            <p>• Balanced skills create better overall performance</p>
            <p>• Some opportunities require minimum skill levels</p>
            <p>• Energy regenerates when you advance to the next week</p>
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
              <div className="text-sm text-rap-gold font-medium">Better track quality</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-ios-pink/5 rounded-ios">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-ios-pink font-medium">Charisma</span>
                <span className="text-ios-gray">+</span>
                <span className="text-ios-orange font-medium">Business</span>
              </div>
              <div className="text-sm text-rap-gold font-medium">Higher earnings</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-ios-purple/5 rounded-ios">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-ios-purple font-medium">Production</span>
                <span className="text-ios-gray">+</span>
                <span className="text-ios-blue font-medium">Lyrics</span>
              </div>
              <div className="text-sm text-rap-gold font-medium">Unique sound</div>
            </div>
          </div>
        </div>

        {/* Skill Investment Strategy */}
        <div className="bg-gradient-to-r from-ios-blue to-ios-purple p-4 rounded-ios-lg text-white shadow-ios-lg">
          <h3 className="font-bold mb-3">💡 Pro Tip</h3>
          <p className="text-sm text-white/90">
            Focus on <span className="font-semibold">Lyrics</span> and <span className="font-semibold">Flow</span> early 
            for better track quality, then invest in <span className="font-semibold">Charisma</span> and{' '}
            <span className="font-semibold">Business</span> to maximize your earnings potential!
          </p>
        </div>
      </div>
    </div>
  );
}