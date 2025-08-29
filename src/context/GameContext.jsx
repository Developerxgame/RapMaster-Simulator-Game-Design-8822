import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext();

const initialState = {
  player: {
    stageName: '',
    avatar: 1,
    city: 'Los Angeles',
    age: 20,
    year: 2020,
    week: 1,
    fame: 0,
    reputation: 0,
    fans: 0,
    netWorth: 100,
    energy: 100,
    skills: {
      lyrics: 1,
      flow: 1,
      charisma: 1,
      business: 1,
      production: 1
    },
    socialMedia: {
      rapgram: { followers: 0, posts: 0 },
      raptube: { subscribers: 0, videos: 0, totalViews: 0 },
      rapify: { listeners: 0, streams: 0 },
      riktok: { followers: 0, videos: 0 }
    },
    achievements: [],
    inventory: []
  },
  tracks: [],
  albums: [],
  musicVideos: [],
  socialPosts: [],
  releases: [],
  earnings: {
    total: 0,
    thisWeek: 0,
    streaming: 0,
    youtube: 0,
    concerts: 0,
    merchandise: 0
  },
  gameStarted: false,
  currentPage: 'home',
  notifications: []
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'CREATE_CHARACTER':
      return {
        ...state,
        player: {
          ...state.player,
          ...action.payload
        },
        gameStarted: true
      };

    case 'UPDATE_PLAYER':
      return {
        ...state,
        player: {
          ...state.player,
          ...action.payload
        }
      };

    case 'ADD_TRACK':
      return {
        ...state,
        tracks: [...state.tracks, action.payload]
      };

    case 'ADD_ALBUM':
      return {
        ...state,
        albums: [...state.albums, action.payload]
      };

    case 'ADD_MUSIC_VIDEO':
      return {
        ...state,
        musicVideos: [...state.musicVideos, action.payload]
      };

    case 'ADD_SOCIAL_POST':
      const engagementBonus = Math.floor(action.payload.likes / 100);
      return {
        ...state,
        socialPosts: [...state.socialPosts, action.payload],
        player: {
          ...state.player,
          fans: state.player.fans + engagementBonus,
          fame: state.player.fame + Math.floor(engagementBonus / 10),
          socialMedia: {
            ...state.player.socialMedia,
            [action.payload.platform]: {
              ...state.player.socialMedia[action.payload.platform],
              posts: state.player.socialMedia[action.payload.platform].posts + 1,
              followers: state.player.socialMedia[action.payload.platform].followers + engagementBonus
            }
          }
        }
      };

    case 'RELEASE_CONTENT':
      const newRelease = {
        ...action.payload,
        id: Date.now(),
        releaseDate: `${state.player.week}/${state.player.year}`,
        views: 0,
        streams: 0,
        earnings: 0,
        trending: false,
        peakPosition: null
      };
      
      return {
        ...state,
        releases: [...state.releases, newRelease],
        tracks: state.tracks.map(track => 
          track.id === action.payload.contentId 
            ? { ...track, released: true, releaseId: newRelease.id }
            : track
        ),
        albums: state.albums.map(album => 
          album.id === action.payload.contentId 
            ? { ...album, released: true, releaseId: newRelease.id }
            : album
        ),
        musicVideos: state.musicVideos.map(video => 
          video.id === action.payload.contentId 
            ? { ...video, released: true, releaseId: newRelease.id }
            : video
        )
      };

    case 'UPDATE_RELEASE_STATS':
      const updatedReleases = state.releases.map(release => {
        if (release.id === action.payload.releaseId) {
          const newViews = release.views + (action.payload.views || 0);
          const newEarnings = release.earnings + (action.payload.earnings || 0);
          
          return {
            ...release,
            views: newViews,
            streams: release.streams + (action.payload.streams || 0),
            earnings: newEarnings,
            trending: newViews > 50000 && newViews < 100000,
            peakPosition: newViews > 100000 ? Math.max(1, Math.floor(Math.random() * 10)) : release.peakPosition
          };
        }
        return release;
      });

      return {
        ...state,
        releases: updatedReleases,
        earnings: {
          ...state.earnings,
          total: state.earnings.total + (action.payload.earnings || 0),
          thisWeek: state.earnings.thisWeek + (action.payload.earnings || 0),
          streaming: action.payload.type === 'streaming' 
            ? state.earnings.streaming + (action.payload.earnings || 0)
            : state.earnings.streaming,
          youtube: action.payload.type === 'youtube' 
            ? state.earnings.youtube + (action.payload.earnings || 0)
            : state.earnings.youtube
        },
        player: {
          ...state.player,
          netWorth: state.player.netWorth + (action.payload.earnings || 0),
          fans: state.player.fans + Math.floor((action.payload.views || 0) / 100),
          fame: state.player.fame + Math.floor((action.payload.views || 0) / 1000),
          reputation: state.player.reputation + Math.floor((action.payload.views || 0) / 2000)
        }
      };

    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications.slice(0, 9)]
      };

    case 'ADVANCE_WEEK':
      const newWeek = state.player.week + 1;
      const newYear = newWeek > 52 ? state.player.year + 1 : state.player.year;
      const resetWeek = newWeek > 52 ? 1 : newWeek;
      const newAge = newYear - 2020 + 20;

      // Generate passive income from releases
      let weeklyEarnings = 0;
      let weeklyViews = 0;
      const updatedReleasesWeek = state.releases.map(release => {
        if (release.views === 0) return release;
        
        const baseViews = Math.floor(Math.random() * 1000) + 100;
        const qualityMultiplier = Math.max(0.5, release.quality / 10);
        const fameMultiplier = Math.max(0.1, state.player.fame / 100);
        const ageMultiplier = Math.max(0.1, 1 - ((state.player.week - release.releaseWeek || 0) * 0.01));
        
        const newViews = Math.floor(baseViews * qualityMultiplier * fameMultiplier * ageMultiplier);
        const earnings = newViews * 0.15; // $0.15 per view
        
        weeklyEarnings += earnings;
        weeklyViews += newViews;
        
        return {
          ...release,
          views: release.views + newViews,
          earnings: release.earnings + earnings,
          releaseWeek: release.releaseWeek || state.player.week
        };
      });

      // Social media growth
      const newSocialMedia = {
        ...state.player.socialMedia,
        rapgram: {
          ...state.player.socialMedia.rapgram,
          followers: state.player.socialMedia.rapgram.followers + Math.floor(state.player.fame * 0.5)
        },
        raptube: {
          ...state.player.socialMedia.raptube,
          subscribers: state.player.socialMedia.raptube.subscribers + Math.floor(state.player.fame * 0.3)
        },
        rapify: {
          ...state.player.socialMedia.rapify,
          listeners: state.player.socialMedia.rapify.listeners + Math.floor(state.player.fame * 0.8)
        },
        riktok: {
          ...state.player.socialMedia.riktok,
          followers: state.player.socialMedia.riktok.followers + Math.floor(state.player.fame * 0.6)
        }
      };

      return {
        ...state,
        player: {
          ...state.player,
          week: resetWeek,
          year: newYear,
          age: newAge,
          energy: Math.min(100, state.player.energy + 25),
          netWorth: state.player.netWorth + weeklyEarnings,
          socialMedia: newSocialMedia
        },
        releases: updatedReleasesWeek,
        earnings: {
          ...state.earnings,
          total: state.earnings.total + weeklyEarnings,
          thisWeek: weeklyEarnings,
          streaming: state.earnings.streaming + weeklyEarnings * 0.6,
          youtube: state.earnings.youtube + weeklyEarnings * 0.4
        },
        notifications: weeklyEarnings > 100 ? [{
          id: Date.now(),
          type: 'earnings',
          title: 'Weekly Earnings',
          message: `You earned $${weeklyEarnings.toFixed(2)} this week from ${weeklyViews.toLocaleString()} views!`,
          timestamp: new Date().toISOString()
        }, ...state.notifications.slice(0, 9)] : state.notifications
      };

    case 'PURCHASE_ITEM':
      return {
        ...state,
        player: {
          ...state.player,
          netWorth: state.player.netWorth - action.payload.price,
          fame: state.player.fame + action.payload.fame,
          reputation: state.player.reputation + action.payload.reputation,
          inventory: [...state.player.inventory, action.payload]
        }
      };

    case 'UPGRADE_SKILL':
      const cost = state.player.skills[action.payload.skill] * 2;
      return {
        ...state,
        player: {
          ...state.player,
          energy: state.player.energy - cost,
          skills: {
            ...state.player.skills,
            [action.payload.skill]: state.player.skills[action.payload.skill] + 1
          }
        }
      };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    const savedGame = localStorage.getItem('rapCareerGame');
    if (savedGame) {
      try {
        const gameData = JSON.parse(savedGame);
        if (gameData.gameStarted) {
          dispatch({ type: 'CREATE_CHARACTER', payload: gameData.player });
          // Restore other state data
          Object.keys(gameData).forEach(key => {
            if (key !== 'player' && key !== 'gameStarted') {
              // You might want to create specific actions for restoring different parts of state
            }
          });
        }
      } catch (error) {
        console.error('Failed to load saved game:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rapCareerGame', JSON.stringify(state));
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}