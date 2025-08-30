import React from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiTrendingUp, FiUsers, FiDollarSign, FiMusic, FiDisc, FiVideo, FiCalendar, FiTarget, FiEye, FiPlay, FiYoutube, FiAward, FiCrown, FiBarChart, FiActivity } = FiIcons;

export default function StatsPage() {
  const { state } = useGame();
  const { player, tracks, albums, musicVideos, releases, earnings } = state;

  const mainStats = [
    { icon: FiStar, label: 'Fame', value: player.fame, color: 'text-yellow-400', description: 'Your popularity in the rap scene' },
    { icon: FiTrendingUp, label: 'Reputation', value: player.reputation, color: 'text-blue-400', description: 'How respected you are in the industry' },
    { icon: FiUsers, label: 'Fans', value: player.fans.toLocaleString(), color: 'text-green-400', description: 'Your loyal fanbase' },
    { icon: FiDollarSign, label: 'Net Worth', value: `$${player.netWorth.toLocaleString()}`, color: 'text-green-400', description: 'Your total wealth' }
  ];

  const careerStats = [
    { icon: FiMusic, label: 'Tracks Created', value: tracks.length, color: 'text-purple-400' },
    { icon: FiDisc, label: 'Albums Released', value: albums.filter(a => a.released).length, color: 'text-orange-400' },
    { icon: FiVideo, label: 'Music Videos', value: musicVideos.length, color: 'text-red-400' },
    { icon: FiPlay, label: 'Total Releases', value: releases.length, color: 'text-pink-400' }
  ];

  const earningsStats = [
    { icon: FiDollarSign, label: 'Total Earnings', value: `$${earnings.total.toFixed(2)}`, color: 'text-green-400' },
    { icon: FiTrendingUp, label: 'This Week', value: `$${earnings.thisWeek.toFixed(2)}`, color: 'text-blue-400' },
    { icon: FiMusic, label: 'Streaming', value: `$${earnings.streaming.toFixed(2)}`, color: 'text-purple-400' },
    { icon: FiYoutube, label: 'YouTube', value: `$${earnings.youtube.toFixed(2)}`, color: 'text-red-400' }
  ];

  const socialStats = [
    { platform: 'RapGram', followers: player.socialMedia.rapgram.followers, color: 'text-pink-500' },
    { platform: 'RapTube', followers: player.socialMedia.raptube.subscribers, color: 'text-red-500' },
    { platform: 'Rapify', followers: player.socialMedia.rapify.listeners, color: 'text-green-500' },
    { platform: 'RikTok', followers: player.socialMedia.riktok.followers, color: 'text-purple-500' }
  ];

  const skillLevels = [
    { name: 'Lyrics', value: player.skills.lyrics, max: 100, color: 'bg-blue-500' },
    { name: 'Flow', value: player.skills.flow, max: 100, color: 'bg-green-500' },
    { name: 'Charisma', value: player.skills.charisma, max: 100, color: 'bg-yellow-500' },
    { name: 'Business', value: player.skills.business, max: 100, color: 'bg-purple-500' },
    { name: 'Production', value: player.skills.production, max: 100, color: 'bg-red-500' }
  ];

  const getProgressColor = (value, max) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCareerLevel = () => {
    const totalFame = player.fame;
    if (totalFame >= 1000) return { level: 'Rap Legend', icon: '👑', color: 'text-rap-gold', description: 'Hall of Fame Status' };
    if (totalFame >= 500) return { level: 'Superstar', icon: '⭐', color: 'text-yellow-400', description: 'Mainstream Success' };
    if (totalFame >= 200) return { level: 'Rising Star', icon: '🌟', color: 'text-blue-400', description: 'Breaking Through' };
    if (totalFame >= 50) return { level: 'Known Artist', icon: '🎤', color: 'text-green-400', description: 'Industry Recognition' };
    if (totalFame >= 10) return { level: 'Underground', icon: '🎭', color: 'text-purple-400', description: 'Building Buzz' };
    return { level: 'Rookie', icon: '🎯', color: 'text-gray-400', description: 'Starting Out' };
  };

  const totalViews = releases.reduce((sum, release) => sum + release.views, 0);
  const totalStreams = releases.reduce((sum, release) => sum + (release.streams || 0), 0);
  const avgViewsPerRelease = releases.length > 0 ? Math.floor(totalViews / releases.length) : 0;
  const trendingReleases = releases.filter(r => r.trending).length;
  const chartHits = releases.filter(r => r.chartPosition && r.chartPosition <= 10).length;
  const viralHits = releases.filter(r => r.isViral).length;
  
  const careerLevel = getCareerLevel();

  // Enhanced performance metrics
  const thisWeekViews = releases.reduce((sum, release) => sum + (release.weeklyViews || 0), 0);
  const peakWeeklyViews = Math.max(...releases.map(r => r.peakWeeklyViews || 0), 0);
  const avgWeeklyViews = releases.length > 0 ? 
    releases.reduce((sum, release) => sum + (release.avgWeeklyViews || 0), 0) / releases.length : 0;

  // Calculate milestones
  const milestones = [
    { achieved: player.fame >= 50, title: 'Known Artist', description: 'Reach 50 fame', icon: FiStar },
    { achieved: player.fans >= 1000, title: 'Fan Base', description: 'Get 1,000 fans', icon: FiUsers },
    { achieved: tracks.length >= 10, title: 'Prolific Creator', description: 'Create 10 tracks', icon: FiMusic },
    { achieved: albums.length >= 3, title: 'Album Artist', description: 'Release 3 albums', icon: FiDisc },
    { achieved: totalViews >= 100000, title: 'Viral Success', description: '100K total views', icon: FiEye },
    { achieved: earnings.total >= 10000, title: 'Money Maker', description: 'Earn $10,000', icon: FiDollarSign },
    { achieved: chartHits >= 1, title: 'Chart Success', description: 'Get a top 10 hit', icon: FiAward },
    { achieved: player.netWorth >= 100000, title: 'Wealthy Artist', description: 'Net worth $100K', icon: FiCrown },
    { achieved: viralHits >= 1, title: 'Viral Star', description: 'Get a viral hit', icon: FiActivity },
    { achieved: totalViews >= 1000000, title: 'Million Views', description: '1M total views', icon: FiBarChart }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-ios-bg pb-24 pt-24">
      <div className="px-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Career Statistics</h1>
          <p className="text-ios-gray">Track your rise to fame</p>
        </div>

        {/* Career Level */}
        <motion.div
          className="bg-gradient-to-r from-ios-blue to-ios-purple p-6 rounded-ios-xl text-center text-white shadow-ios-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-4xl mb-2">{careerLevel.icon}</div>
          <h2 className="text-2xl font-bold mb-1">{careerLevel.level}</h2>
          <p className="text-white/80 mb-2">{careerLevel.description}</p>
          <p className="text-white/60 mb-4">
            {player.stageName} • Age {player.age} • {player.city}
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div>
              <div className="font-bold">{player.week}</div>
              <div className="text-white/70">Week</div>
            </div>
            <div>
              <div className="font-bold">{player.year}</div>
              <div className="text-white/70">Year</div>
            </div>
            <div>
              <div className="font-bold">{60 - player.age}</div>
              <div className="text-white/70">Years Left</div>
            </div>
          </div>
        </motion.div>

        {/* Main Stats */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Main Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            {mainStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white p-4 rounded-ios-lg shadow-ios"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <SafeIcon icon={stat.icon} className={`text-xl ${stat.color}`} />
                  <span className="text-sm font-medium text-ios-gray">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <p className="text-xs text-ios-gray2">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enhanced Performance Metrics */}
        <div className="bg-white p-4 rounded-ios-lg shadow-ios">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <SafeIcon icon={FiBarChart} className="text-ios-blue" />
            <span>Performance Analytics</span>
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-ios-gray6 rounded-ios">
              <div className="text-2xl font-bold text-ios-blue">{formatNumber(totalViews)}</div>
              <div className="text-sm text-ios-gray">Total Views</div>
            </div>
            <div className="text-center p-3 bg-ios-gray6 rounded-ios">
              <div className="text-2xl font-bold text-ios-green">{formatNumber(totalStreams)}</div>
              <div className="text-sm text-ios-gray">Total Streams</div>
            </div>
            <div className="text-center p-3 bg-ios-gray6 rounded-ios">
              <div className="text-2xl font-bold text-ios-orange">{formatNumber(thisWeekViews)}</div>
              <div className="text-sm text-ios-gray">This Week Views</div>
            </div>
            <div className="text-center p-3 bg-ios-gray6 rounded-ios">
              <div className="text-2xl font-bold text-ios-purple">{formatNumber(peakWeeklyViews)}</div>
              <div className="text-sm text-ios-gray">Peak Weekly Views</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-ios-red">{viralHits}</div>
              <div className="text-xs text-ios-gray">Viral Hits</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-ios-blue">{chartHits}</div>
              <div className="text-xs text-ios-gray">Chart Hits</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-ios-green">{trendingReleases}</div>
              <div className="text-xs text-ios-gray">Trending Now</div>
            </div>
          </div>
        </div>

        {/* Social Media Overview */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Social Media Following</h2>
          <div className="bg-white p-4 rounded-ios-lg shadow-ios">
            <div className="grid grid-cols-2 gap-4">
              {socialStats.map((social, index) => (
                <motion.div
                  key={social.platform}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`text-xl font-bold ${social.color}`}>
                    {social.followers.toLocaleString()}
                  </div>
                  <div className="text-sm text-ios-gray">{social.platform}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Earnings Overview */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Earnings Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            {earningsStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white p-4 rounded-ios-lg shadow-ios text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SafeIcon icon={stat.icon} className={`text-2xl ${stat.color} mx-auto mb-2`} />
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-ios-gray">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Career Stats */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Content Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            {careerStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white p-4 rounded-ios-lg shadow-ios text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SafeIcon icon={stat.icon} className={`text-2xl ${stat.color} mx-auto mb-2`} />
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-ios-gray">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skills Overview */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Skills Overview</h2>
          <div className="space-y-4">
            {skillLevels.map((skill, index) => (
              <motion.div
                key={skill.name}
                className="bg-white p-4 rounded-ios-lg shadow-ios"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">{skill.name}</span>
                  <span className="text-sm text-ios-gray">{skill.value}/{skill.max}</span>
                </div>
                <div className="w-full bg-ios-gray5 rounded-full h-2">
                  <motion.div
                    className={`${getProgressColor(skill.value, skill.max)} h-2 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(skill.value / skill.max) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Releases with Enhanced Stats */}
        {releases.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Top Performing Releases</h2>
            <div className="space-y-3">
              {releases
                .sort((a, b) => b.views - a.views)
                .slice(0, 5)
                .map((release, index) => (
                  <motion.div
                    key={release.id}
                    className="bg-white p-4 rounded-ios-lg shadow-ios"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-rap-gold' : index === 1 ? 'bg-ios-gray' : 'bg-ios-orange'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 flex items-center space-x-2 mb-1">
                            <span className="truncate">{release.title}</span>
                            {release.isViral && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">🔥 VIRAL</span>}
                            {release.trending && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">📈 TRENDING</span>}
                            {release.chartPosition && release.chartPosition <= 10 && (
                              <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                                #{release.chartPosition}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-ios-gray capitalize mb-1">{release.type}</div>
                          <div className="flex items-center space-x-4 text-xs text-ios-gray2">
                            <span>Weekly: {formatNumber(release.weeklyViews || 0)}</span>
                            <span>Peak: {formatNumber(release.peakWeeklyViews || 0)}</span>
                            {release.growthRate && (
                              <span className={release.growthRate > 0 ? 'text-ios-green' : 'text-ios-red'}>
                                {release.growthRate > 0 ? '↗' : '↘'} {Math.abs(release.growthRate).toFixed(1)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-ios-blue mb-1">
                          <SafeIcon icon={FiEye} className="text-sm" />
                          <span className="font-bold">{formatNumber(release.views)}</span>
                        </div>
                        <div className="text-sm text-ios-green">${release.earnings.toFixed(2)}</div>
                        {release.streams && (
                          <div className="text-xs text-ios-purple">{formatNumber(release.streams)} streams</div>
                        )}
                      </div>
                    </div>
                    
                    {/* Performance indicators */}
                    <div className="flex items-center space-x-2 text-xs">
                      <div className={`px-2 py-1 rounded-full ${
                        release.ageMultiplier > 0.8 ? 'bg-ios-green/10 text-ios-green' :
                        release.ageMultiplier > 0.5 ? 'bg-ios-orange/10 text-ios-orange' :
                        'bg-ios-red/10 text-ios-red'
                      }`}>
                        {release.ageMultiplier > 0.8 ? 'Fresh' : release.ageMultiplier > 0.5 ? 'Aging' : 'Old'}
                      </div>
                      <div className="text-ios-gray">
                        Quality: {release.quality}/10
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* Milestones */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Career Milestones</h2>
          <div className="grid grid-cols-1 gap-3">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.title}
                className={`p-4 rounded-ios-lg shadow-ios flex items-center space-x-3 ${
                  milestone.achieved ? 'bg-green-50 border-l-4 border-green-400' : 'bg-white'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`p-2 rounded-full ${milestone.achieved ? 'bg-green-100' : 'bg-ios-gray5'}`}>
                  <SafeIcon icon={milestone.icon} className={`${milestone.achieved ? 'text-green-600' : 'text-ios-gray'}`} />
                </div>
                <div className="flex-1">
                  <div className={`font-semibold ${milestone.achieved ? 'text-green-800' : 'text-gray-900'}`}>
                    {milestone.title}
                  </div>
                  <div className={`text-sm ${milestone.achieved ? 'text-green-600' : 'text-ios-gray'}`}>
                    {milestone.description}
                  </div>
                </div>
                {milestone.achieved && (
                  <div className="text-green-500 text-xl">✓</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Next Goals</h2>
          <div className="space-y-3">
            {player.fame < 50 && (
              <div className="bg-white p-3 rounded-ios-lg shadow-ios flex items-center space-x-3">
                <SafeIcon icon={FiTarget} className="text-ios-orange" />
                <span className="text-sm text-gray-700">Reach 50 fame to become a known artist</span>
              </div>
            )}
            {player.fans < 1000 && (
              <div className="bg-white p-3 rounded-ios-lg shadow-ios flex items-center space-x-3">
                <SafeIcon icon={FiUsers} className="text-ios-green" />
                <span className="text-sm text-gray-700">Get 1,000 fans</span>
              </div>
            )}
            {tracks.length < 10 && (
              <div className="bg-white p-3 rounded-ios-lg shadow-ios flex items-center space-x-3">
                <SafeIcon icon={FiMusic} className="text-ios-purple" />
                <span className="text-sm text-gray-700">Create 10 tracks</span>
              </div>
            )}
            {albums.length === 0 && (
              <div className="bg-white p-3 rounded-ios-lg shadow-ios flex items-center space-x-3">
                <SafeIcon icon={FiDisc} className="text-ios-blue" />
                <span className="text-sm text-gray-700">Release your first album</span>
              </div>
            )}
            {totalViews < 100000 && (
              <div className="bg-white p-3 rounded-ios-lg shadow-ios flex items-center space-x-3">
                <SafeIcon icon={FiEye} className="text-ios-pink" />
                <span className="text-sm text-gray-700">Reach 100,000 total views</span>
              </div>
            )}
            {chartHits === 0 && (
              <div className="bg-white p-3 rounded-ios-lg shadow-ios flex items-center space-x-3">
                <SafeIcon icon={FiAward} className="text-rap-gold" />
                <span className="text-sm text-gray-700">Get your first top 10 hit</span>
              </div>
            )}
            {viralHits === 0 && (
              <div className="bg-white p-3 rounded-ios-lg shadow-ios flex items-center space-x-3">
                <SafeIcon icon={FiActivity} className="text-ios-red" />
                <span className="text-sm text-gray-700">Create your first viral hit</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}