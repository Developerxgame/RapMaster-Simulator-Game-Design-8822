import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import CareerLevelCard from './CareerLevelCard';
import * as FiIcons from 'react-icons/fi';

const {
  FiStar, FiUsers, FiTrendingUp, FiDollarSign, FiZap, FiCalendar,
  FiBriefcase, FiMusic, FiGlobe, FiShoppingBag, FiEye, FiPlay, FiBarChart
} = FiIcons;

export default function HomePage() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { player, tracks, albums, musicVideos, releases, earnings, careerStats } = state;

  const formatNumber = (num) => {
    if (num >= 1000000000000) {
      return `${(num / 1000000000000).toFixed(1)}T`;
    } else if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatMoney = (amount) => {
    const wholeAmount = Math.floor(amount);
    if (wholeAmount >= 1000000) {
      return `$${(wholeAmount / 1000000).toFixed(1)}M`;
    } else if (wholeAmount >= 1000) {
      return `$${(wholeAmount / 1000).toFixed(1)}K`;
    }
    return `$${wholeAmount}`;
  };

  const stats = [
    { icon: FiStar, label: 'Fame', value: `${player.fame}/100`, color: 'text-ios-orange', bgColor: 'bg-ios-orange/10' },
    { icon: FiTrendingUp, label: 'Reputation', value: `${player.reputation}/100`, color: 'text-ios-blue', bgColor: 'bg-ios-blue/10' },
    { icon: FiUsers, label: 'Fans', value: formatNumber(player.fans), color: 'text-ios-green', bgColor: 'bg-ios-green/10' },
    { icon: FiDollarSign, label: 'Net Worth', value: formatMoney(player.netWorth), color: 'text-ios-green', bgColor: 'bg-ios-green/10' }
  ];

  // Icons only quick actions as requested
  const quickActions = [
    { title: 'Work', icon: FiBriefcase, color: 'bg-gradient-to-br from-ios-blue to-blue-600', action: () => navigate('/game/job') },
    { title: 'Studio', icon: FiMusic, color: 'bg-gradient-to-br from-ios-purple to-purple-600', action: () => navigate('/game/studio') },
    { title: 'Social', icon: FiGlobe, color: 'bg-gradient-to-br from-ios-pink to-pink-600', action: () => navigate('/game/social') },
    { title: 'Shop', icon: FiShoppingBag, color: 'bg-gradient-to-br from-ios-green to-green-600', action: () => navigate('/game/shop') }
  ];

  const newsItems = [
    { icon: '🎤', text: 'New studio equipment available in shop!' },
    { icon: '📈', text: 'Streaming platforms paying higher royalties this month' },
    { icon: '🎭', text: 'Local music competition starting next week' },
    { icon: '💎', text: 'Premium beats collection just dropped' }
  ];

  const topReleases = releases
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  const totalViews = releases.reduce((sum, release) => sum + release.views, 0);
  const viralHits = releases.filter(r => r.isViral).length;
  const trendingReleases = releases.filter(r => r.trending).length;
  const chartHits = releases.filter(r => r.chartPosition && r.chartPosition <= 10).length;

  // Enhanced date formatting
  const getDateString = () => {
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = Math.ceil(player.week / 4.33);
    const monthName = monthNames[(month - 1) % 12];
    return `W${player.week} ${monthName} ${player.year}`;
  };

  return (
    <div className="min-h-screen bg-ios-bg pb-24 pt-20 safe-area-top safe-area-bottom">
      <div className="px-4 space-y-4 max-w-lg mx-auto">
        {/* Welcome Section with Career Level */}
        <motion.div
          className="bg-gradient-to-r from-rap-gold via-ios-orange to-ios-red p-4 rounded-2xl text-white shadow-ios-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold mb-1">🎤 What's good, {player.stageName}!</h1>
              <p className="text-white/80 text-sm">
                {player.careerLevel?.title || 'Rookie Musician'} • Age {player.age}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl mb-1">{player.careerLevel?.icon || '🎤'}</div>
              <div className="text-xs text-white/70">Level {player.careerLevel?.id || 1}</div>
            </div>
          </div>
          <p className="text-white/80 mb-3 text-sm">
            {getDateString()} • Consistency: {Math.floor(player.consistencyScore * 100)}%
          </p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiZap} className="text-ios-orange" />
              <span className="font-medium">{player.energy}/100 Energy</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCalendar} className="text-ios-teal" />
              <span className="font-medium">Week {player.week}</span>
            </div>
          </div>
        </motion.div>

        {/* Career Level Card */}
        <CareerLevelCard player={player} />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white p-3 rounded-2xl shadow-ios"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className={`p-2 ${stat.bgColor} rounded-xl`}>
                  <SafeIcon icon={stat.icon} className={`text-sm ${stat.color}`} />
                </div>
                <span className="text-xs font-medium text-ios-gray truncate">{stat.label}</span>
              </div>
              <div className="text-lg font-bold text-gray-900 truncate">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions - Icons Only */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                onClick={action.action}
                className={`aspect-square ${action.color} p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex flex-col items-center justify-center`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={action.icon} className="text-2xl text-white mb-1" />
                <span className="text-xs font-medium text-white">{action.title}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Enhanced Performance Dashboard */}
        <div className="bg-white p-4 rounded-2xl shadow-ios">
          <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center space-x-2">
            <SafeIcon icon={FiBarChart} className="text-ios-blue" />
            <span>Career Analytics</span>
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="text-center p-3 bg-ios-gray6 rounded-xl">
              <div className="text-lg font-bold text-ios-blue">{formatNumber(careerStats.totalStreams)}</div>
              <div className="text-xs text-ios-gray">Total Streams</div>
            </div>
            <div className="text-center p-3 bg-ios-gray6 rounded-xl">
              <div className="text-lg font-bold text-ios-green">{formatNumber(careerStats.totalAlbumSales)}</div>
              <div className="text-xs text-ios-gray">Album Sales</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-ios-red/10 rounded-xl">
              <div className="text-base font-bold text-ios-red">{viralHits}</div>
              <div className="text-xs text-ios-gray">Viral</div>
            </div>
            <div className="p-2 bg-ios-orange/10 rounded-xl">
              <div className="text-base font-bold text-ios-orange">{trendingReleases}</div>
              <div className="text-xs text-ios-gray">Trending</div>
            </div>
            <div className="p-2 bg-ios-purple/10 rounded-xl">
              <div className="text-base font-bold text-ios-purple">{chartHits}</div>
              <div className="text-xs text-ios-gray">Chart Hits</div>
            </div>
          </div>
        </div>

        {/* Social Media Growth Display */}
        <div className="bg-white p-4 rounded-2xl shadow-ios">
          <h2 className="text-base font-bold text-gray-900 mb-3">Social Media Growth</h2>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-pink-500">{formatNumber(player.socialMedia.rapgram.followers)}</div>
              <div className="text-xs text-ios-gray">RapGram</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-500">{formatNumber(player.socialMedia.raptube.subscribers)}</div>
              <div className="text-xs text-ios-gray">RapTube</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-500">{formatNumber(player.socialMedia.rapify.listeners)}</div>
              <div className="text-xs text-ios-gray">Rapify</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-500">{formatNumber(player.socialMedia.riktok.followers)}</div>
              <div className="text-xs text-ios-gray">RikTok</div>
            </div>
          </div>
          <div className="mt-3 p-2 bg-ios-gray6 rounded-xl text-center">
            <div className="text-sm text-ios-gray">
              Career Level Multiplier: <span className="font-medium text-ios-blue">x{1 + (player.careerLevel?.id || 1) * 0.2}</span>
            </div>
          </div>
        </div>

        {/* Weekly Earnings */}
        {earnings.thisWeek > 0 && (
          <motion.div
            className="bg-gradient-to-r from-ios-green to-ios-teal p-4 rounded-2xl text-white shadow-ios-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Weekly Earnings</h3>
                <p className="text-white/80 text-sm">From your releases</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">${Math.floor(earnings.thisWeek)}</div>
                <div className="text-xs text-white/80">This week</div>
                {earnings.albumSales > 0 && (
                  <div className="text-xs text-white/80">+${Math.floor(earnings.albumSales)} albums</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Career Summary */}
        <div className="bg-white p-4 rounded-2xl shadow-ios">
          <h2 className="text-base font-bold text-gray-900 mb-3">Career Summary</h2>
          <div className="grid grid-cols-3 gap-3 text-center mb-3">
            <div>
              <div className="text-xl font-bold text-ios-blue">{tracks.length}</div>
              <div className="text-xs text-ios-gray">Tracks</div>
            </div>
            <div>
              <div className="text-xl font-bold text-ios-purple">{albums.length}</div>
              <div className="text-xs text-ios-gray">Albums</div>
            </div>
            <div>
              <div className="text-xl font-bold text-ios-pink">{musicVideos.length}</div>
              <div className="text-xs text-ios-gray">Videos</div>
            </div>
          </div>
          {releases.length > 0 && (
            <div className="grid grid-cols-2 gap-3 text-center pt-3 border-t border-ios-gray5">
              <div>
                <div className="text-lg font-bold text-ios-green">{formatNumber(totalViews)}</div>
                <div className="text-xs text-ios-gray">Total Views</div>
              </div>
              <div>
                <div className="text-lg font-bold text-ios-orange">${Math.floor(earnings.total)}</div>
                <div className="text-xs text-ios-gray">Total Earnings</div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Top Releases */}
        {topReleases.length > 0 && (
          <div className="bg-white p-4 rounded-2xl shadow-ios">
            <h2 className="text-base font-bold text-gray-900 mb-3">Top Performing Releases</h2>
            <div className="space-y-3">
              {topReleases.map((release, index) => (
                <motion.div
                  key={release.id}
                  className="flex items-center justify-between p-3 bg-ios-gray6 rounded-xl"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                        index === 0 ? 'bg-rap-gold' : index === 1 ? 'bg-ios-gray' : 'bg-ios-orange'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm flex items-center space-x-1">
                        <span className="truncate">{release.title}</span>
                        {release.isViral && <span className="text-xs">🔥</span>}
                        {release.trending && <span className="text-xs">📈</span>}
                        {release.chartPosition && release.chartPosition <= 10 && (
                          <span className="text-xs bg-yellow-100 text-yellow-600 px-1 rounded">#{release.chartPosition}</span>
                        )}
                      </div>
                      <div className="text-xs text-ios-gray">
                        {release.type === 'video' ? 'RapTube Video' : 'Rapify ' + release.type} • Quality: {release.qualityRating || 'N/A'}/10
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="flex items-center space-x-1 text-ios-blue">
                      <SafeIcon icon={FiEye} className="text-xs" />
                      <span className="font-bold text-xs">{formatNumber(release.views)}</span>
                    </div>
                    <div className="text-xs text-ios-green">${Math.floor(release.earnings)}</div>
                    {release.albumSales > 0 && (
                      <div className="text-xs text-ios-purple">{formatNumber(release.albumSales)} sales</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Industry News */}
        <div className="bg-white p-4 rounded-2xl shadow-ios">
          <h2 className="text-base font-bold text-gray-900 mb-3">Industry News</h2>
          <div className="space-y-2">
            {newsItems.map((news, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-3 p-3 bg-ios-gray6 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-base flex-shrink-0">{news.icon}</span>
                <p className="text-sm text-gray-700 flex-1">{news.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Next Week Button */}
        <motion.button
          onClick={() => dispatch({ type: 'ADVANCE_WEEK' })}
          className="w-full bg-gradient-to-r from-ios-green to-ios-teal text-white py-4 rounded-2xl font-bold shadow-ios-lg hover:shadow-ios-xl transition-all active:scale-98"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <SafeIcon icon={FiPlay} />
            <span className="text-base">Advance to Next Week (Refill Energy)</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
}