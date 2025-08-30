import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiInstagram, FiYoutube, FiMusic, FiTrendingUp, FiUsers, FiHeart, FiMessageCircle, FiShare, FiPlus, FiPlay, FiEye, FiZap } = FiIcons;

export default function SocialMediaPage() {
  const { state, dispatch } = useGame();
  const { player, socialPosts, releases, tracks, albums, musicVideos } = state;
  const [activeApp, setActiveApp] = useState('rapgram');
  const [postContent, setPostContent] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);

  const socialApps = [
    { id: 'rapgram', name: 'RapGram', icon: FiInstagram, color: 'bg-pink-600' },
    { id: 'raptube', name: 'RapTube', icon: FiYoutube, color: 'bg-red-600' },
    { id: 'rapify', name: 'Rapify', icon: FiMusic, color: 'bg-green-600' },
    { id: 'riktok', name: 'RikTok', icon: FiTrendingUp, color: 'bg-purple-600' }
  ];

  const formatFollowers = (amount) => {
    if (amount >= 1000000000000) {
      return `${(amount / 1000000000000).toFixed(1)}T`;
    } else if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
  };

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

  const canPost = () => {
    return postContent.trim() && player.energy >= 5;
  };

  const getRandomTemplate = () => {
    const template = postTemplates[Math.floor(Math.random() * postTemplates.length)];
    setPostContent(template);
  };

  // Get only released content for posting
  const getPostableContent = () => {
    return [
      ...tracks.filter(t => t.released),
      ...albums.filter(a => a.released),
      ...musicVideos.filter(v => v.released)
    ];
  };

  const postableContent = getPostableContent();

  // Get released content by platform
  const getRapifyContent = () => {
    return releases.filter(r => r.type === 'track' || r.type === 'album');
  };

  const getRapTubeContent = () => {
    return releases.filter(r => r.type === 'video');
  };

  return (
    <div className="min-h-screen bg-ios-bg pb-24 pt-24">
      <div className="px-4 space-y-4 max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Social Media</h1>
          <p className="text-ios-gray text-sm">Connect with your fans and grow your audience</p>
        </div>

        {/* Stats Overview */}
        <div className="bg-white p-3 rounded-ios-lg shadow-ios">
          <h3 className="font-bold text-gray-900 mb-2 text-sm">Social Media Stats</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center">
              <div className="text-base font-bold text-pink-500">{formatFollowers(player.socialMedia.rapgram.followers)}</div>
              <div className="text-ios-gray">RapGram Followers</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-red-500">{formatFollowers(player.socialMedia.raptube.subscribers)}</div>
              <div className="text-ios-gray">RapTube Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-green-500">{formatFollowers(player.socialMedia.rapify.listeners)}</div>
              <div className="text-ios-gray">Rapify Listeners</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-purple-500">{formatFollowers(player.socialMedia.riktok.followers)}</div>
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
        <div className="grid grid-cols-2 gap-3">
          {socialApps.map((app) => (
            <motion.button
              key={app.id}
              onClick={() => setActiveApp(app.id)}
              className={`${app.color} p-3 rounded-ios-lg text-white text-center shadow-ios ${
                activeApp === app.id ? 'ring-2 ring-white ring-opacity-50 scale-105' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SafeIcon icon={app.icon} className="text-xl mx-auto mb-1" />
              <div className="font-bold text-xs">{app.name}</div>
              <div className="text-xs opacity-80 mt-1">
                {app.id === 'rapgram' && `${formatFollowers(player.socialMedia.rapgram.followers)} followers`}
                {app.id === 'raptube' && `${formatFollowers(player.socialMedia.raptube.subscribers)} subscribers`}
                {app.id === 'rapify' && `${formatFollowers(player.socialMedia.rapify.listeners)} listeners`}
                {app.id === 'riktok' && `${formatFollowers(player.socialMedia.riktok.followers)} followers`}
              </div>
            </motion.button>
          ))}
        </div>

        {/* RapGram & RikTok - Only these platforms allow posting */}
        {(activeApp === 'rapgram' || activeApp === 'riktok') && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Create Post */}
            <div className="bg-white p-3 rounded-ios-lg shadow-ios">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-sm">Create Post</h3>
                <div className="text-xs text-ios-gray">-5 Energy</div>
              </div>
              <div className="space-y-2">
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's happening in your music career?"
                  className="w-full p-2 bg-ios-gray6 border-none rounded-ios text-gray-900 placeholder-ios-gray focus:outline-none focus:ring-2 focus:ring-ios-blue resize-none text-sm"
                  rows={3}
                  maxLength={280}
                />

                {/* Released Content Selection */}
                {postableContent.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Attach Released Content (Optional)
                    </label>
                    <select
                      value={selectedContent || ''}
                      onChange={(e) => setSelectedContent(e.target.value || null)}
                      className="w-full p-2 bg-ios-gray6 border-none rounded-ios text-gray-900 focus:outline-none focus:ring-2 focus:ring-ios-blue text-xs"
                    >
                      <option value="">No attachment</option>
                      {postableContent.map((content) => (
                        <option key={content.id} value={content.id}>
                          {content.title} ({content.type})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={getRandomTemplate}
                    className="flex-1 p-2 bg-ios-gray5 rounded-ios hover:bg-ios-gray4 transition-colors"
                  >
                    <span className="text-xs font-medium text-ios-gray">Use Template</span>
                  </button>
                  <button
                    onClick={createPost}
                    disabled={!canPost()}
                    className={`flex-1 p-2 rounded-ios font-semibold transition-all text-xs ${
                      canPost()
                        ? activeApp === 'rapgram'
                          ? 'bg-pink-500 text-white hover:shadow-ios active:scale-95'
                          : 'bg-purple-500 text-white hover:shadow-ios active:scale-95'
                        : 'bg-ios-gray4 text-ios-gray cursor-not-allowed'
                    }`}
                  >
                    Post (-5 Energy)
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-sm">Recent Posts</h3>
              {socialPosts
                .filter(post => post.platform === activeApp)
                .slice(0, 3)
                .map((post) => (
                  <div key={post.id} className="bg-white p-3 rounded-ios-lg shadow-ios">
                    <div className="flex items-start space-x-2 mb-2">
                      <div className={`w-8 h-8 ${
                        activeApp === 'rapgram'
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                          : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                      } rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                        {player.stageName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="font-semibold text-gray-900 text-sm">{player.stageName}</div>
                          {post.isViral && (
                            <span className="text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded-full">🔥 VIRAL</span>
                          )}
                        </div>
                        <div className="text-xs text-ios-gray">{post.createdAt}</div>
                      </div>
                    </div>
                    <p className="text-gray-800 mb-2 text-sm">{post.content}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-ios-gray5">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 text-red-500">
                          <SafeIcon icon={FiHeart} className="text-xs" />
                          <span className="text-xs font-medium">{formatFollowers(post.likes)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-ios-blue">
                          <SafeIcon icon={FiMessageCircle} className="text-xs" />
                          <span className="text-xs font-medium">{formatFollowers(post.comments)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-ios-green">
                          <SafeIcon icon={FiShare} className="text-xs" />
                          <span className="text-xs font-medium">{formatFollowers(post.shares)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {socialPosts.filter(post => post.platform === activeApp).length === 0 && (
                <div className="text-center py-6 bg-white rounded-ios-lg shadow-ios">
                  <SafeIcon icon={activeApp === 'rapgram' ? FiInstagram : FiTrendingUp} className="text-3xl text-ios-gray mx-auto mb-2" />
                  <p className="text-ios-gray text-sm">No posts yet. Create your first post!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Rapify - Show Released Tracks & Albums */}
        {activeApp === 'rapify' && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white p-4 rounded-ios-lg shadow-ios">
              <div className="text-center mb-4">
                <SafeIcon icon={FiMusic} className="text-4xl text-ios-gray mx-auto mb-2" />
                <h3 className="font-bold text-gray-900 mb-1">Rapify</h3>
                <p className="text-ios-gray text-sm mb-3">
                  Your music streams automatically on Rapify. Use RapGram and RikTok for promotion.
                </p>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-xl font-bold text-ios-green">
                      {formatFollowers(player.socialMedia.rapify.listeners)}
                    </div>
                    <div className="text-xs text-ios-gray">Listeners</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-ios-blue">
                      {formatFollowers(player.socialMedia.rapify.streams)}
                    </div>
                    <div className="text-xs text-ios-gray">Total Streams</div>
                  </div>
                </div>
              </div>
              {/* Released Content on Rapify */}
              <div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm">Released on Rapify</h4>
                <div className="space-y-2">
                  {getRapifyContent().map((release) => (
                    <div key={release.id} className="flex items-center justify-between p-2 bg-ios-gray6 rounded-ios">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{release.title}</div>
                        <div className="text-xs text-ios-gray capitalize">{release.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-ios-green">{formatFollowers(release.views)} streams</div>
                        <div className="text-xs text-ios-blue">${Math.floor(release.earnings)}</div>
                      </div>
                    </div>
                  ))}
                  {getRapifyContent().length === 0 && (
                    <div className="text-center py-4 text-ios-gray text-sm">
                      No content released on Rapify yet. Go to the studio to create and release music!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* RapTube - Show Released Music Videos */}
        {activeApp === 'raptube' && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white p-4 rounded-ios-lg shadow-ios">
              <div className="text-center mb-4">
                <SafeIcon icon={FiYoutube} className="text-4xl text-ios-gray mx-auto mb-2" />
                <h3 className="font-bold text-gray-900 mb-1">RapTube</h3>
                <p className="text-ios-gray text-sm mb-3">
                  Music videos automatically get views when released. Promotion is available on RapGram and RikTok.
                </p>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-xl font-bold text-ios-red">
                      {formatFollowers(player.socialMedia.raptube.subscribers)}
                    </div>
                    <div className="text-xs text-ios-gray">Subscribers</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-ios-orange">
                      {formatFollowers(player.socialMedia.raptube.totalViews)}
                    </div>
                    <div className="text-xs text-ios-gray">Total Views</div>
                  </div>
                </div>
              </div>
              {/* Released Content on RapTube */}
              <div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm">Released on RapTube</h4>
                <div className="space-y-2">
                  {getRapTubeContent().map((release) => (
                    <div key={release.id} className="flex items-center justify-between p-2 bg-ios-gray6 rounded-ios">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{release.title}</div>
                        <div className="text-xs text-ios-gray">Music Video</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-ios-red">{formatFollowers(release.views)} views</div>
                        <div className="text-xs text-ios-green">${Math.floor(release.earnings)}</div>
                      </div>
                    </div>
                  ))}
                  {getRapTubeContent().length === 0 && (
                    <div className="text-center py-4 text-ios-gray text-sm">
                      No music videos released on RapTube yet. Go to the studio to create and release videos!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}