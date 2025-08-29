import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiUsers, FiTrendingUp, FiDollarSign, FiZap, FiCalendar, FiBriefcase, FiMusic, FiGlobe, FiEye, FiPlay } = FiIcons;

export default function HomePage() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { player, tracks, albums, musicVideos, releases, earnings } = state;

  const stats = [
    { icon: FiStar, label: 'Fame', value: player.fame, color: 'text-ios-orange', bgColor: 'bg-ios-orange/10' },
    { icon: FiTrendingUp, label: 'Reputation', value: player.reputation, color: 'text-ios-blue', bgColor: 'bg-ios-blue/10' },
    { icon: FiUsers, label: 'Fans', value: player.fans.toLocaleString(), color: 'text-ios-green', bgColor: 'bg-ios-green/10' },
    { icon: FiDollarSign, label: 'Net Worth', value: `$${player.netWorth.toLocaleString()}`, color: 'text-ios-green', bgColor: 'bg-ios-green/10' }
  ];

  const quickActions = [
    { 
      title: 'Find Work', 
      description: 'Earn money and gain experience',
      icon: FiBriefcase,
      color: 'bg-ios-blue',
      action: () => navigate('/game/job')
    },
    { 
      title: 'Create Music', 
      description: 'Record your next hit track',
      icon: FiMusic,
      color: 'bg-ios-purple',
      action: () => navigate('/game/studio')
    },
    { 
      title: 'Social Media', 
      description: 'Connect with your fans',
      icon: FiGlobe,
      color: 'bg-ios-pink',
      action: () => navigate('/game/social')
    }
  ];

  const newsItems = [
    { icon: '🎤', text: 'New studio equipment available in shop!' },
    { icon: '📈', text: 'Streaming platforms paying higher royalties this month' },
    { icon: '🎭', text: 'Local rap battle competition starting next week' },
    { icon: '💎', text: 'Premium beats collection just dropped' }
  ];

  const topReleases = releases
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  const totalViews = releases.reduce((sum, release) => sum + release.views, 0);

  return (
    <div className="min-h-screen bg-ios-bg pb-24 pt-24">
      <div className="px-6 space-y-6">
        {/* Welcome Section */}
        <motion.div
          className="bg-gradient-to-r from-ios-blue to-ios-purple p-6 rounded-ios-xl text-white shadow-ios-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold mb-2">Welcome back, {player.stageName}!</h1>
          <p className="text-white/80 mb-4">
            Age {player.age} • Week {player.week} of {player.year}
          </p>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiZap} className="text-ios-orange" />
              <span className="text-sm font-medium">{player.energy}/100 Energy</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCalendar} className="text-ios-teal" />
              <span className="text-sm font-medium">{60 - player.age} years left</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white p-4 rounded-ios-lg shadow-ios"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 ${stat.bgColor} rounded-ios`}>
                  <SafeIcon icon={stat.icon} className={`text-lg ${stat.color}`} />
                </div>
                <span className="text-sm font-medium text-ios-gray">{stat.label}</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Weekly Earnings */}
        {earnings.thisWeek > 0 && (
          <motion.div
            className="bg-gradient-to-r from-ios-green to-ios-teal p-4 rounded-ios-lg text-white shadow-ios-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Weekly Earnings</h3>
                <p className="text-white/80">From your releases</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${earnings.thisWeek.toFixed(2)}</div>
                <div className="text-sm text-white/80">This week</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                onClick={action.action}
                className="w-full bg-white p-4 rounded-ios-lg shadow-ios hover:shadow-ios-lg transition-all active:scale-98"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 ${action.color} rounded-ios-lg`}>
                    <SafeIcon icon={action.icon} className="text-xl text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900">{action.title}</div>
                    <div className="text-sm text-ios-gray">{action.description}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Career Summary */}
        <div className="bg-white p-4 rounded-ios-lg shadow-ios">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Career Summary</h2>
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <div className="text-2xl font-bold text-ios-blue">{tracks.length}</div>
              <div className="text-sm text-ios-gray">Tracks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-ios-purple">{albums.length}</div>
              <div className="text-sm text-ios-gray">Albums</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-ios-pink">{musicVideos.length}</div>
              <div className="text-sm text-ios-gray">Videos</div>
            </div>
          </div>
          
          {releases.length > 0 && (
            <div className="grid grid-cols-2 gap-4 text-center pt-4 border-t border-ios-gray5">
              <div>
                <div className="text-xl font-bold text-ios-green">{totalViews.toLocaleString()}</div>
                <div className="text-sm text-ios-gray">Total Views</div>
              </div>
              <div>
                <div className="text-xl font-bold text-ios-orange">${earnings.total.toFixed(2)}</div>
                <div className="text-sm text-ios-gray">Total Earnings</div>
              </div>
            </div>
          )}
        </div>

        {/* Top Releases */}
        {topReleases.length > 0 && (
          <div className="bg-white p-4 rounded-ios-lg shadow-ios">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Top Performing Releases</h2>
            <div className="space-y-3">
              {topReleases.map((release, index) => (
                <motion.div
                  key={release.id}
                  className="flex items-center justify-between p-3 bg-ios-gray6 rounded-ios"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-ios-orange' : index === 1 ? 'bg-ios-gray' : 'bg-ios-orange'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{release.title}</div>
                      <div className="text-sm text-ios-gray capitalize">{release.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-ios-blue">
                      <SafeIcon icon={FiEye} className="text-sm" />
                      <span className="font-bold text-sm">{release.views.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-ios-green">${release.earnings.toFixed(2)}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* News Feed */}
        <div className="bg-white p-4 rounded-ios-lg shadow-ios">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Industry News</h2>
          <div className="space-y-3">
            {newsItems.map((news, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-3 p-3 bg-ios-gray6 rounded-ios"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-lg">{news.icon}</span>
                <p className="text-sm text-gray-700 flex-1">{news.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Next Week Button */}
        <motion.button
          onClick={() => dispatch({ type: 'ADVANCE_WEEK' })}
          className="w-full bg-gradient-to-r from-ios-green to-ios-teal text-white py-4 rounded-ios-lg font-bold shadow-ios-lg hover:shadow-ios-xl transition-all active:scale-98"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <SafeIcon icon={FiPlay} />
            <span>Advance to Next Week</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
}