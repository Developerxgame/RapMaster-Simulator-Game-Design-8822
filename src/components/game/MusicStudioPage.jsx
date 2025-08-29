import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMusic, FiDisc, FiVideo, FiZap, FiStar, FiPlay, FiPlus, FiUpload, FiTrendingUp, FiDollarSign } = FiIcons;

export default function MusicStudioPage() {
  const { state, dispatch } = useGame();
  const { player, tracks, albums, musicVideos } = state;
  const [activeTab, setActiveTab] = useState('create');
  const [trackTitle, setTrackTitle] = useState('');
  const [selectedBeat, setSelectedBeat] = useState(null);
  const [albumTitle, setAlbumTitle] = useState('');
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [videoTitle, setVideoTitle] = useState('');
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [collaborator, setCollaborator] = useState(null);

  const tabs = [
    { id: 'create', label: 'Create Track', icon: FiMusic },
    { id: 'album', label: 'Create Album', icon: FiDisc },
    { id: 'video', label: 'Music Video', icon: FiVideo },
    { id: 'tracks', label: 'My Content', icon: FiPlay }
  ];

  const beats = [
    { id: 1, name: 'Trap Vibes', price: 0, quality: 3, emoji: '🔥', color: 'bg-ios-orange', genre: 'Trap' },
    { id: 2, name: 'Boom Bap Classic', price: 0, quality: 3, emoji: '🥁', color: 'bg-ios-purple', genre: 'Hip-Hop' },
    { id: 3, name: 'Melodic Rap', price: 0, quality: 3, emoji: '🎹', color: 'bg-ios-blue', genre: 'Melodic' },
    { id: 4, name: 'Premium Trap', price: 100, quality: 5, emoji: '💎', color: 'bg-ios-teal', genre: 'Trap' },
    { id: 5, name: 'Viral Beat', price: 500, quality: 8, emoji: '⚡', color: 'bg-ios-pink', genre: 'Pop-Rap' },
    { id: 6, name: 'Chart Topper', price: 1000, quality: 10, emoji: '👑', color: 'bg-rap-gold', genre: 'Commercial' },
    { id: 7, name: 'Underground Fire', price: 200, quality: 6, emoji: '🔥', color: 'bg-ios-red', genre: 'Underground' },
    { id: 8, name: 'Jazz Fusion', price: 300, quality: 7, emoji: '🎺', color: 'bg-ios-indigo', genre: 'Jazz-Rap' }
  ];

  const collaborators = [
    { id: 1, name: 'Solo', cost: 0, fameBonus: 0, qualityBonus: 0 },
    { id: 2, name: 'Local Artist', cost: 50, fameBonus: 2, qualityBonus: 1 },
    { id: 3, name: 'Known Rapper', cost: 200, fameBonus: 5, qualityBonus: 2 },
    { id: 4, name: 'Rising Star', cost: 500, fameBonus: 10, qualityBonus: 3 },
    { id: 5, name: 'Famous Artist', cost: 2000, fameBonus: 25, qualityBonus: 5 }
  ];

  const randomTitles = [
    'Money Dreams', 'Street Life', 'Rise Up', 'Hustle Hard', 'Golden Days',
    'Midnight Vibes', 'City Lights', 'No Limits', 'Top Floor', 'Real Talk',
    'Grinding Daily', 'Success Story', 'Never Stop', 'Diamond Heart', 'Legendary',
    'From Zero', 'Big Dreams', 'Victory Lap', 'Unstoppable', 'Crown Me'
  ];

  const generateRandomTitle = () => {
    const title = randomTitles[Math.floor(Math.random() * randomTitles.length)];
    setTrackTitle(title);
  };

  const generateRandomAlbumTitle = () => {
    const albumNames = [
      'The Come Up', 'Street Dreams', 'Golden Hour', 'No Sleep', 'Legendary',
      'From The Bottom', 'City Lights', 'The Journey', 'Rise & Grind', 'Victory Lap',
      'Midnight Sessions', 'Crown Collection', 'Street Symphony', 'Diamond Life'
    ];
    const title = albumNames[Math.floor(Math.random() * albumNames.length)];
    setAlbumTitle(title);
  };

  const createTrack = () => {
    if (!trackTitle || !selectedBeat || player.energy < 20) return;

    const baseQuality = selectedBeat.quality;
    const skillBonus = Math.floor(player.skills.lyrics / 10) + Math.floor(player.skills.flow / 10);
    const collabBonus = collaborator ? collaborator.qualityBonus : 0;
    const totalQuality = Math.min(10, baseQuality + skillBonus + collabBonus);
    
    const totalCost = selectedBeat.price + (collaborator ? collaborator.cost : 0);
    
    if (player.netWorth < totalCost) return;

    const newTrack = {
      id: Date.now(),
      title: trackTitle,
      beat: selectedBeat.name,
      genre: selectedBeat.genre,
      quality: totalQuality,
      collaborator: collaborator ? collaborator.name : null,
      createdAt: `${player.week}/${player.year}`,
      released: false,
      views: 0,
      likes: 0,
      type: 'track',
      mood: Math.random() > 0.5 ? 'Energetic' : 'Chill'
    };

    dispatch({ type: 'ADD_TRACK', payload: newTrack });
    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        energy: player.energy - 20,
        netWorth: player.netWorth - totalCost,
        fame: player.fame + Math.floor(totalQuality / 2) + (collaborator ? collaborator.fameBonus : 0)
      }
    });

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(),
        type: 'success',
        title: 'Track Created!',
        message: `"${trackTitle}" has been recorded with quality ${totalQuality}/10`,
        timestamp: new Date().toISOString()
      }
    });

    setTrackTitle('');
    setSelectedBeat(null);
    setCollaborator(null);
  };

  const createAlbum = () => {
    if (!albumTitle || selectedTracks.length < 3 || player.energy < 40) return;

    const averageQuality = selectedTracks.reduce((sum, trackId) => {
      const track = tracks.find(t => t.id === trackId);
      return sum + track.quality;
    }, 0) / selectedTracks.length;

    const newAlbum = {
      id: Date.now(),
      title: albumTitle,
      tracks: selectedTracks,
      quality: Math.floor(averageQuality),
      createdAt: `${player.week}/${player.year}`,
      released: false,
      sales: 0,
      type: 'album',
      genre: 'Mixed'
    };

    dispatch({ type: 'ADD_ALBUM', payload: newAlbum });
    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        energy: player.energy - 40,
        fame: player.fame + Math.floor(averageQuality * 2)
      }
    });

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(),
        type: 'success',
        title: 'Album Created!',
        message: `"${albumTitle}" album completed with ${selectedTracks.length} tracks`,
        timestamp: new Date().toISOString()
      }
    });

    setAlbumTitle('');
    setSelectedTracks([]);
  };

  const createMusicVideo = () => {
    if (!videoTitle || !selectedTrack || player.energy < 30 || player.netWorth < 500) return;

    const track = tracks.find(t => t.id === selectedTrack);
    const videoQuality = Math.min(10, track.quality + Math.floor(player.skills.charisma / 10));

    const newVideo = {
      id: Date.now(),
      title: videoTitle,
      trackId: selectedTrack,
      trackTitle: track.title,
      quality: videoQuality,
      createdAt: `${player.week}/${player.year}`,
      released: false,
      views: 0,
      likes: 0,
      type: 'video'
    };

    dispatch({ type: 'ADD_MUSIC_VIDEO', payload: newVideo });
    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        energy: player.energy - 30,
        netWorth: player.netWorth - 500,
        fame: player.fame + Math.floor(videoQuality / 2)
      }
    });

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(),
        type: 'success',
        title: 'Music Video Created!',
        message: `"${videoTitle}" video completed`,
        timestamp: new Date().toISOString()
      }
    });

    setVideoTitle('');
    setSelectedTrack(null);
  };

  const releaseContent = (content) => {
    dispatch({
      type: 'RELEASE_CONTENT',
      payload: {
        contentId: content.id,
        type: content.type,
        title: content.title,
        quality: content.quality
      }
    });

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(),
        type: 'success',
        title: 'Content Released!',
        message: `"${content.title}" is now live and earning views!`,
        timestamp: new Date().toISOString()
      }
    });
  };

  const canCreateTrack = () => {
    const totalCost = (selectedBeat?.price || 0) + (collaborator?.cost || 0);
    return trackTitle && selectedBeat && player.energy >= 20 && player.netWorth >= totalCost;
  };

  const canCreateAlbum = () => {
    return albumTitle && selectedTracks.length >= 3 && player.energy >= 40;
  };

  const canCreateVideo = () => {
    return videoTitle && selectedTrack && player.energy >= 30 && player.netWorth >= 500;
  };

  const unreleasedTracks = tracks.filter(track => !track.released);

  return (
    <div className="min-h-screen bg-ios-bg pb-24 pt-24">
      <div className="px-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Music Studio</h1>
          <p className="text-ios-gray">Create and release your music</p>
        </div>

        {/* Studio Stats */}
        <div className="bg-white p-4 rounded-ios-lg shadow-ios">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-ios-blue">{tracks.length}</div>
              <div className="text-sm text-ios-gray">Total Tracks</div>
            </div>
            <div>
              <div className="text-xl font-bold text-ios-purple">{albums.length}</div>
              <div className="text-sm text-ios-gray">Albums</div>
            </div>
            <div>
              <div className="text-xl font-bold text-ios-red">{musicVideos.length}</div>
              <div className="text-sm text-ios-gray">Videos</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-ios-xl p-1 shadow-ios overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center justify-center space-x-2 py-3 px-4 rounded-ios-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-ios-blue text-white shadow-ios'
                  : 'text-ios-gray hover:text-gray-900'
              }`}
            >
              <SafeIcon icon={tab.icon} className="text-lg" />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Create Track Tab */}
        {activeTab === 'create' && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Energy Check */}
            <div className="bg-white p-4 rounded-ios-lg shadow-ios">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-ios-orange/10 rounded-ios">
                    <SafeIcon icon={FiZap} className="text-ios-orange" />
                  </div>
                  <span className="font-medium text-gray-900">Energy: {player.energy}/100</span>
                </div>
                <span className="text-sm text-ios-gray">Need 20 energy to record</span>
              </div>
            </div>

            {/* Track Title */}
            <div className="bg-white p-4 rounded-ios-lg shadow-ios">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Track Title</label>
              <div className="space-y-3">
                <input
                  type="text"
                  value={trackTitle}
                  onChange={(e) => setTrackTitle(e.target.value)}
                  placeholder="Enter track title"
                  className="w-full p-3 bg-ios-gray6 border-none rounded-ios text-gray-900 placeholder-ios-gray focus:outline-none focus:ring-2 focus:ring-ios-blue"
                  maxLength={30}
                />
                <button
                  onClick={generateRandomTitle}
                  className="w-full p-3 bg-ios-gray5 rounded-ios hover:bg-ios-gray4 transition-colors"
                >
                  <span className="font-medium text-ios-gray">Generate Random Title</span>
                </button>
              </div>
            </div>

            {/* Collaborator Selection */}
            <div className="bg-white p-4 rounded-ios-lg shadow-ios">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Collaboration</label>
              <div className="space-y-2">
                {collaborators.map((collab) => {
                  const canAfford = player.netWorth >= collab.cost;
                  const isSelected = collaborator?.id === collab.id;
                  
                  return (
                    <button
                      key={collab.id}
                      onClick={() => canAfford && setCollaborator(collab)}
                      className={`w-full p-3 rounded-ios text-left transition-all ${
                        isSelected
                          ? 'bg-ios-purple text-white'
                          : canAfford
                          ? 'bg-ios-gray6 hover:bg-ios-gray5'
                          : 'bg-ios-gray5 opacity-50 cursor-not-allowed'
                      }`}
                      disabled={!canAfford}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{collab.name}</div>
                          {collab.fameBonus > 0 && (
                            <div className="text-sm opacity-80">
                              +{collab.fameBonus} Fame, +{collab.qualityBonus} Quality
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {collab.cost === 0 ? 'FREE' : `$${collab.cost}`}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Beat Selection */}
            <div className="bg-white p-4 rounded-ios-lg shadow-ios">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Select Beat</label>
              <div className="grid grid-cols-1 gap-3">
                {beats.map((beat) => {
                  const canAfford = player.netWorth >= beat.price;
                  const isSelected = selectedBeat?.id === beat.id;
                  
                  return (
                    <motion.button
                      key={beat.id}
                      onClick={() => canAfford && setSelectedBeat(beat)}
                      className={`p-4 rounded-ios-lg transition-all ${
                        isSelected
                          ? 'bg-ios-blue text-white shadow-ios-lg'
                          : canAfford
                          ? 'bg-ios-gray6 hover:bg-ios-gray5'
                          : 'bg-ios-gray5 opacity-50 cursor-not-allowed'
                      }`}
                      whileHover={canAfford ? { scale: 1.02 } : {}}
                      disabled={!canAfford}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${beat.color} rounded-ios flex items-center justify-center text-lg`}>
                            {beat.emoji}
                          </div>
                          <div className="text-left">
                            <div className="font-semibold">{beat.name}</div>
                            <div className="text-sm opacity-80">{beat.genre}</div>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <SafeIcon
                                  key={i}
                                  icon={FiStar}
                                  className={`text-xs ${
                                    i < beat.quality ? 'text-ios-orange' : 'text-ios-gray4'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-ios-green">
                            {beat.price === 0 ? 'FREE' : `$${beat.price}`}
                          </div>
                          {!canAfford && beat.price > 0 && (
                            <div className="text-xs text-ios-red">Can't afford</div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={createTrack}
              disabled={!canCreateTrack()}
              className={`w-full py-4 px-6 rounded-ios-lg font-bold transition-all ${
                canCreateTrack()
                  ? 'bg-gradient-to-r from-ios-blue to-ios-purple text-white shadow-ios-lg hover:shadow-ios-xl active:scale-95'
                  : 'bg-ios-gray4 text-ios-gray cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <SafeIcon icon={FiMusic} />
                <span>Record Track (-20 Energy)</span>
              </div>
            </button>
          </motion.div>
        )}

        {/* Create Album Tab */}
        {activeTab === 'album' && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white p-4 rounded-ios-lg shadow-ios">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-ios-purple/10 rounded-ios">
                    <SafeIcon icon={FiDisc} className="text-ios-purple" />
                  </div>
                  <span className="font-medium text-gray-900">Energy: {player.energy}/100</span>
                </div>
                <span className="text-sm text-ios-gray">Need 40 energy & 3+ tracks</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Album Title</label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={albumTitle}
                      onChange={(e) => setAlbumTitle(e.target.value)}
                      placeholder="Enter album title"
                      className="w-full p-3 bg-ios-gray6 border-none rounded-ios text-gray-900 placeholder-ios-gray focus:outline-none focus:ring-2 focus:ring-ios-blue"
                      maxLength={30}
                    />
                    <button
                      onClick={generateRandomAlbumTitle}
                      className="w-full p-3 bg-ios-gray5 rounded-ios hover:bg-ios-gray4 transition-colors"
                    >
                      <span className="font-medium text-ios-gray">Generate Random Title</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Select Tracks ({selectedTracks.length}/15)
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {unreleasedTracks.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => {
                          if (selectedTracks.includes(track.id)) {
                            setSelectedTracks(selectedTracks.filter(id => id !== track.id));
                          } else if (selectedTracks.length < 15) {
                            setSelectedTracks([...selectedTracks, track.id]);
                          }
                        }}
                        className={`w-full p-3 rounded-ios text-left transition-all ${
                          selectedTracks.includes(track.id)
                            ? 'bg-ios-blue text-white'
                            : 'bg-ios-gray6 hover:bg-ios-gray5'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{track.title}</span>
                            <div className="text-sm opacity-80">{track.genre}</div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <SafeIcon
                                key={i}
                                icon={FiStar}
                                className={`text-xs ${
                                  i < track.quality 
                                    ? selectedTracks.includes(track.id) ? 'text-white' : 'text-ios-orange'
                                    : 'text-ios-gray4'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                    
                    {unreleasedTracks.length === 0 && (
                      <div className="text-center py-4 text-ios-gray">
                        No unreleased tracks available. Create some tracks first!
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={createAlbum}
                disabled={!canCreateAlbum()}
                className={`w-full mt-4 py-4 px-6 rounded-ios-lg font-bold transition-all ${
                  canCreateAlbum()
                    ? 'bg-gradient-to-r from-ios-purple to-ios-pink text-white shadow-ios-lg hover:shadow-ios-xl active:scale-95'
                    : 'bg-ios-gray4 text-ios-gray cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <SafeIcon icon={FiDisc} />
                  <span>Create Album (-40 Energy)</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* Create Music Video Tab */}
        {activeTab === 'video' && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white p-4 rounded-ios-lg shadow-ios">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-ios-red/10 rounded-ios">
                    <SafeIcon icon={FiVideo} className="text-ios-red" />
                  </div>
                  <span className="font-medium text-gray-900">Energy: {player.energy}/100</span>
                </div>
                <span className="text-sm text-ios-gray">Need 30 energy & $500</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Video Title</label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Enter music video title"
                    className="w-full p-3 bg-ios-gray6 border-none rounded-ios text-gray-900 placeholder-ios-gray focus:outline-none focus:ring-2 focus:ring-ios-blue"
                    maxLength={30}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Select Track</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {unreleasedTracks.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => setSelectedTrack(track.id)}
                        className={`w-full p-3 rounded-ios text-left transition-all ${
                          selectedTrack === track.id
                            ? 'bg-ios-red text-white'
                            : 'bg-ios-gray6 hover:bg-ios-gray5'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{track.title}</span>
                            <div className="text-sm opacity-80">{track.genre}</div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <SafeIcon
                                key={i}
                                icon={FiStar}
                                className={`text-xs ${
                                  i < track.quality 
                                    ? selectedTrack === track.id ? 'text-white' : 'text-ios-orange'
                                    : 'text-ios-gray4'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                    
                    {unreleasedTracks.length === 0 && (
                      <div className="text-center py-4 text-ios-gray">
                        No unreleased tracks available for music videos.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={createMusicVideo}
                disabled={!canCreateVideo()}
                className={`w-full mt-4 py-4 px-6 rounded-ios-lg font-bold transition-all ${
                  canCreateVideo()
                    ? 'bg-gradient-to-r from-ios-red to-ios-pink text-white shadow-ios-lg hover:shadow-ios-xl active:scale-95'
                    : 'bg-ios-gray4 text-ios-gray cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <SafeIcon icon={FiVideo} />
                  <span>Create Video (-30 Energy, -$500)</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* My Content Tab */}
        {activeTab === 'tracks' && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Tracks */}
            {tracks.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Tracks ({tracks.length})</h3>
                <div className="space-y-3">
                  {tracks.map((track) => (
                    <div key={track.id} className="bg-white p-4 rounded-ios-lg shadow-ios">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{track.title}</h4>
                          <div className="flex items-center space-x-3 text-sm text-ios-gray">
                            <span>Beat: {track.beat}</span>
                            <span>•</span>
                            <span>{track.genre}</span>
                            {track.collaborator && (
                              <>
                                <span>•</span>
                                <span>ft. {track.collaborator}</span>
                              </>
                            )}
                          </div>
                          <p className="text-xs text-ios-gray2">Created: {track.createdAt}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <SafeIcon
                                key={i}
                                icon={FiStar}
                                className={`text-xs ${
                                  i < track.quality ? 'text-ios-orange' : 'text-ios-gray4'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-ios-gray">Quality: {track.quality}/10</div>
                        </div>
                      </div>

                      {!track.released ? (
                        <button
                          onClick={() => releaseContent(track)}
                          className="w-full bg-ios-blue text-white py-2 px-4 rounded-ios font-semibold hover:shadow-ios transition-all active:scale-95"
                        >
                          <SafeIcon icon={FiUpload} className="inline mr-2" />
                          Release Track
                        </button>
                      ) : (
                        <div className="text-center py-2 text-ios-green font-semibold">
                          ✓ Released
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Albums */}
            {albums.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Albums ({albums.length})</h3>
                <div className="space-y-3">
                  {albums.map((album) => (
                    <div key={album.id} className="bg-white p-4 rounded-ios-lg shadow-ios">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">{album.title}</h4>
                          <p className="text-sm text-ios-gray">{album.tracks.length} tracks • {album.genre}</p>
                          <p className="text-xs text-ios-gray2">Created: {album.createdAt}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <SafeIcon
                                key={i}
                                icon={FiStar}
                                className={`text-xs ${
                                  i < album.quality ? 'text-ios-orange' : 'text-ios-gray4'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-ios-gray">Quality: {album.quality}/10</div>
                        </div>
                      </div>

                      {!album.released ? (
                        <button
                          onClick={() => releaseContent(album)}
                          className="w-full bg-ios-purple text-white py-2 px-4 rounded-ios font-semibold hover:shadow-ios transition-all active:scale-95"
                        >
                          <SafeIcon icon={FiUpload} className="inline mr-2" />
                          Release Album
                        </button>
                      ) : (
                        <div className="text-center py-2 text-ios-green font-semibold">
                          ✓ Released
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Music Videos */}
            {musicVideos.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Music Videos ({musicVideos.length})</h3>
                <div className="space-y-3">
                  {musicVideos.map((video) => (
                    <div key={video.id} className="bg-white p-4 rounded-ios-lg shadow-ios">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">{video.title}</h4>
                          <p className="text-sm text-ios-gray">Track: {video.trackTitle}</p>
                          <p className="text-xs text-ios-gray2">Created: {video.createdAt}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <SafeIcon
                                key={i}
                                icon={FiStar}
                                className={`text-xs ${
                                  i < video.quality ? 'text-ios-orange' : 'text-ios-gray4'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-ios-gray">Quality: {video.quality}/10</div>
                        </div>
                      </div>

                      {!video.released ? (
                        <button
                          onClick={() => releaseContent(video)}
                          className="w-full bg-ios-red text-white py-2 px-4 rounded-ios font-semibold hover:shadow-ios transition-all active:scale-95"
                        >
                          <SafeIcon icon={FiUpload} className="inline mr-2" />
                          Release Video
                        </button>
                      ) : (
                        <div className="text-center py-2 text-ios-green font-semibold">
                          ✓ Released
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tracks.length === 0 && albums.length === 0 && musicVideos.length === 0 && (
              <div className="text-center py-12 bg-white rounded-ios-lg shadow-ios">
                <SafeIcon icon={FiMusic} className="text-4xl text-ios-gray mx-auto mb-4" />
                <p className="text-ios-gray font-medium">No content created yet</p>
                <p className="text-sm text-ios-gray2 mt-1">Start creating tracks to build your catalog!</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}