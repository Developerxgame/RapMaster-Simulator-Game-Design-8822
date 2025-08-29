import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiInstagram, FiYoutube, FiMusic, FiTrendingUp, FiUsers, FiHeart, FiMessageCircle, FiShare, FiPlus, FiPlay, FiEye, FiZap } = FiIcons;

export default function SocialMediaPage() {
  const { state, dispatch } = useGame();
  const { player, socialPosts, releases } = state;
  const [activeApp, setActiveApp] = useState('rapgram');
  const [postContent, setPostContent] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);

  const socialApps = [
    { id: 'rapgram', name: 'RapGram', icon: FiInstagram, color: 'bg-pink-600' },
    { id: 'raptube', name: 'RapTube', icon: FiYoutube, color: 'bg-red-600' },
    { id: 'rapify', name: 'Rapify', icon: FiMusic, color: 'bg-green-600' },
    { id: 'riktok', name: 'RikTok', icon: FiTrendingUp, color: 'bg-purple-600' }
  ];

  const postTemplates = [
    "Just dropped a new track! 🔥 #NewMusic #RapLife",
    "In the studio working on something special... 👀 #StudioLife",
    "Thanks to all my fans for the love! ❤️ #Grateful #FanLove",
    "Behind the scenes at the video shoot 🎬 #MusicVideo",
    "Blessed to be living my dream 🙏 #Grateful #RapDream",
    "Can't wait for you to hear what's coming next! 🎵 #ComingSoon",
    "Grinding every day to perfect my craft 💪 #NeverStop",
    "Shoutout to my team for making this possible! 🤝 #TeamWork",
    "From the streets to the charts! 📈 #RiseUp",
    "New music dropping soon! Who's ready? 🚀 #GetReady"
  ];

  const createPost = () => {
    if (!postContent.trim() || player.energy < 5) return;

    const baseReach = Math.floor(player.fans * 0.3 + player.socialMedia[activeApp]?.followers * 0.4); 
    const engagementRate = Math.random() * 0.15 + 0.02; // 2-17% engagement
    const qualityMultiplier = selectedContent ? 1.5 : 1;
    
    const likes = Math.floor(baseReach * engagementRate * qualityMultiplier);
    const comments = Math.floor(likes * 0.25);
    const shares = Math.floor(likes * 0.15);
    
    // Viral potential for high-quality content
    const viralChance = player.fame > 100 ? 0.1 : 0.05;
    const isViral = Math.random() < viralChance;
    
    const finalLikes = isViral ? likes * (2 + Math.random() * 3) : likes;
    const finalComments = isViral ? comments * (2 + Math.random() * 3) : comments;
    const finalShares = isViral ? shares * (2 + Math.random() * 3) : shares;

    const newPost = {
      id: Date.now(),
      platform: activeApp,
      content: postContent,
      likes: Math.floor(finalLikes),
      comments: Math.floor(finalComments),
      shares: Math.floor(finalShares),
      createdAt: `${player.week}/${player.year}`,
      contentId: selectedContent,
      isViral: isViral
    };

    dispatch({ type: 'ADD_SOCIAL_POST', payload: newPost });
    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        energy: player.energy - 5
      }
    });

    if (isViral) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'success',
          title: 'Viral Post! 🔥',
          message: `Your post went viral with ${Math.floor(finalLikes).toLocaleString()} likes!`,
          timestamp: new Date().toISOString()
        }
      });
    }

    setPostContent('');
    setSelectedContent(null);
  };

  const uploadToYoutube = (release) => {
    if (player.energy < 10) return;

    const baseViews = Math.floor(Math.random() * 5000) + 2000;
    const qualityMultiplier = release.quality / 10;
    const fameMultiplier = Math.max(0.5, player.fame / 100);
    const subscriberBonus = player.socialMedia.raptube.subscribers / 1000;
    
    const videoViews = Math.floor(baseViews * qualityMultiplier * fameMultiplier * (1 + subscriberBonus));
    const earnings = videoViews * 0.15; // $0.15 per view
    
    // Chance for trending
    const trendingChance = release.quality >= 8 ? 0.2 : 0.05;
    const isTrending = Math.random() < trendingChance;
    
    const finalViews = isTrending ? videoViews * (3 + Math.random() * 2) : videoViews;
    const finalEarnings = finalViews * 0.15;

    dispatch({
      type: 'UPDATE_RELEASE_STATS',
      payload: {
        releaseId: release.id,
        views: Math.floor(finalViews),
        earnings: finalEarnings,
        type: 'youtube'
      }
    });

    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        energy: player.energy - 10,
        socialMedia: {
          ...player.socialMedia,
          raptube: {
            ...player.socialMedia.raptube,
            videos: player.socialMedia.raptube.videos + 1,
            totalViews: player.socialMedia.raptube.totalViews + Math.floor(finalViews),
            subscribers: player.socialMedia.raptube.subscribers + Math.floor(finalViews / 100)
          }
        }
      }
    });

    if (isTrending) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'success',
          title: 'Trending on RapTube! 📈',
          message: `"${release.title}" is trending with ${Math.floor(finalViews).toLocaleString()} views!`,
          timestamp: new Date().toISOString()
        }
      });
    }
  };

  const promoteOnRapify = (release) => {
    if (player.energy < 8) return;

    const baseStreams = Math.floor(Math.random() * 3000) + 1000;
    const qualityMultiplier = release.quality / 10;
    const fameMultiplier = Math.max(0.3, player.fame / 150);
    
    const streams = Math.floor(baseStreams * qualityMultiplier * fameMultiplier);
    const earnings = streams * 0.003; // $0.003 per stream (typical streaming rate)

    dispatch({
      type: 'UPDATE_RELEASE_STATS',
      payload: {
        releaseId: release.id,
        streams: streams,
        earnings: earnings,
        type: 'streaming'
      }
    });

    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        energy: player.energy - 8,
        socialMedia: {
          ...player.socialMedia,
          rapify: {
            ...player.socialMedia.rapify,
            streams: player.socialMedia.rapify.streams + streams,
            listeners: player.socialMedia.rapify.listeners + Math.floor(streams / 50)
          }
        }
      }
    });
  };

  const createRikTokVideo = (release) => {
    if (player.energy < 12) return;

    const baseViews = Math.floor(Math.random() * 8000) + 3000;
    const charismaMultiplier = player.skills.charisma / 50;
    const trendMultiplier = Math.random() > 0.7 ? 2.5 : 1; // 30% chance for trend
    
    const views = Math.floor(baseViews * charismaMultiplier * trendMultiplier);
    const followers = Math.floor(views / 200);

    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        energy: player.energy - 12,
        fans: player.fans + Math.floor(views / 150),
        fame: player.fame + Math.floor(views / 1000),
        socialMedia: {
          ...player.socialMedia,
          riktok: {
            ...player.socialMedia.riktok,
            videos: player.socialMedia.riktok.videos + 1,
            followers: player.socialMedia.riktok.followers + followers
          }
        }
      }
    });

    if (trendMultiplier > 2) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'success',
          title: 'RikTok Viral! 🎵',
          message: `Your video hit ${views.toLocaleString()} views and gained ${followers} followers!`,
          timestamp: new Date().toISOString()
        }
      });
    }
  };

  const canPost = () => {
    return postContent.trim() && player.energy >= 5;
  };

  const getRandomTemplate = () => {
    const template = postTemplates[Math.floor(Math.random() * postTemplates.length)];
    setPostContent(template);
  };

  return (
    <div className="min-h-screen bg-ios-bg pb-24 pt-24">
      <div className="px-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Social Media</h1>
          <p className="text-ios-gray">Connect with your fans and grow your audience</p>
        </div>

        {/* Stats Overview */}
        <div className="bg-white p-4 rounded-ios-lg shadow-ios">
          <h3 className="font-bold text-gray-900 mb-3">Social Media Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-pink-500">{player.socialMedia.rapgram.followers.toLocaleString()}</div>
              <div className="text-ios-gray">RapGram Followers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-500">{player.socialMedia.raptube.subscribers.toLocaleString()}</div>
              <div className="text-ios-gray">RapTube Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-500">{player.socialMedia.rapify.listeners.toLocaleString()}</div>
              <div className="text-ios-gray">Rapify Listeners</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-500">{player.socialMedia.riktok.followers.toLocaleString()}</div>
              <div className="text-ios-gray">RikTok Followers</div>
            </div>
          </div>
        </div>

        {/* Energy Status */}
        <div className="bg-white p-3 rounded-ios-lg shadow-ios">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiZap} className="text-ios-orange" />
              <span className="text-sm font-medium text-gray-900">Energy: {player.energy}/100</span>
            </div>
            <span className="text-xs text-ios-gray">Social media activities cost energy</span>
          </div>
        </div>

        {/* App Selection */}
        <div className="grid grid-cols-2 gap-4">
          {socialApps.map((app) => (
            <motion.button
              key={app.id}
              onClick={() => setActiveApp(app.id)}
              className={`${app.color} p-4 rounded-ios-lg text-white text-center shadow-ios ${
                activeApp === app.id ? 'ring-2 ring-white ring-opacity-50 scale-105' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SafeIcon icon={app.icon} className="text-2xl mx-auto mb-2" />
              <div className="font-bold text-sm">{app.name}</div>
              <div className="text-xs opacity-80 mt-1">
                {app.id === 'rapgram' && `${player.socialMedia.rapgram.followers.toLocaleString()} followers`}
                {app.id === 'raptube' && `${player.socialMedia.raptube.subscribers.toLocaleString()} subscribers`}
                {app.id === 'rapify' && `${player.socialMedia.rapify.listeners.toLocaleString()} listeners`}
                {app.id === 'riktok' && `${player.socialMedia.riktok.followers.toLocaleString()} followers`}
              </div>
            </motion.button>
          ))}
        </div>

        {/* RapGram */}
        {activeApp === 'rapgram' && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Create Post */}
            <div className="bg-white p-4 rounded-ios-lg shadow-ios">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">Create Post</h3>
                <div className="text-sm text-ios-gray">-5 Energy</div>
              </div>
              
              <div className="space-y-3">
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's happening in your music career?"
                  className="w-full p-3 bg-ios-gray6 border-none rounded-ios text-gray-900 placeholder-ios-gray focus:outline-none focus:ring-2 focus:ring-ios-blue resize-none"
                  rows={3}
                  maxLength={280}
                />
                
                {/* Content Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link to Release (Optional)</label>
                  <select
                    value={selectedContent || ''}
                    onChange={(e) => setSelectedContent(e.target.value || null)}
                    className="w-full p-2 bg-ios-gray6 border-none rounded-ios text-gray-900 focus:outline-none focus:ring-2 focus:ring-ios-blue"
                  >
                    <option value="">No linked content</option>
                    {releases.map((release) => (
                      <option key={release.id} value={release.id}>
                        {release.title} ({release.type})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={getRandomTemplate}
                    className="flex-1 p-2 bg-ios-gray5 rounded-ios hover:bg-ios-gray4 transition-colors"
                  >
                    <span className="text-sm font-medium text-ios-gray">Use Template</span>
                  </button>
                  <button
                    onClick={createPost}
                    disabled={!canPost()}
                    className={`flex-1 p-2 rounded-ios font-semibold transition-all ${
                      canPost()
                        ? 'bg-pink-500 text-white hover:shadow-ios active:scale-95'
                        : 'bg-ios-gray4 text-ios-gray cursor-not-allowed'
                    }`}
                  >
                    Post (-5 Energy)
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900">Recent Posts</h3>
              {socialPosts
                .filter(post => post.platform === 'rapgram')
                .slice(0, 5)
                .map((post) => (
                  <div key={post.id} className="bg-white p-4 rounded-ios-lg shadow-ios">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {player.stageName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="font-semibold text-gray-900">{player.stageName}</div>
                          {post.isViral && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">🔥 VIRAL</span>}
                        </div>
                        <div className="text-xs text-ios-gray">{post.createdAt}</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-800 mb-3">{post.content}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-ios-gray5">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-red-500">
                          <SafeIcon icon={FiHeart} className="text-sm" />
                          <span className="text-sm font-medium">{post.likes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-ios-blue">
                          <SafeIcon icon={FiMessageCircle} className="text-sm" />
                          <span className="text-sm font-medium">{post.comments.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-ios-green">
                          <SafeIcon icon={FiShare} className="text-sm" />
                          <span className="text-sm font-medium">{post.shares.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              
              {socialPosts.filter(post => post.platform === 'rapgram').length === 0 && (
                <div className="text-center py-8 bg-white rounded-ios-lg shadow-ios">
                  <SafeIcon icon={FiInstagram} className="text-4xl text-ios-gray mx-auto mb-2" />
                  <p className="text-ios-gray">No posts yet. Create your first post!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* RapTube */}
        {activeApp === 'raptube' && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Channel Stats */}
            <div className="bg-white p-4 rounded-ios-lg shadow-ios">
              <h3 className="font-bold text-gray-900 mb-3">Channel Statistics</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-red-500">{player.socialMedia.raptube.subscribers.toLocaleString()}</div>
                  <div className="text-xs text-ios-gray">Subscribers</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-ios-blue">{player.socialMedia.raptube.videos}</div>
                  <div className="text-xs text-ios-gray">Videos</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-ios-green">{player.socialMedia.raptube.totalViews.toLocaleString()}</div>
                  <div className="text-xs text-ios-gray">Total Views</div>
                </div>
              </div>
            </div>

            {/* Upload Content */}
            <div className="bg-white p-4 rounded-ios-lg shadow-ios">
              <h3 className="font-bold text-gray-900 mb-3">Upload to RapTube</h3>
              <div className="space-y-3">
                {releases.map((release) => (
                  <div key={release.id} className="flex items-center justify-between p-3 bg-ios-gray6 rounded-ios">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{release.title}</div>
                      <div className="text-sm text-ios-gray">
                        {release.views.toLocaleString()} views • ${release.earnings.toFixed(2)} earned
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="text-xs bg-ios-blue/10 text-ios-blue px-2 py-1 rounded-full">
                          Quality: {release.quality}/10
                        </div>
                        {release.trending && (
                          <div className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            🔥 Trending
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => uploadToYoutube(release)}
                      disabled={player.energy < 10}
                      className={`px-4 py-2 rounded-ios font-semibold transition-all ${
                        player.energy >= 10
                          ? 'bg-red-500 text-white hover:shadow-ios active:scale-95'
                          : 'bg-ios-gray4 text-ios-gray cursor-not-allowed'
                      }`}
                    >
                      <SafeIcon icon={FiPlay} className="inline mr-1" />
                      Promote (-10 Energy)
                    </button>
                  </div>
                ))}
                
                {releases.length === 0 && (
                  <div className="text-center py-8">
                    <SafeIcon icon={FiYoutube} className="text-4xl text-ios-gray mx-auto mb-2" />
                    <p className="text-ios-gray">No releases to upload yet</p>
                    <p className="text-sm text-ios-gray2">Create and release tracks to start your RapTube channel!</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Rapify */}
        {activeApp === 'rapify' && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Streaming Stats */}
            <div className="bg-white p-4 rounded-ios-lg shadow-ios">
              <h3 className="font-bold text-gray-900 mb-3">Streaming Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-green-500">{player.socialMedia.rapify.listeners.toLocaleString()}</div>
                  <div className="text-xs text-ios-gray">Monthly Listeners</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-ios-blue">{player.socialMedia.rapify.streams.toLocaleString()}</div>
                  <div className="text-xs text-ios-gray">Total Streams</div>
                </div>
              </div>
            </div>

            {/* Promote on Rapify */}
            <div className="bg-white p-4 rounded-ios-lg shadow-ios">
              <h3 className="font-bold text-gray-900 mb-3">Promote on Rapify</h3>
              <div className="space-y-3">
                {releases.map((release) => (
                  <div key={release.id} className="flex items-center justify-between p-3 bg-ios-gray6 rounded-ios">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{release.title}</div>
                      <div className="text-sm text-ios-gray">
                        {release.streams?.toLocaleString() || 0} streams
                      </div>
                    </div>
                    <button
                      onClick={() => promoteOnRapify(release)}
                      disabled={player.energy < 8}
                      className={`px-4 py-2 rounded-ios font-semibold transition-all ${
                        player.energy >= 8
                          ? 'bg-green-500 text-white hover:shadow-ios active:scale-95'
                          : 'bg-ios-gray4 text-ios-gray cursor-not-allowed'
                      }`}
                    >
                      <SafeIcon icon={FiMusic} className="inline mr-1" />
                      Promote (-8 Energy)
                    </button>
                  </div>
                ))}
                
                {releases.length === 0 && (
                  <div className="text-center py-8">
                    <SafeIcon icon={FiMusic} className="text-4xl text-ios-gray mx-auto mb-2" />
                    <p className="text-ios-gray">No releases to promote yet</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* RikTok */}
        {activeApp === 'riktok' && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* RikTok Stats */}
            <div className="bg-white p-4 rounded-ios-lg shadow-ios">
              <h3 className="font-bold text-gray-900 mb-3">RikTok Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-purple-500">{player.socialMedia.riktok.followers.toLocaleString()}</div>
                  <div className="text-xs text-ios-gray">Followers</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-ios-pink">{player.socialMedia.riktok.videos}</div>
                  <div className="text-xs text-ios-gray">Videos Posted</div>
                </div>
              </div>
            </div>

            {/* Create RikTok Videos */}
            <div className="bg-white p-4 rounded-ios-lg shadow-ios">
              <h3 className="font-bold text-gray-900 mb-3">Create RikTok Videos</h3>
              <div className="space-y-3">
                {releases.map((release) => (
                  <div key={release.id} className="flex items-center justify-between p-3 bg-ios-gray6 rounded-ios">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{release.title}</div>
                      <div className="text-sm text-ios-gray">
                        Perfect for short-form content
                      </div>
                    </div>
                    <button
                      onClick={() => createRikTokVideo(release)}
                      disabled={player.energy < 12}
                      className={`px-4 py-2 rounded-ios font-semibold transition-all ${
                        player.energy >= 12
                          ? 'bg-purple-500 text-white hover:shadow-ios active:scale-95'
                          : 'bg-ios-gray4 text-ios-gray cursor-not-allowed'
                      }`}
                    >
                      <SafeIcon icon={FiTrendingUp} className="inline mr-1" />
                      Create (-12 Energy)
                    </button>
                  </div>
                ))}
                
                {releases.length === 0 && (
                  <div className="text-center py-8">
                    <SafeIcon icon={FiTrendingUp} className="text-4xl text-ios-gray mx-auto mb-2" />
                    <p className="text-ios-gray">No releases for RikTok videos yet</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}