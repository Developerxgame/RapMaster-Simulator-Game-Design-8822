import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiMusic, FiDisc, FiVideo, FiZap, FiStar, FiPlay, FiPlus, FiUpload,
  FiTrendingUp, FiDollarSign, FiMegaphone, FiRefreshCw, FiEdit3
} = FiIcons;

export default function MusicStudioPage() {
  const { state, dispatch } = useGame();
  const { player, tracks, albums, musicVideos, releases } = state;
  const [activeTab, setActiveTab] = useState('create');

  // Track creation states
  const [trackTitle, setTrackTitle] = useState('');
  const [selectedLyrics, setSelectedLyrics] = useState(null);
  const [selectedProducer, setSelectedProducer] = useState(null);
  const [selectedDirector, setSelectedDirector] = useState(null);
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [releasing, setReleasing] = useState(false);

  // Album creation states
  const [albumTitle, setAlbumTitle] = useState('');
  const [selectedTracks, setSelectedTracks] = useState([]);

  // Music video states
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedVideoProducer, setSelectedVideoProducer] = useState(null);
  const [selectedVideoDirector, setSelectedVideoDirector] = useState(null);
  const [selectedVideoStudio, setSelectedVideoStudio] = useState(null);

  const tabs = [
    { id: 'create', label: 'Create Track', icon: FiMusic },
    { id: 'album', label: 'Create Album', icon: FiDisc },
    { id: 'video', label: 'Music Video', icon: FiVideo },
    { id: 'tracks', label: 'My Content', icon: FiPlay }
  ];

  // Lyrics options - Artist name first, then others
  const lyricsOptions = [
    { id: 1, name: `${player.stageName}`, price: 0, quality: 3, description: 'Write your own lyrics' },
    { id: 2, name: 'Local Songwriter', price: 1000, quality: 5, description: 'Professional songwriter' },
    { id: 3, name: 'Hit Songwriter', price: 5000, quality: 7, description: 'Chart-topping writer' },
    { id: 4, name: 'Grammy Winner', price: 25000, quality: 9, description: 'Award-winning lyricist' },
    { id: 5, name: 'Legend Writer', price: 100000, quality: 10, description: 'Legendary songwriter' }
  ];

  // Producers - Artist name first, then others
  const producers = [
    { id: 1, name: `${player.stageName}`, price: 0, quality: 3, description: 'Produce your own beats' },
    { id: 2, name: 'Local Producer', price: 5000, quality: 5, description: 'Professional local talent' },
    { id: 3, name: 'Known Producer', price: 25000, quality: 7, description: 'Industry recognized' },
    { id: 4, name: 'Top Producer', price: 100000, quality: 9, description: 'Chart-topping beats' },
    { id: 5, name: 'Superstar Producer', price: 500000, quality: 10, description: 'Elite producer' }
  ];

  // Directors - Artist name first, then others
  const directors = [
    { id: 1, name: `${player.stageName}`, price: 0, quality: 3, description: 'Direct yourself' },
    { id: 2, name: 'Music Director', price: 10000, quality: 5, description: 'Professional direction' },
    { id: 3, name: 'Creative Director', price: 50000, quality: 7, description: 'Creative vision' },
    { id: 4, name: 'Award Director', price: 200000, quality: 9, description: 'Award-winning direction' },
    { id: 5, name: 'Visionary Director', price: 1000000, quality: 10, description: 'Legendary vision' }
  ];

  // Studios - Artist name first, then others
  const studios = [
    { id: 1, name: 'Home Studio', price: 0, quality: 3, description: 'Your own setup' },
    { id: 2, name: 'Local Studio', price: 10000, quality: 5, description: 'Professional studio' },
    { id: 3, name: 'Premium Studio', price: 50000, quality: 7, description: 'High-end equipment' },
    { id: 4, name: 'Elite Studio', price: 200000, quality: 9, description: 'Industry standard' },
    { id: 5, name: 'Legendary Studio', price: 1000000, quality: 10, description: 'Iconic recording space' }
  ];

  // Video-specific options - Artist name first, then others
  const videoProducers = [
    { id: 1, name: `${player.stageName}`, price: 0, quality: 3, description: 'Self-produced video' },
    { id: 2, name: 'Video Producer', price: 25000, quality: 5, description: 'Professional video' },
    { id: 3, name: 'Commercial Producer', price: 100000, quality: 7, description: 'Commercial quality' },
    { id: 4, name: 'Music Video Pro', price: 500000, quality: 9, description: 'Top-tier video production' },
    { id: 5, name: 'Hollywood Producer', price: 2000000, quality: 10, description: 'Cinematic quality' }
  ];

  const videoDirectors = [
    { id: 1, name: `${player.stageName}`, price: 0, quality: 3, description: 'Self-directed video' },
    { id: 2, name: 'Video Director', price: 25000, quality: 5, description: 'Professional direction' },
    { id: 3, name: 'Creative Director', price: 100000, quality: 7, description: 'Artistic vision' },
    { id: 4, name: 'Award Director', price: 500000, quality: 9, description: 'Award-winning videos' },
    { id: 5, name: 'Visionary Director', price: 2000000, quality: 10, description: 'Legendary filmmaker' }
  ];

  const videoStudios = [
    { id: 1, name: 'Home Location', price: 0, quality: 3, description: 'Film at home' },
    { id: 2, name: 'Video Studio', price: 25000, quality: 5, description: 'Professional video studio' },
    { id: 3, name: 'Production Studio', price: 100000, quality: 7, description: 'Full production facility' },
    { id: 4, name: 'Sound Stage', price: 500000, quality: 9, description: 'Hollywood sound stage' },
    { id: 5, name: 'Epic Location', price: 2000000, quality: 10, description: 'Spectacular filming location' }
  ];

  const randomTitles = [
    'Money Dreams', 'Street Life', 'Rise Up', 'Hustle Hard', 'Golden Days', 'Midnight Vibes',
    'City Lights', 'No Limits', 'Top Floor', 'Real Talk', 'Grinding Daily', 'Success Story',
    'Never Stop', 'Diamond Heart', 'Legendary', 'From Zero', 'Big Dreams', 'Victory Lap',
    'Unstoppable', 'Crown Me', 'Fire Flow', 'Boss Mode', 'Next Level', 'Pure Energy',
    'Street King', 'Money Moves', 'Grind Time', 'Top Shelf', 'Real One', 'Empire State'
  ];

  const albumNames = [
    'The Come Up', 'Street Dreams', 'Golden Hour', 'No Sleep', 'Legendary', 'From The Bottom',
    'City Lights', 'The Journey', 'Rise & Grind', 'Victory Lap', 'Midnight Sessions', 'Crown Collection',
    'Street Symphony', 'Diamond Life', 'Empire Rising', 'Pure Fire', 'Next Chapter', 'Boss Level',
    'Money Talk', 'Street Royalty'
  ];

  // Check for duplicate titles
  const isDuplicateTitle = (title, type = 'track') => {
    if (type === 'track') {
      return tracks.some(track => track.title.toLowerCase() === title.toLowerCase());
    } else if (type === 'album') {
      return albums.some(album => album.title.toLowerCase() === title.toLowerCase());
    }
    return false;
  };

  const generateRandomTitle = () => {
    let title;
    let attempts = 0;
    do {
      title = randomTitles[Math.floor(Math.random() * randomTitles.length)];
      attempts++;
    } while (isDuplicateTitle(title) && attempts < 50);

    if (attempts >= 50) {
      // If still duplicate, add a number
      let counter = 1;
      let baseTitle = title;
      while (isDuplicateTitle(`${baseTitle} ${counter}`)) {
        counter++;
      }
      title = `${baseTitle} ${counter}`;
    }
    setTrackTitle(title);
  };

  const generateRandomAlbumTitle = () => {
    let title;
    let attempts = 0;
    do {
      title = albumNames[Math.floor(Math.random() * albumNames.length)];
      attempts++;
    } while (isDuplicateTitle(title, 'album') && attempts < 50);

    if (attempts >= 50) {
      let counter = 1;
      let baseTitle = title;
      while (isDuplicateTitle(`${baseTitle} ${counter}`, 'album')) {
        counter++;
      }
      title = `${baseTitle} ${counter}`;
    }
    setAlbumTitle(title);
  };

  const toggleLyricsName = () => {
    if (selectedLyrics && selectedLyrics.id === 1) {
      const newName = selectedLyrics.name === player.stageName ? 'Anonymous' : player.stageName;
      setSelectedLyrics({ ...selectedLyrics, name: newName });
    }
  };

  const createTrack = () => {
    if (!trackTitle || !selectedLyrics || !selectedProducer || !selectedDirector || !selectedStudio || player.energy < 20) return;

    if (isDuplicateTitle(trackTitle)) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'error',
          title: 'Duplicate Title',
          message: 'A track with this title already exists. Please choose a different title.',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    const totalCost = selectedLyrics.price + selectedProducer.price + selectedDirector.price + selectedStudio.price;
    if (player.netWorth < totalCost) return;

    const baseQuality = Math.floor((selectedLyrics.quality + selectedProducer.quality + selectedDirector.quality + selectedStudio.quality) / 4);
    const skillBonus = Math.floor(player.skills.lyrics / 20) + Math.floor(player.skills.flow / 20);
    const totalQuality = Math.min(10, baseQuality + skillBonus);

    const newTrack = {
      id: Date.now(),
      title: trackTitle,
      lyrics: selectedLyrics.name,
      producer: selectedProducer.name,
      director: selectedDirector.name,
      studio: selectedStudio.name,
      quality: totalQuality,
      createdAt: `${player.week}/${player.year}`,
      released: false,
      inAlbum: false,
      hasVideo: false,
      views: 0,
      likes: 0,
      type: 'track'
    };

    dispatch({ type: 'ADD_TRACK', payload: newTrack });
    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        energy: player.energy - 20,
        netWorth: player.netWorth - totalCost,
        fame: player.fame + Math.floor(totalQuality / 2)
      }
    });

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(),
        type: 'success',
        title: 'Track Created!',
        message: `"${trackTitle}" has been recorded with quality ${totalQuality}/10${totalCost === 0 ? ' (FREE - All Self-Made!)' : ''}`,
        timestamp: new Date().toISOString()
      }
    });

    // Reset form
    setTrackTitle('');
    setSelectedLyrics(null);
    setSelectedProducer(null);
    setSelectedDirector(null);
    setSelectedStudio(null);
  };

  const createAlbum = () => {
    if (!albumTitle || selectedTracks.length < 3 || player.energy < 40) return;

    if (isDuplicateTitle(albumTitle, 'album')) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'error',
          title: 'Duplicate Title',
          message: 'An album with this title already exists. Please choose a different title.',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

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
      type: 'album'
    };

    // Mark tracks as being in an album
    dispatch({ type: 'MARK_TRACKS_IN_ALBUM', payload: { trackIds: selectedTracks } });
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
    if (!selectedTrack || !selectedVideoProducer || !selectedVideoDirector || !selectedVideoStudio || player.energy < 30) return;

    const totalCost = selectedVideoProducer.price + selectedVideoDirector.price + selectedVideoStudio.price;
    if (player.netWorth < totalCost) return;

    const track = tracks.find(t => t.id === selectedTrack);
    const baseQuality = Math.floor((selectedVideoProducer.quality + selectedVideoDirector.quality + selectedVideoStudio.quality) / 3);
    const trackQualityBonus = Math.floor(track.quality / 3);
    const charismaBonus = Math.floor(player.skills.charisma / 20);
    const videoQuality = Math.min(10, baseQuality + trackQualityBonus + charismaBonus);

    const videoTitle = `${track.title} - Official Music Video | ${player.stageName}`;

    const newVideo = {
      id: Date.now(),
      title: videoTitle,
      trackId: selectedTrack,
      trackTitle: track.title,
      producer: selectedVideoProducer.name,
      director: selectedVideoDirector.name,
      studio: selectedVideoStudio.name,
      quality: videoQuality,
      createdAt: `${player.week}/${player.year}`,
      released: false,
      views: 0,
      likes: 0,
      type: 'video'
    };

    // Mark track as having a video
    dispatch({ type: 'MARK_TRACK_HAS_VIDEO', payload: { trackId: selectedTrack } });
    dispatch({ type: 'ADD_MUSIC_VIDEO', payload: newVideo });
    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        energy: player.energy - 30,
        netWorth: player.netWorth - totalCost,
        fame: player.fame + Math.floor(videoQuality / 2)
      }
    });

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(),
        type: 'success',
        title: 'Music Video Created!',
        message: `"${videoTitle}" video completed with quality ${videoQuality}/10${totalCost === 0 ? ' (FREE - All Self-Made!)' : ''}`,
        timestamp: new Date().toISOString()
      }
    });

    // Reset form
    setSelectedTrack(null);
    setSelectedVideoProducer(null);
    setSelectedVideoDirector(null);
    setSelectedVideoStudio(null);
  };

  // Enhanced release content with better error handling
  const releaseContent = async (content) => {
    try {
      // Prevent multiple simultaneous releases
      if (releasing) return;
      setReleasing(true);

      const platform = content.type === 'video' ? 'RapTube' : 'Rapify';

      // Validate content before release
      if (!content || !content.id || !content.title) {
        throw new Error('Invalid content data');
      }

      // Dispatch release action with error handling
      dispatch({
        type: 'RELEASE_CONTENT',
        payload: {
          contentId: content.id,
          type: content.type,
          title: content.title,
          quality: content.quality,
          platform: platform
        }
      });

      // Success notification
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'success',
          title: `Released on ${platform}!`,
          message: `"${content.title}" is now live on ${platform} and earning views!`,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Release error:', error);
      // Error notification
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'error',
          title: 'Release Failed',
          message: 'Failed to release content. Please try again.',
          timestamp: new Date().toISOString()
        }
      });
    } finally {
      setReleasing(false);
    }
  };

  const announceRelease = (releaseId) => {
    dispatch({ type: 'ANNOUNCE_RELEASE', payload: { releaseId } });
    const release = releases.find(r => r.id === releaseId);
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(),
        type: 'success',
        title: 'Release Announced!',
        message: `"${release.title}" has been announced on RapGram and RikTok!`,
        timestamp: new Date().toISOString()
      }
    });
  };

  const canCreateTrack = () => {
    const totalCost = (selectedLyrics?.price || 0) + (selectedProducer?.price || 0) + (selectedDirector?.price || 0) + (selectedStudio?.price || 0);
    return trackTitle && selectedLyrics && selectedProducer && selectedDirector && selectedStudio && player.energy >= 20 && player.netWorth >= totalCost && !isDuplicateTitle(trackTitle);
  };

  const canCreateAlbum = () => {
    return albumTitle && selectedTracks.length >= 3 && player.energy >= 40 && !isDuplicateTitle(albumTitle, 'album');
  };

  const canCreateVideo = () => {
    const totalCost = (selectedVideoProducer?.price || 0) + (selectedVideoDirector?.price || 0) + (selectedVideoStudio?.price || 0);
    return selectedTrack && selectedVideoProducer && selectedVideoDirector && selectedVideoStudio && player.energy >= 30 && player.netWorth >= totalCost;
  };

  // Get tracks available for albums (not released and not in album)
  const availableTracksForAlbum = tracks.filter(track => !track.released && !track.inAlbum);

  // Get tracks available for music videos (not having a video already)
  const availableTracksForVideo = tracks.filter(track => !track.hasVideo);

  const releasedContent = releases.filter(release => !release.announced);

  const formatPrice = (price) => {
    if (price === 0) return 'FREE';
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price}`;
  };

  return (
    <div className="min-h-screen bg-ios-bg pb-24 pt-20">
      <div className="px-4 space-y-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Music Studio</h1>
          <p className="text-ios-gray">Create professional music content</p>
        </div>

        {/* Studio Stats */}
        <div className="bg-white p-4 rounded-2xl shadow-ios">
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

        {/* Free Self-Production Notice */}
        <div className="bg-gradient-to-r from-ios-green to-ios-teal p-4 rounded-2xl text-white shadow-ios-lg">
          <h3 className="font-bold text-base mb-2">💡 Self-Production Tip</h3>
          <p className="text-white/90 text-sm">
            Choose yourself for all options (Lyrics, Producer, Director, Studio) to create content for FREE! Perfect for starting artists on a budget.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl p-1 shadow-ios overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl transition-all ${
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
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Energy Check */}
            <div className="bg-white p-4 rounded-2xl shadow-ios">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-ios-orange/10 rounded-2xl">
                    <SafeIcon icon={FiZap} className="text-ios-orange" />
                  </div>
                  <span className="font-medium text-gray-900">Energy: {player.energy}/100</span>
                </div>
                <span className="text-sm text-ios-gray">Need 20 energy to record</span>
              </div>
            </div>

            {/* Track Title */}
            <div className="bg-white p-4 rounded-2xl shadow-ios">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Track Title</label>
              <div className="space-y-3">
                <input
                  type="text"
                  value={trackTitle}
                  onChange={(e) => setTrackTitle(e.target.value)}
                  placeholder="Enter track title"
                  className={`w-full p-3 border-none rounded-2xl text-gray-900 placeholder-ios-gray focus:outline-none focus:ring-2 ${
                    trackTitle && isDuplicateTitle(trackTitle)
                      ? 'bg-red-50 focus:ring-red-500 border-red-300'
                      : 'bg-ios-gray6 focus:ring-ios-blue'
                  }`}
                  maxLength={30}
                />
                {trackTitle && isDuplicateTitle(trackTitle) && (
                  <p className="text-sm text-red-600">⚠️ A track with this title already exists</p>
                )}
                <button
                  onClick={generateRandomTitle}
                  className="w-full p-3 bg-ios-gray5 rounded-2xl hover:bg-ios-gray4 transition-colors flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiRefreshCw} className="text-ios-gray" />
                  <span className="font-medium text-ios-gray">Generate Random Title</span>
                </button>
              </div>
            </div>

            {/* Lyrics Selection */}
            <div className="bg-white p-4 rounded-2xl shadow-ios">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Lyrics</label>
              <div className="space-y-2">
                {lyricsOptions.map((lyrics) => {
                  const canAfford = player.netWorth >= lyrics.price;
                  const isSelected = selectedLyrics?.id === lyrics.id;
                  return (
                    <button
                      key={lyrics.id}
                      onClick={() => canAfford && setSelectedLyrics(lyrics)}
                      className={`w-full p-3 rounded-2xl text-left transition-all ${
                        isSelected
                          ? 'bg-ios-blue text-white'
                          : canAfford
                          ? 'bg-ios-gray6 hover:bg-ios-gray5'
                          : 'bg-ios-gray5 opacity-50 cursor-not-allowed'
                      }`}
                      disabled={!canAfford}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{lyrics.name}</span>
                            {lyrics.id === 1 && isSelected && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLyricsName();
                                }}
                                className="p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                              >
                                <SafeIcon icon={FiEdit3} className="text-xs" />
                              </button>
                            )}
                          </div>
                          <div className="text-sm opacity-80">{lyrics.description}</div>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <SafeIcon
                                key={i}
                                icon={FiStar}
                                className={`text-xs ${
                                  i < lyrics.quality
                                    ? isSelected
                                      ? 'text-white'
                                      : 'text-ios-orange'
                                    : 'text-ios-gray4'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${lyrics.price === 0 ? 'text-ios-green' : 'text-ios-blue'}`}>
                            {formatPrice(lyrics.price)}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Producer Selection */}
            <div className="bg-white p-4 rounded-2xl shadow-ios">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Producer</label>
              <div className="space-y-2">
                {producers.map((producer) => {
                  const canAfford = player.netWorth >= producer.price;
                  const isSelected = selectedProducer?.id === producer.id;
                  return (
                    <button
                      key={producer.id}
                      onClick={() => canAfford && setSelectedProducer(producer)}
                      className={`w-full p-3 rounded-2xl text-left transition-all ${
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
                          <div className="font-semibold">{producer.name}</div>
                          <div className="text-sm opacity-80">{producer.description}</div>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <SafeIcon
                                key={i}
                                icon={FiStar}
                                className={`text-xs ${
                                  i < producer.quality
                                    ? isSelected
                                      ? 'text-white'
                                      : 'text-ios-orange'
                                    : 'text-ios-gray4'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${producer.price === 0 ? 'text-ios-green' : 'text-ios-blue'}`}>
                            {formatPrice(producer.price)}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Director Selection */}
            <div className="bg-white p-4 rounded-2xl shadow-ios">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Direction</label>
              <div className="space-y-2">
                {directors.map((director) => {
                  const canAfford = player.netWorth >= director.price;
                  const isSelected = selectedDirector?.id === director.id;
                  return (
                    <button
                      key={director.id}
                      onClick={() => canAfford && setSelectedDirector(director)}
                      className={`w-full p-3 rounded-2xl text-left transition-all ${
                        isSelected
                          ? 'bg-ios-pink text-white'
                          : canAfford
                          ? 'bg-ios-gray6 hover:bg-ios-gray5'
                          : 'bg-ios-gray5 opacity-50 cursor-not-allowed'
                      }`}
                      disabled={!canAfford}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{director.name}</div>
                          <div className="text-sm opacity-80">{director.description}</div>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <SafeIcon
                                key={i}
                                icon={FiStar}
                                className={`text-xs ${
                                  i < director.quality
                                    ? isSelected
                                      ? 'text-white'
                                      : 'text-ios-orange'
                                    : 'text-ios-gray4'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${director.price === 0 ? 'text-ios-green' : 'text-ios-blue'}`}>
                            {formatPrice(director.price)}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Studio Selection */}
            <div className="bg-white p-4 rounded-2xl shadow-ios">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Studio</label>
              <div className="space-y-2">
                {studios.map((studio) => {
                  const canAfford = player.netWorth >= studio.price;
                  const isSelected = selectedStudio?.id === studio.id;
                  return (
                    <button
                      key={studio.id}
                      onClick={() => canAfford && setSelectedStudio(studio)}
                      className={`w-full p-3 rounded-2xl text-left transition-all ${
                        isSelected
                          ? 'bg-ios-teal text-white'
                          : canAfford
                          ? 'bg-ios-gray6 hover:bg-ios-gray5'
                          : 'bg-ios-gray5 opacity-50 cursor-not-allowed'
                      }`}
                      disabled={!canAfford}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{studio.name}</div>
                          <div className="text-sm opacity-80">{studio.description}</div>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <SafeIcon
                                key={i}
                                icon={FiStar}
                                className={`text-xs ${
                                  i < studio.quality
                                    ? isSelected
                                      ? 'text-white'
                                      : 'text-ios-orange'
                                    : 'text-ios-gray4'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${studio.price === 0 ? 'text-ios-green' : 'text-ios-blue'}`}>
                            {formatPrice(studio.price)}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Total Cost Display */}
            {(selectedLyrics || selectedProducer || selectedDirector || selectedStudio) && (
              <div className="bg-white p-4 rounded-2xl shadow-ios">
                <h3 className="font-bold text-gray-900 mb-2">Production Summary</h3>
                <div className="space-y-2 text-sm">
                  {selectedLyrics && (
                    <div className="flex justify-between">
                      <span>Lyrics ({selectedLyrics.name})</span>
                      <span className="font-medium">{formatPrice(selectedLyrics.price)}</span>
                    </div>
                  )}
                  {selectedProducer && (
                    <div className="flex justify-between">
                      <span>Producer ({selectedProducer.name})</span>
                      <span className="font-medium">{formatPrice(selectedProducer.price)}</span>
                    </div>
                  )}
                  {selectedDirector && (
                    <div className="flex justify-between">
                      <span>Direction ({selectedDirector.name})</span>
                      <span className="font-medium">{formatPrice(selectedDirector.price)}</span>
                    </div>
                  )}
                  {selectedStudio && (
                    <div className="flex justify-between">
                      <span>Studio ({selectedStudio.name})</span>
                      <span className="font-medium">{formatPrice(selectedStudio.price)}</span>
                    </div>
                  )}
                  <div className="border-t border-ios-gray5 pt-2 flex justify-between font-bold">
                    <span>Total Cost</span>
                    <span
                      className={`${
                        (selectedLyrics?.price || 0) +
                        (selectedProducer?.price || 0) +
                        (selectedDirector?.price || 0) +
                        (selectedStudio?.price || 0) === 0
                          ? 'text-ios-green'
                          : 'text-ios-blue'
                      }`}
                    >
                      {formatPrice(
                        (selectedLyrics?.price || 0) +
                        (selectedProducer?.price || 0) +
                        (selectedDirector?.price || 0) +
                        (selectedStudio?.price || 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Create Button */}
            <button
              onClick={createTrack}
              disabled={!canCreateTrack()}
              className={`w-full py-4 px-6 rounded-2xl font-bold transition-all ${
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
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white p-4 rounded-2xl shadow-ios">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-ios-purple/10 rounded-2xl">
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
                      className={`w-full p-3 border-none rounded-2xl text-gray-900 placeholder-ios-gray focus:outline-none focus:ring-2 ${
                        albumTitle && isDuplicateTitle(albumTitle, 'album')
                          ? 'bg-red-50 focus:ring-red-500 border-red-300'
                          : 'bg-ios-gray6 focus:ring-ios-blue'
                      }`}
                      maxLength={30}
                    />
                    {albumTitle && isDuplicateTitle(albumTitle, 'album') && (
                      <p className="text-sm text-red-600">⚠️ An album with this title already exists</p>
                    )}
                    <button
                      onClick={generateRandomAlbumTitle}
                      className="w-full p-3 bg-ios-gray5 rounded-2xl hover:bg-ios-gray4 transition-colors flex items-center justify-center space-x-2"
                    >
                      <SafeIcon icon={FiRefreshCw} className="text-ios-gray" />
                      <span className="font-medium text-ios-gray">Generate Random Title</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Select Tracks ({selectedTracks.length}/15)
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableTracksForAlbum.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => {
                          if (selectedTracks.includes(track.id)) {
                            setSelectedTracks(selectedTracks.filter((id) => id !== track.id));
                          } else if (selectedTracks.length < 15) {
                            setSelectedTracks([...selectedTracks, track.id]);
                          }
                        }}
                        className={`w-full p-3 rounded-2xl text-left transition-all ${
                          selectedTracks.includes(track.id)
                            ? 'bg-ios-blue text-white'
                            : 'bg-ios-gray6 hover:bg-ios-gray5'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{track.title}</span>
                            <div className="text-sm opacity-80">Producer: {track.producer}</div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <SafeIcon
                                key={i}
                                icon={FiStar}
                                className={`text-xs ${
                                  i < track.quality
                                    ? selectedTracks.includes(track.id)
                                      ? 'text-white'
                                      : 'text-ios-orange'
                                    : 'text-ios-gray4'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                    {availableTracksForAlbum.length === 0 && (
                      <div className="text-center py-4 text-ios-gray">
                        No available tracks. Create unreleased tracks first!
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={createAlbum}
                disabled={!canCreateAlbum()}
                className={`w-full mt-4 py-4 px-6 rounded-2xl font-bold transition-all ${
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
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white p-4 rounded-2xl shadow-ios">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-ios-red/10 rounded-2xl">
                    <SafeIcon icon={FiVideo} className="text-ios-red" />
                  </div>
                  <span className="font-medium text-gray-900">Energy: {player.energy}/100</span>
                </div>
                <span className="text-sm text-ios-gray">Need 30 energy</span>
              </div>

              <div className="space-y-4">
                {/* Track Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Select Track (Available for Video)
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableTracksForVideo.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => setSelectedTrack(track.id)}
                        className={`w-full p-3 rounded-2xl text-left transition-all ${
                          selectedTrack === track.id
                            ? 'bg-ios-red text-white'
                            : 'bg-ios-gray6 hover:bg-ios-gray5'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{track.title}</span>
                            <div className="text-sm opacity-80">
                              Producer: {track.producer} • Quality: {track.quality}/10
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <SafeIcon
                                key={i}
                                icon={FiStar}
                                className={`text-xs ${
                                  i < track.quality
                                    ? selectedTrack === track.id
                                      ? 'text-white'
                                      : 'text-ios-orange'
                                    : 'text-ios-gray4'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                    {availableTracksForVideo.length === 0 && (
                      <div className="text-center py-4 text-ios-gray">
                        No tracks available for music videos. All tracks already have videos.
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Producer Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Video Producer</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {videoProducers.map((producer) => {
                      const canAfford = player.netWorth >= producer.price;
                      const isSelected = selectedVideoProducer?.id === producer.id;
                      return (
                        <button
                          key={producer.id}
                          onClick={() => canAfford && setSelectedVideoProducer(producer)}
                          className={`w-full p-3 rounded-2xl text-left transition-all ${
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
                              <div className="font-semibold">{producer.name}</div>
                              <div className="text-sm opacity-80">{producer.description}</div>
                            </div>
                            <div className="text-right">
                              <div className={`font-bold ${producer.price === 0 ? 'text-ios-green' : 'text-ios-blue'}`}>
                                {formatPrice(producer.price)}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Video Director Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Video Director</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {videoDirectors.map((director) => {
                      const canAfford = player.netWorth >= director.price;
                      const isSelected = selectedVideoDirector?.id === director.id;
                      return (
                        <button
                          key={director.id}
                          onClick={() => canAfford && setSelectedVideoDirector(director)}
                          className={`w-full p-3 rounded-2xl text-left transition-all ${
                            isSelected
                              ? 'bg-ios-pink text-white'
                              : canAfford
                              ? 'bg-ios-gray6 hover:bg-ios-gray5'
                              : 'bg-ios-gray5 opacity-50 cursor-not-allowed'
                          }`}
                          disabled={!canAfford}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-semibold">{director.name}</div>
                              <div className="text-sm opacity-80">{director.description}</div>
                            </div>
                            <div className="text-right">
                              <div className={`font-bold ${director.price === 0 ? 'text-ios-green' : 'text-ios-blue'}`}>
                                {formatPrice(director.price)}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Video Studio Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Filming Location</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {videoStudios.map((studio) => {
                      const canAfford = player.netWorth >= studio.price;
                      const isSelected = selectedVideoStudio?.id === studio.id;
                      return (
                        <button
                          key={studio.id}
                          onClick={() => canAfford && setSelectedVideoStudio(studio)}
                          className={`w-full p-3 rounded-2xl text-left transition-all ${
                            isSelected
                              ? 'bg-ios-teal text-white'
                              : canAfford
                              ? 'bg-ios-gray6 hover:bg-ios-gray5'
                              : 'bg-ios-gray5 opacity-50 cursor-not-allowed'
                          }`}
                          disabled={!canAfford}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-semibold">{studio.name}</div>
                              <div className="text-sm opacity-80">{studio.description}</div>
                            </div>
                            <div className="text-right">
                              <div className={`font-bold ${studio.price === 0 ? 'text-ios-green' : 'text-ios-blue'}`}>
                                {formatPrice(studio.price)}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Video Production Summary */}
                {(selectedVideoProducer || selectedVideoDirector || selectedVideoStudio) && (
                  <div className="bg-ios-gray6 p-3 rounded-2xl">
                    <h4 className="font-bold text-gray-900 mb-2">Video Production Summary</h4>
                    <div className="space-y-1 text-sm">
                      {selectedVideoProducer && (
                        <div className="flex justify-between">
                          <span>Producer</span>
                          <span className="font-medium">{formatPrice(selectedVideoProducer.price)}</span>
                        </div>
                      )}
                      {selectedVideoDirector && (
                        <div className="flex justify-between">
                          <span>Director</span>
                          <span className="font-medium">{formatPrice(selectedVideoDirector.price)}</span>
                        </div>
                      )}
                      {selectedVideoStudio && (
                        <div className="flex justify-between">
                          <span>Location</span>
                          <span className="font-medium">{formatPrice(selectedVideoStudio.price)}</span>
                        </div>
                      )}
                      <div className="border-t border-ios-gray4 pt-1 flex justify-between font-bold">
                        <span>Total Cost</span>
                        <span
                          className={`${
                            (selectedVideoProducer?.price || 0) +
                            (selectedVideoDirector?.price || 0) +
                            (selectedVideoStudio?.price || 0) === 0
                              ? 'text-ios-green'
                              : 'text-ios-blue'
                          }`}
                        >
                          {formatPrice(
                            (selectedVideoProducer?.price || 0) +
                            (selectedVideoDirector?.price || 0) +
                            (selectedVideoStudio?.price || 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={createMusicVideo}
                disabled={!canCreateVideo()}
                className={`w-full mt-4 py-4 px-6 rounded-2xl font-bold transition-all ${
                  canCreateVideo()
                    ? 'bg-gradient-to-r from-ios-red to-ios-pink text-white shadow-ios-lg hover:shadow-ios-xl active:scale-95'
                    : 'bg-ios-gray4 text-ios-gray cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <SafeIcon icon={FiVideo} />
                  <span>Create Video (-30 Energy)</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* My Content Tab */}
        {activeTab === 'tracks' && (
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Released Content - Announcement Section */}
            {releasedContent.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Ready for Social Media Announcement</h3>
                <div className="space-y-3">
                  {releasedContent.map((release) => (
                    <div key={release.id} className="bg-white p-4 rounded-2xl shadow-ios">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{release.title}</h4>
                          <div className="text-sm text-ios-gray">
                            {release.type === 'video' ? 'Released on RapTube' : 'Released on Rapify'}
                          </div>
                          <p className="text-xs text-ios-gray2">Released: {release.releaseDate}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-ios-blue">{release.views.toLocaleString()} views</div>
                          <div className="text-sm text-ios-green">${Math.floor(release.earnings)} earned</div>
                        </div>
                      </div>
                      <button
                        onClick={() => announceRelease(release.id)}
                        className="w-full bg-gradient-to-r from-ios-pink to-ios-purple text-white py-3 px-4 rounded-2xl font-semibold hover:shadow-ios transition-all active:scale-95"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <SafeIcon icon={FiMegaphone} />
                          <span>Announce on RapGram & RikTok</span>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tracks */}
            {tracks.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Tracks ({tracks.length})</h3>
                <div className="space-y-3">
                  {tracks.map((track) => (
                    <div key={track.id} className="bg-white p-4 rounded-2xl shadow-ios">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{track.title}</h4>
                          <div className="text-sm text-ios-gray">
                            <div>Lyrics: {track.lyrics} • Producer: {track.producer}</div>
                            <div>Director: {track.director} • Studio: {track.studio}</div>
                          </div>
                          <p className="text-xs text-ios-gray2">Created: {track.createdAt}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {track.inAlbum && (
                              <span className="text-xs bg-ios-purple/10 text-ios-purple px-2 py-1 rounded-full">
                                In Album
                              </span>
                            )}
                            {track.hasVideo && (
                              <span className="text-xs bg-ios-red/10 text-ios-red px-2 py-1 rounded-full">
                                Has Video
                              </span>
                            )}
                            {track.released && (
                              <span className="text-xs bg-ios-green/10 text-ios-green px-2 py-1 rounded-full">
                                Released
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <SafeIcon
                                key={i}
                                icon={FiStar}
                                className={`text-xs ${i < track.quality ? 'text-ios-orange' : 'text-ios-gray4'}`}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-ios-gray">Quality: {track.quality}/10</div>
                        </div>
                      </div>
                      {!track.released && !track.inAlbum ? (
                        <button
                          onClick={() => releaseContent(track)}
                          disabled={releasing}
                          className={`w-full py-2 px-4 rounded-2xl font-semibold transition-all ${
                            releasing
                              ? 'bg-ios-gray4 text-ios-gray cursor-not-allowed'
                              : 'bg-ios-blue text-white hover:shadow-ios active:scale-95'
                          }`}
                        >
                          <SafeIcon icon={FiUpload} className="inline mr-2" />
                          {releasing ? 'Releasing...' : 'Release on Rapify'}
                        </button>
                      ) : track.inAlbum ? (
                        <div className="text-center py-2 text-ios-purple font-semibold">
                          📀 Part of Album (Cannot be released separately)
                        </div>
                      ) : (
                        <div className="text-center py-2 text-ios-green font-semibold">✓ Released on Rapify</div>
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
                    <div key={album.id} className="bg-white p-4 rounded-2xl shadow-ios">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">{album.title}</h4>
                          <p className="text-sm text-ios-gray">{album.tracks.length} tracks</p>
                          <p className="text-xs text-ios-gray2">Created: {album.createdAt}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <SafeIcon
                                key={i}
                                icon={FiStar}
                                className={`text-xs ${i < album.quality ? 'text-ios-orange' : 'text-ios-gray4'}`}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-ios-gray">Quality: {album.quality}/10</div>
                        </div>
                      </div>
                      {!album.released ? (
                        <button
                          onClick={() => releaseContent(album)}
                          disabled={releasing}
                          className={`w-full py-2 px-4 rounded-2xl font-semibold transition-all ${
                            releasing
                              ? 'bg-ios-gray4 text-ios-gray cursor-not-allowed'
                              : 'bg-ios-purple text-white hover:shadow-ios active:scale-95'
                          }`}
                        >
                          <SafeIcon icon={FiUpload} className="inline mr-2" />
                          {releasing ? 'Releasing...' : 'Release on Rapify'}
                        </button>
                      ) : (
                        <div className="text-center py-2 text-ios-green font-semibold">✓ Released on Rapify</div>
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
                    <div key={video.id} className="bg-white p-4 rounded-2xl shadow-ios">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">{video.title}</h4>
                          <div className="text-sm text-ios-gray">
                            <div>Track: {video.trackTitle}</div>
                            <div>Producer: {video.producer} • Director: {video.director}</div>
                            <div>Location: {video.studio}</div>
                          </div>
                          <p className="text-xs text-ios-gray2">Created: {video.createdAt}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <SafeIcon
                                key={i}
                                icon={FiStar}
                                className={`text-xs ${i < video.quality ? 'text-ios-orange' : 'text-ios-gray4'}`}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-ios-gray">Quality: {video.quality}/10</div>
                        </div>
                      </div>
                      {!video.released ? (
                        <button
                          onClick={() => releaseContent(video)}
                          disabled={releasing}
                          className={`w-full py-2 px-4 rounded-2xl font-semibold transition-all ${
                            releasing
                              ? 'bg-ios-gray4 text-ios-gray cursor-not-allowed'
                              : 'bg-ios-red text-white hover:shadow-ios active:scale-95'
                          }`}
                        >
                          <SafeIcon icon={FiUpload} className="inline mr-2" />
                          {releasing ? 'Releasing...' : 'Release on RapTube'}
                        </button>
                      ) : (
                        <div className="text-center py-2 text-ios-green font-semibold">✓ Released on RapTube</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tracks.length === 0 && albums.length === 0 && musicVideos.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-ios">
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