import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  calculateFameGain, 
  calculateReputationGain, 
  calculateFanGrowth, 
  calculateFollowerGrowth,
  calculateStreams,
  calculateAlbumSales,
  getCurrentCareerLevel,
  canLevelUp,
  getNextCareerLevel,
  calculateInactivityPenalty,
  calculateContentQuality,
  calculateViralPotential
} from '../utils/careerSystem';

const GameContext = createContext();

const initialState = {
  player: {
    stageName: '',
    avatar: 1,
    city: 'Los Angeles',
    age: 20,
    year: 2020,
    week: 1,
    month: 1,
    fame: 0,
    reputation: 0,
    fans: 0,
    netWorth: 100,
    energy: 100,
    careerLevel: null,
    lastReleaseWeek: 0,
    totalReleases: 0,
    consistencyScore: 1.0,
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
    inventory: [],
    equipment: [],
    collaborators: []
  },
  tracks: [],
  albums: [],
  musicVideos: [],
  concerts: [],
  collaborations: [],
  socialPosts: [],
  releases: [],
  earnings: {
    total: 0,
    thisWeek: 0,
    streaming: 0,
    youtube: 0,
    concerts: 0,
    merchandise: 0,
    albumSales: 0
  },
  gameStarted: false,
  currentPage: 'home',
  notifications: [],
  slot: null,
  careerStats: {
    totalStreams: 0,
    totalAlbumSales: 0,
    chartPositions: [],
    awards: [],
    milestones: []
  }
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'CREATE_CHARACTER':
      const initialLevel = getCurrentCareerLevel(0, 0);
      return {
        ...state,
        player: { 
          ...state.player, 
          ...action.payload,
          careerLevel: initialLevel
        },
        gameStarted: true
      };

    case 'LOAD_GAME_STATE':
      return {
        ...action.payload,
        lastPlayed: new Date().toISOString()
      };

    case 'RESET_GAME':
      return { ...initialState };

    case 'UPDATE_PLAYER':
      const updatedPlayer = { ...state.player, ...action.payload };
      
      // Update career level based on new fame/reputation
      if (action.payload.fame !== undefined || action.payload.reputation !== undefined) {
        updatedPlayer.careerLevel = getCurrentCareerLevel(updatedPlayer.fame, updatedPlayer.reputation);
      }
      
      const newState = {
        ...state,
        player: updatedPlayer
      };
      
      if (newState.slot) {
        localStorage.setItem(`rapCareer_slot_${newState.slot}`, JSON.stringify(newState));
      }
      return newState;

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

    case 'ADD_CONCERT':
      const concertFameGain = calculateFameGain('concert', action.payload.quality, state.player.careerLevel?.id);
      const concertReputationGain = calculateReputationGain('consistent', action.payload.quality);
      const concertFanGrowth = calculateFanGrowth(state.player.fame, state.player.reputation, 'concert');
      const concertFollowerGrowth = calculateFollowerGrowth(state.player.fame, state.player.reputation, 'concert');

      return {
        ...state,
        concerts: [...state.concerts, action.payload],
        player: {
          ...state.player,
          fame: Math.min(100, state.player.fame + concertFameGain),
          reputation: Math.min(100, state.player.reputation + concertReputationGain),
          fans: state.player.fans + concertFanGrowth,
          socialMedia: {
            ...state.player.socialMedia,
            rapgram: {
              ...state.player.socialMedia.rapgram,
              followers: state.player.socialMedia.rapgram.followers + Math.floor(concertFollowerGrowth * 0.3)
            },
            riktok: {
              ...state.player.socialMedia.riktok,
              followers: state.player.socialMedia.riktok.followers + Math.floor(concertFollowerGrowth * 0.4)
            }
          }
        },
        earnings: {
          ...state.earnings,
          concerts: state.earnings.concerts + action.payload.earnings,
          total: state.earnings.total + action.payload.earnings,
          thisWeek: state.earnings.thisWeek + action.payload.earnings
        }
      };

    case 'ADD_COLLABORATION':
      return {
        ...state,
        collaborations: [...state.collaborations, action.payload]
      };

    case 'MARK_TRACKS_IN_ALBUM':
      return {
        ...state,
        tracks: state.tracks.map((track) =>
          action.payload.trackIds.includes(track.id) ? { ...track, inAlbum: true } : track
        )
      };

    case 'MARK_TRACK_HAS_VIDEO':
      return {
        ...state,
        tracks: state.tracks.map((track) =>
          track.id === action.payload.trackId ? { ...track, hasVideo: true } : track
        )
      };

    case 'ADD_SOCIAL_POST':
      const engagementBonus = Math.floor(action.payload.likes / 100);
      const postFameGain = Math.floor(engagementBonus / 50);
      
      return {
        ...state,
        socialPosts: [...state.socialPosts, action.payload],
        player: {
          ...state.player,
          fans: state.player.fans + engagementBonus,
          fame: Math.min(100, state.player.fame + postFameGain),
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
      const { contentId, type, title, quality, platform } = action.payload;
      
      // Calculate career progression gains
      const releaseType = type === 'album' ? 'album' : 'track';
      const fameGain = calculateFameGain(releaseType, quality, state.player.careerLevel?.id);
      const reputationGain = calculateReputationGain('highQuality', quality);
      const fanGrowth = calculateFanGrowth(state.player.fame, state.player.reputation, releaseType);
      const followerGrowth = calculateFollowerGrowth(state.player.fame, state.player.reputation, type === 'album' ? 'album' : 'single');
      
      // Calculate streams and sales
      const expectedStreams = calculateStreams(state.player.fame + fameGain, state.player.reputation + reputationGain, state.player.fans + fanGrowth, quality);
      const albumSales = type === 'album' ? calculateAlbumSales(expectedStreams) : 0;
      
      // Viral potential
      const viralData = calculateViralPotential(quality, 8, 7); // Assume decent timing and trends
      const finalStreams = Math.floor(expectedStreams * viralData.multiplier);
      
      // Earnings calculation
      const viewValue = type === 'video' ? 0.08 : type === 'album' ? 0.25 : 0.15;
      const initialEarnings = finalStreams * viewValue;
      const albumSalesEarnings = albumSales * 2.5; // $2.50 per album
      
      const newRelease = {
        ...action.payload,
        id: Date.now(),
        releaseDate: `W${state.player.week}/${state.player.year}`,
        views: finalStreams,
        streams: type !== 'video' ? Math.floor(finalStreams * 1.2) : 0,
        albumSales: albumSales,
        earnings: initialEarnings + albumSalesEarnings,
        trending: false,
        peakPosition: null,
        announced: false,
        platforms: type === 'video' ? ['raptube'] : ['rapify'],
        dailyViews: Math.floor(finalStreams / 7),
        weeklyViews: finalStreams,
        monthlyViews: finalStreams,
        viewsHistory: [{ week: state.player.week, views: finalStreams }],
        peakWeeklyViews: finalStreams,
        chartPosition: viralData.isViral ? Math.floor(Math.random() * 20) + 1 : null,
        isViral: viralData.isViral,
        releaseWeek: state.player.week,
        ageMultiplier: 1.0,
        qualityRating: quality,
        careerLevel: state.player.careerLevel?.title
      };

      // Update consistency score
      const releaseWeeksSinceLastRelease = state.player.week - state.player.lastReleaseWeek;
      const newConsistencyScore = releaseWeeksSinceLastRelease <= 12 ? 
        Math.min(1.0, state.player.consistencyScore + 0.1) : 
        Math.max(0.3, state.player.consistencyScore - 0.2);

      // Career level up check
      const updatedFame = Math.min(100, state.player.fame + fameGain);
      const updatedReputation = Math.min(100, state.player.reputation + reputationGain);
      const currentLevel = getCurrentCareerLevel(updatedFame, updatedReputation);
      const leveledUp = currentLevel.id > state.player.careerLevel?.id;

      // Milestone notifications
      const milestoneNotifications = [];
      
      if (leveledUp) {
        milestoneNotifications.push({
          id: Date.now() + 1,
          type: 'achievement',
          title: `🎉 LEVEL UP! ${currentLevel.icon}`,
          message: `You've reached ${currentLevel.title}! ${currentLevel.unlocks.join(', ')} now available!`,
          timestamp: new Date().toISOString()
        });
      }
      
      if (viralData.isViral) {
        milestoneNotifications.push({
          id: Date.now() + 2,
          type: 'success',
          title: 'VIRAL SUCCESS! 🔥',
          message: `"${title}" has gone viral with ${formatNumber(finalStreams)} streams!`,
          timestamp: new Date().toISOString()
        });
      }

      return {
        ...state,
        releases: [...state.releases, newRelease],
        tracks: state.tracks.map((track) =>
          track.id === contentId ? { ...track, released: true, releaseId: newRelease.id } : track
        ),
        albums: state.albums.map((album) =>
          album.id === contentId ? { ...album, released: true, releaseId: newRelease.id } : album
        ),
        musicVideos: state.musicVideos.map((video) =>
          video.id === contentId ? { ...video, released: true, releaseId: newRelease.id } : video
        ),
        collaborations: state.collaborations.map((collab) =>
          collab.id === contentId ? { ...collab, released: true, releaseId: newRelease.id } : collab
        ),
        player: {
          ...state.player,
          netWorth: state.player.netWorth + initialEarnings + albumSalesEarnings,
          fame: updatedFame,
          reputation: updatedReputation,
          fans: state.player.fans + fanGrowth,
          careerLevel: currentLevel,
          lastReleaseWeek: state.player.week,
          totalReleases: state.player.totalReleases + 1,
          consistencyScore: newConsistencyScore,
          socialMedia: {
            ...state.player.socialMedia,
            [type === 'video' ? 'raptube' : 'rapify']: {
              ...state.player.socialMedia[type === 'video' ? 'raptube' : 'rapify'],
              [type === 'video' ? 'totalViews' : 'streams']:
                state.player.socialMedia[type === 'video' ? 'raptube' : 'rapify'][
                  type === 'video' ? 'totalViews' : 'streams'
                ] + finalStreams,
              followers: state.player.socialMedia[type === 'video' ? 'raptube' : 'rapify'].followers + Math.floor(followerGrowth * 0.6)
            }
          }
        },
        earnings: {
          ...state.earnings,
          total: state.earnings.total + initialEarnings + albumSalesEarnings,
          thisWeek: state.earnings.thisWeek + initialEarnings + albumSalesEarnings,
          streaming: state.earnings.streaming + initialEarnings,
          albumSales: state.earnings.albumSales + albumSalesEarnings,
          [type === 'video' ? 'youtube' : 'streaming']:
            state.earnings[type === 'video' ? 'youtube' : 'streaming'] + initialEarnings
        },
        careerStats: {
          ...state.careerStats,
          totalStreams: state.careerStats.totalStreams + finalStreams,
          totalAlbumSales: state.careerStats.totalAlbumSales + albumSales
        },
        notifications: [
          ...milestoneNotifications,
          ...state.notifications.slice(0, 8)
        ]
      };

    case 'ANNOUNCE_RELEASE':
      const { releaseId } = action.payload;
      const baseReach = Math.floor(
        state.player.fans * 0.4 + state.player.socialMedia.rapgram.followers * 0.3
      );
      const announcementViews = Math.floor(baseReach * (0.5 + Math.random() * 0.8));
      const announcementEarnings = announcementViews * 0.12;

      const release = state.releases.find((r) => r.id === releaseId);
      const announcementFollowerGrowth = calculateFollowerGrowth(state.player.fame, state.player.reputation, 'single');

      const announcementPost = {
        id: Date.now(),
        platform: 'rapgram',
        content: `🔥 NEW RELEASE ALERT! 🔥\n\n"${release.title}" is now live on ${
          release.type === 'video' ? 'RapTube' : 'Rapify'
        }! Go check it out and let me know what you think! 🎵\n\n#NewMusic #${
          release.type === 'video' ? 'MusicVideo' : 'NewTrack'
        } #MusicLife`,
        likes: Math.floor(announcementViews * 0.15),
        comments: Math.floor(announcementViews * 0.05),
        shares: Math.floor(announcementViews * 0.03),
        createdAt: `W${state.player.week}/${state.player.year}`,
        contentId: release.id,
        isViral: announcementViews > 10000,
        isAnnouncement: true
      };

      const rikTokPost = {
        ...announcementPost,
        id: Date.now() + 1,
        platform: 'riktok'
      };

      return {
        ...state,
        releases: state.releases.map((rel) =>
          rel.id === releaseId
            ? {
                ...rel,
                announced: true,
                views: rel.views + announcementViews,
                earnings: rel.earnings + announcementEarnings,
                weeklyViews: rel.weeklyViews + announcementViews,
                dailyViews: rel.dailyViews + Math.floor(announcementViews * 0.3),
                peakWeeklyViews: Math.max(rel.peakWeeklyViews, rel.weeklyViews + announcementViews)
              }
            : rel
        ),
        socialPosts: [...state.socialPosts, announcementPost, rikTokPost],
        player: {
          ...state.player,
          netWorth: state.player.netWorth + announcementEarnings,
          fans: state.player.fans + Math.floor(announcementViews / 150),
          fame: Math.min(100, state.player.fame + Math.floor(announcementViews / 800)),
          socialMedia: {
            ...state.player.socialMedia,
            rapgram: {
              ...state.player.socialMedia.rapgram,
              posts: state.player.socialMedia.rapgram.posts + 1,
              followers: state.player.socialMedia.rapgram.followers + Math.floor(announcementFollowerGrowth * 0.2)
            },
            riktok: {
              ...state.player.socialMedia.riktok,
              posts: (state.player.socialMedia.riktok.posts || 0) + 1,
              followers: state.player.socialMedia.riktok.followers + Math.floor(announcementFollowerGrowth * 0.3)
            }
          }
        },
        earnings: {
          ...state.earnings,
          total: state.earnings.total + announcementEarnings,
          thisWeek: state.earnings.thisWeek + announcementEarnings
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
        notifications: [{ ...action.payload, shown: false, read: false }, ...state.notifications.slice(0, 19)]
      };

    case 'MARK_NOTIFICATION_SHOWN':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload.id
            ? { ...notification, shown: true }
            : notification
        )
      };

    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload.id)
      };

    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      };

    case 'ADVANCE_WEEK':
      const newWeek = state.player.week + 1;
      const newYear = newWeek > 52 ? state.player.year + 1 : state.player.year;
      const resetWeek = newWeek > 52 ? 1 : newWeek;
      const newAge = newYear - 2020 + 20;
      const newMonth = Math.ceil(resetWeek / 4.33);

      // Check for inactivity penalty - renamed variable to avoid conflict
      const advanceWeeksSinceLastRelease = state.player.week - (state.player.lastReleaseWeek || 0);
      const inactivityPenalty = calculateInactivityPenalty(advanceWeeksSinceLastRelease);

      // Enhanced fan-based social media growth using career system
      const currentLevel = getCurrentCareerLevel(state.player.fame, state.player.reputation);
      const fanGrowthRate = currentLevel ? Math.max(1, state.player.fans / 1000) : 1;
      
      let weeklyEarnings = 0;
      let weeklyViews = 0;
      let weeklyStreams = 0;

      const updatedReleasesWeek = state.releases.map((release) => {
        if (release.views === 0) return release;

        // Enhanced aging and viral mechanics
        const weeksOld = state.player.week - (release.releaseWeek || 0);
        const ageDecay = Math.max(0.1, 1 - weeksOld * 0.03); // Slower decay for quality content

        // Base views with career level influence
        const baseViews = Math.floor(Math.random() * 3000) + 1000;
        const qualityMultiplier = Math.max(0.4, release.qualityRating / 10);
        const careerMultiplier = currentLevel ? 1 + (currentLevel.id * 0.15) : 1;
        const consistencyMultiplier = state.player.consistencyScore;
        
        // Fan engagement based on career level
        const fanEngagement = Math.min(1, state.player.fans / (currentLevel?.fanGrowthRange[1] || 1000));
        
        // Viral sustainability
        const viralChance = release.peakWeeklyViews > 100000 ? 0.2 : 0.08;
        const isViralWeek = Math.random() < viralChance;
        const viralMultiplier = isViralWeek ? 1.5 + Math.random() * 2 : 1;

        const weeklyViewGain = Math.floor(
          baseViews * 
          qualityMultiplier * 
          careerMultiplier * 
          consistencyMultiplier * 
          fanEngagement * 
          ageDecay * 
          viralMultiplier
        );

        // Enhanced earnings with career progression
        const viewValue = release.type === 'video' ? 0.08 : release.type === 'album' ? 0.25 : 0.18;
        const careerBonus = currentLevel ? currentLevel.id * 0.02 : 0; // Higher level = better deals
        const earnings = weeklyViewGain * (viewValue + careerBonus);

        weeklyEarnings += earnings;
        weeklyViews += weeklyViewGain;
        weeklyStreams += Math.floor(weeklyViewGain * 1.1);

        const newTotalViews = release.views + weeklyViewGain;
        const newWeeklyViews = weeklyViewGain;
        const newPeakWeekly = Math.max(release.peakWeeklyViews, newWeeklyViews);

        // Enhanced chart mechanics based on career level
        let chartPosition = release.chartPosition;
        if (newTotalViews > 5000000 && currentLevel?.id >= 6 && !chartPosition) {
          chartPosition = Math.floor(Math.random() * 10) + 1; // Top 10
        } else if (newTotalViews > 2000000 && currentLevel?.id >= 4 && !chartPosition) {
          chartPosition = Math.floor(Math.random() * 20) + 1; // Top 20
        } else if (newTotalViews > 500000 && currentLevel?.id >= 3 && !chartPosition) {
          chartPosition = Math.floor(Math.random() * 50) + 1; // Top 50
        }

        const trending = newWeeklyViews > 50000 && newWeeklyViews < 200000;
        const isViral = newTotalViews > 2000000 || newWeeklyViews > 200000;

        return {
          ...release,
          views: newTotalViews,
          streams: release.streams + Math.floor(weeklyViewGain * 1.1),
          earnings: release.earnings + earnings,
          weeklyViews: newWeeklyViews,
          peakWeeklyViews: newPeakWeekly,
          dailyViews: Math.floor(newWeeklyViews / 7),
          monthlyViews: release.monthlyViews ? release.monthlyViews + newWeeklyViews : newWeeklyViews,
          viewsHistory: [
            ...(release.viewsHistory || []),
            {
              week: state.player.week,
              views: newWeeklyViews,
              total: newTotalViews,
              earnings: earnings
            }
          ].slice(-24), // Keep 6 months of history
          trending: trending,
          isViral: isViral,
          chartPosition: chartPosition,
          ageMultiplier: ageDecay,
          avgWeeklyViews: release.viewsHistory
            ? release.viewsHistory.reduce((sum, h) => sum + h.views, 0) / release.viewsHistory.length
            : newWeeklyViews,
          growthRate: release.weeklyViews
            ? ((newWeeklyViews - release.weeklyViews) / release.weeklyViews) * 100
            : 0
        };
      });

      // Career-based social media growth
      const totalReleaseViews = updatedReleasesWeek.reduce((sum, release) => sum + (release.weeklyViews || 0), 0);
      
      let fameChange = 0;
      let reputationChange = 0;
      let fanChange = 0;
      let socialMediaChange = {};

      if (inactivityPenalty) {
        fameChange = inactivityPenalty.fame;
        reputationChange = inactivityPenalty.reputation;
        fanChange = Math.floor(state.player.fans * inactivityPenalty.fans);
        
        // Apply penalties to social media
        Object.keys(state.player.socialMedia).forEach(platform => {
          const currentFollowers = state.player.socialMedia[platform].followers;
          socialMediaChange[platform] = {
            ...state.player.socialMedia[platform],
            followers: Math.max(0, Math.floor(currentFollowers * (1 + inactivityPenalty.followers)))
          };
        });
      } else {
        // Normal growth based on career level
        const levelMultiplier = currentLevel ? 1 + (currentLevel.id * 0.2) : 1;
        const baseFollowerGrowth = calculateFollowerGrowth(state.player.fame, state.player.reputation);
        
        socialMediaChange = {
          rapgram: {
            ...state.player.socialMedia.rapgram,
            followers: Math.floor(
              state.player.socialMedia.rapgram.followers + 
              (baseFollowerGrowth * 0.3 * levelMultiplier) +
              (totalReleaseViews * 0.02)
            )
          },
          raptube: {
            ...state.player.socialMedia.raptube,
            subscribers: Math.floor(
              state.player.socialMedia.raptube.subscribers + 
              (baseFollowerGrowth * 0.25 * levelMultiplier)
            ),
            totalViews: state.player.socialMedia.raptube.totalViews + weeklyViews,
            videos: state.musicVideos.filter((v) => v.released).length
          },
          rapify: {
            ...state.player.socialMedia.rapify,
            listeners: Math.floor(
              state.player.socialMedia.rapify.listeners + 
              (baseFollowerGrowth * 0.4 * levelMultiplier)
            ),
            streams: state.player.socialMedia.rapify.streams + weeklyStreams
          },
          riktok: {
            ...state.player.socialMedia.riktok,
            followers: Math.floor(
              state.player.socialMedia.riktok.followers + 
              (baseFollowerGrowth * 0.35 * levelMultiplier)
            )
          }
        };

        // Natural fan growth based on career success
        const naturalFanGrowth = calculateFanGrowth(state.player.fame, state.player.reputation);
        fanChange = Math.floor(naturalFanGrowth * 0.1 * levelMultiplier);
      }

      // Milestone notifications
      const milestoneNotifications = [];
      const viralReleases = updatedReleasesWeek.filter((r) => r.isViral && !r.viralNotified);
      const chartHits = updatedReleasesWeek.filter(
        (r) => r.chartPosition && r.chartPosition <= 10 && !r.chartNotified
      );

      if (viralReleases.length > 0) {
        viralReleases.forEach((release) => {
          milestoneNotifications.push({
            id: Date.now() + Math.random(),
            type: 'success',
            title: 'VIRAL HIT! 🔥',
            message: `"${release.title}" has gone viral with ${formatNumber(release.views)} total streams!`,
            timestamp: new Date().toISOString()
          });
          release.viralNotified = true;
        });
      }

      if (chartHits.length > 0) {
        chartHits.forEach((release) => {
          milestoneNotifications.push({
            id: Date.now() + Math.random(),
            type: 'success',
            title: `CHART SUCCESS! 📈`,
            message: `"${release.title}" hit #${release.chartPosition} on the charts!`,
            timestamp: new Date().toISOString()
          });
          release.chartNotified = true;
        });
      }

      if (inactivityPenalty) {
        milestoneNotifications.push({
          id: Date.now() + Math.random(),
          type: 'error',
          title: 'Inactivity Penalty! ⚠️',
          message: `No releases for ${advanceWeeksSinceLastRelease} weeks! Your career is stalling. Release new content soon!`,
          timestamp: new Date().toISOString()
        });
      }

      // Check for career level progression
      const updatedFame = Math.max(0, Math.min(100, state.player.fame + fameChange));
      const updatedReputation = Math.max(0, Math.min(100, state.player.reputation + reputationChange));
      const newCareerLevel = getCurrentCareerLevel(updatedFame, updatedReputation);
      
      if (newCareerLevel.id !== currentLevel?.id) {
        milestoneNotifications.push({
          id: Date.now() + Math.random(),
          type: newCareerLevel.id > currentLevel?.id ? 'achievement' : 'error',
          title: newCareerLevel.id > currentLevel?.id ? 
            `🎉 CAREER MILESTONE! ${newCareerLevel.icon}` : 
            `📉 Career Decline`,
          message: newCareerLevel.id > currentLevel?.id ?
            `Welcome to ${newCareerLevel.title}! ${newCareerLevel.unlocks.join(', ')} unlocked!` :
            `Your career level dropped to ${newCareerLevel.title}. Focus on quality and consistency!`,
          timestamp: new Date().toISOString()
        });
      }

      const newStateWeek = {
        ...state,
        player: {
          ...state.player,
          week: resetWeek,
          year: newYear,
          month: newMonth,
          age: newAge,
          energy: 100,
          netWorth: Math.max(0, state.player.netWorth + weeklyEarnings),
          fame: updatedFame,
          reputation: updatedReputation,
          fans: Math.max(0, state.player.fans + fanChange),
          careerLevel: newCareerLevel,
          socialMedia: socialMediaChange
        },
        releases: updatedReleasesWeek,
        earnings: {
          ...state.earnings,
          total: state.earnings.total + weeklyEarnings,
          thisWeek: weeklyEarnings,
          streaming: state.earnings.streaming + weeklyEarnings * 0.7,
          youtube: state.earnings.youtube + weeklyEarnings * 0.3
        },
        careerStats: {
          ...state.careerStats,
          totalStreams: state.careerStats.totalStreams + weeklyStreams
        },
        notifications: [
          ...(weeklyEarnings > 100
            ? [
                {
                  id: Date.now(),
                  type: 'earnings',
                  title: 'Weekly Earnings',
                  message: `You earned $${Math.floor(
                    weeklyEarnings
                  )} this week from ${formatNumber(weeklyViews)} views!`,
                  timestamp: new Date().toISOString(),
                  shown: false,
                  read: false
                }
              ]
            : []),
          ...milestoneNotifications.map(notif => ({ ...notif, shown: false, read: false })),
          ...state.notifications.slice(0, 6)
        ]
      };

      if (newStateWeek.slot) {
        localStorage.setItem(`rapCareer_slot_${newStateWeek.slot}`, JSON.stringify(newStateWeek));
      }

      return newStateWeek;

    case 'PURCHASE_ITEM':
      return {
        ...state,
        player: {
          ...state.player,
          netWorth: state.player.netWorth - action.payload.price,
          fame: Math.min(100, state.player.fame + action.payload.fame),
          reputation: Math.min(100, state.player.reputation + action.payload.reputation),
          inventory: [...state.player.inventory, action.payload]
        }
      };

    case 'UPGRADE_SKILL':
      const getUpgradeCost = (currentLevel) => {
        if (currentLevel < 25) return 2;
        if (currentLevel < 50) return 4;
        if (currentLevel < 75) return 6;
        if (currentLevel < 90) return 8;
        if (currentLevel < 95) return 12;
        if (currentLevel < 98) return 16;
        if (currentLevel < 99) return 25;
        return 100;
      };

      const cost = getUpgradeCost(state.player.skills[action.payload.skill]);

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

// Helper function for number formatting
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

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    if (!state.gameStarted || !state.slot) return;

    const interval = setInterval(() => {
      const currentState = {
        ...state,
        lastPlayed: new Date().toISOString()
      };
      localStorage.setItem(`rapCareer_slot_${state.slot}`, JSON.stringify(currentState));
    }, 30000);

    return () => clearInterval(interval);
  }, [state]);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}