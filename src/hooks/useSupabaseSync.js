import { useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useGame } from '../context/GameContext'
import { careerService } from '../services/careerService'
import { contentService } from '../services/contentService'
import { socialService } from '../services/socialService'
import { concertService } from '../services/concertService'
import { notificationService } from '../services/notificationService'

export function useSupabaseSync() {
  const { user } = useAuth()
  const { state, dispatch } = useGame()
  const syncTimeoutRef = useRef(null)
  const lastSyncRef = useRef(null)

  // Auto-save game state to Supabase
  const saveToSupabase = async (gameState) => {
    if (!user || !gameState.gameStarted || !gameState.currentCareerId) return

    try {
      // Debounce saves to avoid too frequent updates
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }

      syncTimeoutRef.current = setTimeout(async () => {
        const result = await careerService.saveGameState(gameState.currentCareerId, gameState)
        if (result.success) {
          lastSyncRef.current = Date.now()
          console.log('Game state synced to Supabase')
        }
      }, 2000) // Debounce for 2 seconds
    } catch (error) {
      console.error('Failed to sync to Supabase:', error)
    }
  }

  // Load game state from Supabase
  const loadFromSupabase = async (careerId) => {
    if (!user || !careerId) return

    try {
      const result = await careerService.getCareerWithData(careerId)
      if (result.success) {
        // Convert Supabase data back to game state format
        const gameState = convertSupabaseToGameState(result.data)
        dispatch({ type: 'LOAD_GAME_STATE', payload: gameState })
        return gameState
      }
    } catch (error) {
      console.error('Failed to load from Supabase:', error)
    }
  }

  // Convert Supabase data to game state format
  const convertSupabaseToGameState = (supabaseData) => {
    const { career, tracks, albums, musicVideos, releases, concerts, socialPosts, collaborations, notifications } = supabaseData

    return {
      player: {
        stageName: career.stage_name,
        avatar: career.avatar,
        city: career.city,
        age: career.age,
        year: career.year,
        week: career.week,
        month: career.month,
        fame: career.fame,
        reputation: career.reputation,
        fans: career.fans,
        netWorth: career.net_worth,
        energy: career.energy,
        careerLevel: { id: career.career_level_id },
        lastReleaseWeek: career.last_release_week,
        totalReleases: career.total_releases,
        consistencyScore: career.consistency_score,
        skills: {
          lyrics: career.skill_lyrics,
          flow: career.skill_flow,
          charisma: career.skill_charisma,
          business: career.skill_business,
          production: career.skill_production
        },
        socialMedia: {
          rapgram: {
            followers: career.rapgram_followers,
            posts: career.rapgram_posts
          },
          raptube: {
            subscribers: career.raptube_subscribers,
            videos: career.raptube_videos,
            totalViews: career.raptube_total_views
          },
          rapify: {
            listeners: career.rapify_listeners,
            streams: career.rapify_streams
          },
          riktok: {
            followers: career.riktok_followers,
            videos: career.riktok_videos
          }
        }
      },
      tracks: tracks.map(track => ({
        id: track.id,
        title: track.title,
        lyrics: track.lyrics_by,
        producer: track.producer,
        director: track.director,
        studio: track.studio,
        quality: track.quality,
        released: track.released,
        inAlbum: track.in_album,
        hasVideo: track.has_video,
        releaseId: track.release_id,
        createdAt: `W${track.created_week}/${track.created_year}`
      })),
      albums: albums.map(album => ({
        id: album.id,
        title: album.title,
        tracks: album.track_ids,
        quality: album.quality,
        released: album.released,
        releaseId: album.release_id,
        createdAt: `W${album.created_week}/${album.created_year}`
      })),
      musicVideos: musicVideos.map(video => ({
        id: video.id,
        title: video.title,
        trackId: video.track_id,
        trackTitle: video.track_title,
        producer: video.producer,
        director: video.director,
        studio: video.studio,
        quality: video.quality,
        released: video.released,
        releaseId: video.release_id,
        createdAt: `W${video.created_week}/${video.created_year}`
      })),
      releases: releases.map(release => ({
        id: release.id,
        contentId: release.content_id,
        type: release.content_type,
        title: release.title,
        qualityRating: release.quality_rating,
        platforms: release.platform,
        views: release.views,
        streams: release.streams,
        albumSales: release.album_sales,
        earnings: release.earnings,
        dailyViews: release.daily_views,
        weeklyViews: release.weekly_views,
        monthlyViews: release.monthly_views,
        peakWeeklyViews: release.peak_weekly_views,
        trending: release.trending,
        isViral: release.is_viral,
        announced: release.announced,
        chartPosition: release.chart_position,
        releaseWeek: release.release_week,
        releaseYear: release.release_year,
        releaseDate: release.release_date,
        ageMultiplier: release.age_multiplier,
        careerLevel: release.career_level
      })),
      concerts: concerts.map(concert => ({
        id: concert.id,
        venue: concert.venue,
        capacity: concert.capacity,
        attendance: concert.attendance,
        earnings: concert.earnings,
        performanceQuality: concert.performance_quality,
        soldOut: concert.sold_out,
        date: concert.concert_date
      })),
      socialPosts: socialPosts.map(post => ({
        id: post.id,
        platform: post.platform,
        content: post.content,
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
        isViral: post.is_viral,
        isAnnouncement: post.is_announcement,
        contentId: post.content_id,
        createdAt: `W${post.post_week}/${post.post_year}`
      })),
      collaborations: collaborations.map(collab => ({
        id: collab.id,
        title: collab.title,
        artist: collab.artist_name,
        artistAvatar: collab.artist_avatar,
        quality: collab.quality,
        cost: collab.cost,
        released: collab.released,
        releaseId: collab.release_id,
        createdAt: `W${collab.created_week}/${collab.created_year}`
      })),
      notifications: notifications.map(notif => ({
        id: notif.id,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        shown: notif.shown,
        read: notif.read,
        timestamp: notif.created_at
      })),
      earnings: {
        total: career.total_earnings,
        thisWeek: career.week_earnings,
        streaming: career.streaming_earnings,
        youtube: career.youtube_earnings,
        concerts: career.concert_earnings,
        albumSales: career.album_sales_earnings
      },
      careerStats: {
        totalStreams: career.total_streams,
        totalAlbumSales: career.total_album_sales
      },
      gameStarted: career.game_started,
      currentCareerId: career.id,
      lastPlayed: career.last_played
    }
  }

  // Sync game state changes to Supabase
  useEffect(() => {
    if (state.gameStarted && user) {
      saveToSupabase(state)
    }
  }, [state, user])

  // Setup real-time subscriptions
  useEffect(() => {
    if (!user || !state.currentCareerId) return

    // Subscribe to career changes
    const careerSubscription = careerService.subscribeToCareer(
      state.currentCareerId,
      (payload) => {
        console.log('Career updated:', payload)
        // Handle real-time career updates
      }
    )

    // Subscribe to notifications
    const notificationSubscription = careerService.subscribeToNotifications(
      state.currentCareerId,
      (payload) => {
        console.log('New notification:', payload)
        // Handle real-time notifications
        if (payload.eventType === 'INSERT') {
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: payload.new.id,
              type: payload.new.type,
              title: payload.new.title,
              message: payload.new.message,
              timestamp: payload.new.created_at
            }
          })
        }
      }
    )

    return () => {
      careerSubscription?.unsubscribe()
      notificationSubscription?.unsubscribe()
    }
  }, [user, state.currentCareerId])

  return {
    saveToSupabase,
    loadFromSupabase,
    lastSync: lastSyncRef.current
  }
}