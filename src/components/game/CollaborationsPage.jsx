import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiStar, FiDollarSign, FiZap, FiMusic, FiTrendingUp, FiCheck, FiX, FiClock, FiAward } = FiIcons;

export default function CollaborationsPage() {
  const { state, dispatch } = useGame();
  const { player, collaborations = [] } = state;
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [collaborating, setCollaborating] = useState(false);

  const artists = [
    {
      id: 1,
      name: 'MC Flash',
      fame: 25,
      genre: 'Old School',
      cost: 2000,
      energy: 25,
      fameBoost: 15,
      qualityBonus: 2,
      requirements: { fame: 10 },
      avatar: '🎤',
      bio: 'Veteran rapper with classic flow',
      specialty: 'Storytelling'
    },
    {
      id: 2,
      name: 'Lil Phoenix',
      fame: 50,
      genre: 'Trap',
      cost: 5000,
      energy: 30,
      fameBoost: 25,
      qualityBonus: 3,
      requirements: { fame: 30 },
      avatar: '🔥',
      bio: 'Rising star in the trap scene',
      specialty: 'Melodic hooks'
    },
    {
      id: 3,
      name: 'Queen Lyric',
      fame: 75,
      genre: 'Conscious Rap',
      cost: 10000,
      energy: 35,
      fameBoost: 40,
      qualityBonus: 4,
      requirements: { fame: 50 },
      avatar: '👑',
      bio: 'Powerful female MC with deep lyrics',
      specialty: 'Social commentary'
    },
    {
      id: 4,
      name: 'DJ Thunder',
      fame: 100,
      genre: 'Producer',
      cost: 25000,
      energy: 40,
      fameBoost: 60,
      qualityBonus: 5,
      requirements: { fame: 75 },
      avatar: '🎧',
      bio: 'Grammy-winning producer',
      specialty: 'Beat production'
    },
    {
      id: 5,
      name: 'Rap Legend',
      fame: 200,
      genre: 'Hip-Hop Icon',
      cost: 100000,
      energy: 50,
      fameBoost: 150,
      qualityBonus: 7,
      requirements: { fame: 150 },
      avatar: '🏆',
      bio: 'Hall of Fame rapper',
      specialty: 'Industry connections'
    }
  ];

  const handleCollaborate = async (artist) => {
    if (player.energy < artist.energy || player.netWorth < artist.cost) return;

    setCollaborating(true);
    setSelectedArtist(artist);

    setTimeout(() => {
      const collaborationTitle = generateCollabTitle(artist);
      const baseQuality = 6 + artist.qualityBonus;
      const skillBonus = Math.floor((player.skills.lyrics + player.skills.flow + player.skills.charisma) / 30);
      const finalQuality = Math.min(10, baseQuality + skillBonus);

      const newCollaboration = {
        id: Date.now(),
        title: collaborationTitle,
        artist: artist.name,
        artistAvatar: artist.avatar,
        quality: finalQuality,
        createdAt: `${player.week}/${player.year}`,
        cost: artist.cost,
        type: 'collaboration',
        released: false
      };

      dispatch({ type: 'ADD_COLLABORATION', payload: newCollaboration });
      dispatch({
        type: 'UPDATE_PLAYER',
        payload: {
          energy: player.energy - artist.energy,
          netWorth: player.netWorth - artist.cost,
          fame: player.fame + artist.fameBoost,
          reputation: player.reputation + Math.floor(artist.fameBoost / 2)
        }
      });

      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'success',
          title: 'Collaboration Complete!',
          message: `"${collaborationTitle}" with ${artist.name} is ready! Quality: ${finalQuality}/10`,
          timestamp: new Date().toISOString()
        }
      });

      setCollaborating(false);
      setSelectedArtist(null);
    }, 3000);
  };

  const generateCollabTitle = (artist) => {
    const titles = [
      `${player.stageName} x ${artist.name}`,
      'Fire Collab',
      'Double Impact',
      'Legends Unite',
      'Power Duo',
      'Dream Team',
      'Unstoppable',
      'Elite Connection',
      'Perfect Match',
      'Dynamic Duo'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const canCollaborate = (artist) => {
    return (
      player.fame >= artist.requirements.fame &&
      player.energy >= artist.energy &&
      player.netWorth >= artist.cost
    );
  };

  const formatPrice = (price) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `$${(price / 1000).toFixed(1)}K`;
    return `$${price}`;
  };

  if (collaborating && selectedArtist) {
    return (
      <div className="min-h-screen bg-ios-bg flex items-center justify-center px-6">
        <motion.div
          className="text-center bg-white p-8 rounded-2xl shadow-ios-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">{selectedArtist.avatar}</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Collaborating with {selectedArtist.name}
          </h2>
          <p className="text-ios-gray mb-6">Creating something amazing together...</p>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-3 border-ios-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ios-bg pb-24 pt-24">
      <div className="px-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Collaborations</h1>
          <p className="text-ios-gray">Work with other artists to create hits</p>
        </div>

        {/* Player Status */}
        <div className="bg-white p-4 rounded-2xl shadow-ios">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-ios-orange">{player.energy}/100</div>
              <div className="text-sm text-ios-gray">Energy</div>
            </div>
            <div>
              <div className="text-lg font-bold text-ios-blue">{player.fame}</div>
              <div className="text-sm text-ios-gray">Fame</div>
            </div>
            <div>
              <div className="text-lg font-bold text-ios-green">{formatPrice(player.netWorth)}</div>
              <div className="text-sm text-ios-gray">Net Worth</div>
            </div>
          </div>
        </div>

        {/* Collaboration Benefits */}
        <div className="bg-gradient-to-r from-ios-purple to-ios-pink p-4 rounded-2xl text-white shadow-ios-lg">
          <h3 className="font-bold text-base mb-2">🤝 Collaboration Benefits</h3>
          <div className="text-sm text-white/90 space-y-1">
            <p>• Higher quality tracks than solo work</p>
            <p>• Massive fame and reputation boost</p>
            <p>• Access to new audiences</p>
            <p>• Unlock special collaboration bonuses</p>
          </div>
        </div>

        {/* Available Artists */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Available Artists</h2>
          <div className="space-y-4">
            {artists.map((artist, index) => {
              const available = canCollaborate(artist);
              return (
                <motion.div
                  key={artist.id}
                  className={`bg-white rounded-2xl shadow-ios transition-all ${
                    available ? 'hover:shadow-ios-lg' : 'opacity-60'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-ios-blue to-ios-purple rounded-2xl flex items-center justify-center text-2xl">
                          {artist.avatar}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">{artist.name}</h3>
                          <p className="text-ios-blue font-medium">{artist.genre}</p>
                          <p className="text-sm text-ios-gray mb-2">{artist.bio}</p>
                          <div className="flex items-center space-x-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <SafeIcon
                                key={i}
                                icon={FiStar}
                                className={`text-sm ${
                                  i < Math.floor(artist.fame / 20) ? 'text-ios-orange' : 'text-ios-gray4'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-ios-gray ml-2">{artist.fame} Fame</span>
                          </div>
                          <div className="text-xs text-ios-purple">Specialty: {artist.specialty}</div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className="text-center p-2 bg-ios-gray6 rounded-xl">
                        <SafeIcon icon={FiDollarSign} className="text-ios-green mx-auto mb-1" />
                        <div className="text-sm font-bold text-gray-900">{formatPrice(artist.cost)}</div>
                        <div className="text-xs text-ios-gray">Cost</div>
                      </div>
                      <div className="text-center p-2 bg-ios-gray6 rounded-xl">
                        <SafeIcon icon={FiZap} className="text-ios-orange mx-auto mb-1" />
                        <div className="text-sm font-bold text-gray-900">{artist.energy}</div>
                        <div className="text-xs text-ios-gray">Energy</div>
                      </div>
                      <div className="text-center p-2 bg-ios-gray6 rounded-xl">
                        <SafeIcon icon={FiTrendingUp} className="text-ios-blue mx-auto mb-1" />
                        <div className="text-sm font-bold text-gray-900">+{artist.fameBoost}</div>
                        <div className="text-xs text-ios-gray">Fame</div>
                      </div>
                      <div className="text-center p-2 bg-ios-gray6 rounded-xl">
                        <SafeIcon icon={FiAward} className="text-ios-purple mx-auto mb-1" />
                        <div className="text-sm font-bold text-gray-900">+{artist.qualityBonus}</div>
                        <div className="text-xs text-ios-gray">Quality</div>
                      </div>
                    </div>

                    {/* Requirements */}
                    {!available && (
                      <div className="mb-3 p-3 bg-ios-red/10 rounded-xl">
                        <p className="text-sm text-ios-red font-medium">Requirements not met:</p>
                        <div className="text-xs text-ios-red mt-1">
                          {player.fame < artist.requirements.fame && (
                            <span>• Need {artist.requirements.fame} fame (you have {player.fame})</span>
                          )}
                          {player.energy < artist.energy && (
                            <span>• Need {artist.energy} energy (you have {player.energy})</span>
                          )}
                          {player.netWorth < artist.cost && (
                            <span>
                              • Need {formatPrice(artist.cost)} (you have {formatPrice(player.netWorth)})
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleCollaborate(artist)}
                      disabled={!available}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                        available
                          ? 'bg-gradient-to-r from-ios-purple to-ios-pink text-white shadow-ios hover:shadow-ios-lg active:scale-95'
                          : 'bg-ios-gray4 text-ios-gray cursor-not-allowed'
                      }`}
                    >
                      {available ? 'Collaborate Now' : 'Requirements Not Met'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* My Collaborations */}
        {collaborations.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">My Collaborations</h2>
            <div className="space-y-3">
              {collaborations.map((collab) => (
                <div key={collab.id} className="bg-white p-4 rounded-2xl shadow-ios">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{collab.artistAvatar}</div>
                      <div>
                        <h4 className="font-bold text-gray-900">{collab.title}</h4>
                        <p className="text-sm text-ios-gray">with {collab.artist}</p>
                        <p className="text-xs text-ios-gray2">Created: {collab.createdAt}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <SafeIcon
                            key={i}
                            icon={FiStar}
                            className={`text-xs ${i < collab.quality ? 'text-ios-orange' : 'text-ios-gray4'}`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-ios-gray">Quality: {collab.quality}/10</div>
                    </div>
                  </div>
                  {!collab.released && (
                    <button
                      onClick={() => {
                        dispatch({
                          type: 'RELEASE_CONTENT',
                          payload: {
                            contentId: collab.id,
                            type: 'collaboration',
                            title: collab.title,
                            quality: collab.quality,
                            platform: 'Rapify'
                          }
                        });
                      }}
                      className="w-full bg-ios-purple text-white py-2 px-4 rounded-xl font-semibold hover:shadow-ios transition-all active:scale-95"
                    >
                      <SafeIcon icon={FiMusic} className="inline mr-2" />
                      Release Collaboration
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}