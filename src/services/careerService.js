import { supabase } from '../lib/supabase'

class CareerService {
  // Get user's careers
  async getUserCareers(userId) {
    try {
      const { data, error } = await supabase
        .from('careers_rm2024')
        .select('*')
        .eq('user_id', userId)
        .order('slot', { ascending: true })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get careers error:', error)
      return { success: false, error: error.message }
    }
  }

  // Create new career
  async createCareer(userId, careerData) {
    try {
      const { data, error } = await supabase
        .from('careers_rm2024')
        .insert([{
          user_id: userId,
          slot: careerData.slot,
          stage_name: careerData.stageName,
          avatar: careerData.avatar,
          city: careerData.city,
          ...careerData
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Create career error:', error)
      return { success: false, error: error.message }
    }
  }

  // Update career
  async updateCareer(careerId, updates) {
    try {
      const { data, error } = await supabase
        .from('careers_rm2024')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', careerId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Update career error:', error)
      return { success: false, error: error.message }
    }
  }

  // Delete career
  async deleteCareer(careerId) {
    try {
      const { error } = await supabase
        .from('careers_rm2024')
        .delete()
        .eq('id', careerId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Delete career error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get career with all related data
  async getCareerWithData(careerId) {
    try {
      // Get career data
      const { data: career, error: careerError } = await supabase
        .from('careers_rm2024')
        .select('*')
        .eq('id', careerId)
        .single()

      if (careerError) throw careerError

      // Get tracks
      const { data: tracks, error: tracksError } = await supabase
        .from('tracks_rm2024')
        .select('*')
        .eq('career_id', careerId)
        .order('created_at', { ascending: false })

      if (tracksError) throw tracksError

      // Get albums
      const { data: albums, error: albumsError } = await supabase
        .from('albums_rm2024')
        .select('*')
        .eq('career_id', careerId)
        .order('created_at', { ascending: false })

      if (albumsError) throw albumsError

      // Get music videos
      const { data: musicVideos, error: videosError } = await supabase
        .from('music_videos_rm2024')
        .select('*')
        .eq('career_id', careerId)
        .order('created_at', { ascending: false })

      if (videosError) throw videosError

      // Get releases
      const { data: releases, error: releasesError } = await supabase
        .from('releases_rm2024')
        .select('*')
        .eq('career_id', careerId)
        .order('created_at', { ascending: false })

      if (releasesError) throw releasesError

      // Get concerts
      const { data: concerts, error: concertsError } = await supabase
        .from('concerts_rm2024')
        .select('*')
        .eq('career_id', careerId)
        .order('created_at', { ascending: false })

      if (concertsError) throw concertsError

      // Get social posts
      const { data: socialPosts, error: postsError } = await supabase
        .from('social_posts_rm2024')
        .select('*')
        .eq('career_id', careerId)
        .order('created_at', { ascending: false })

      if (postsError) throw postsError

      // Get collaborations
      const { data: collaborations, error: collabsError } = await supabase
        .from('collaborations_rm2024')
        .select('*')
        .eq('career_id', careerId)
        .order('created_at', { ascending: false })

      if (collabsError) throw collabsError

      // Get notifications
      const { data: notifications, error: notifError } = await supabase
        .from('notifications_rm2024')
        .select('*')
        .eq('career_id', careerId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (notifError) throw notifError

      return {
        success: true,
        data: {
          career,
          tracks: tracks || [],
          albums: albums || [],
          musicVideos: musicVideos || [],
          releases: releases || [],
          concerts: concerts || [],
          socialPosts: socialPosts || [],
          collaborations: collaborations || [],
          notifications: notifications || []
        }
      }
    } catch (error) {
      console.error('Get career with data error:', error)
      return { success: false, error: error.message }
    }
  }

  // Save complete game state
  async saveGameState(careerId, gameState) {
    try {
      // Update career
      const careerUpdate = {
        stage_name: gameState.player.stageName,
        avatar: gameState.player.avatar,
        city: gameState.player.city,
        age: gameState.player.age,
        year: gameState.player.year,
        week: gameState.player.week,
        month: gameState.player.month,
        fame: gameState.player.fame,
        reputation: gameState.player.reputation,
        fans: gameState.player.fans,
        net_worth: gameState.player.netWorth,
        energy: gameState.player.energy,
        career_level_id: gameState.player.careerLevel?.id || 1,
        last_release_week: gameState.player.lastReleaseWeek,
        total_releases: gameState.player.totalReleases,
        consistency_score: gameState.player.consistencyScore,
        
        // Skills
        skill_lyrics: gameState.player.skills.lyrics,
        skill_flow: gameState.player.skills.flow,
        skill_charisma: gameState.player.skills.charisma,
        skill_business: gameState.player.skills.business,
        skill_production: gameState.player.skills.production,
        
        // Social Media
        rapgram_followers: gameState.player.socialMedia.rapgram.followers,
        rapgram_posts: gameState.player.socialMedia.rapgram.posts,
        raptube_subscribers: gameState.player.socialMedia.raptube.subscribers,
        raptube_videos: gameState.player.socialMedia.raptube.videos,
        raptube_total_views: gameState.player.socialMedia.raptube.totalViews,
        rapify_listeners: gameState.player.socialMedia.rapify.listeners,
        rapify_streams: gameState.player.socialMedia.rapify.streams,
        riktok_followers: gameState.player.socialMedia.riktok.followers,
        riktok_videos: gameState.player.socialMedia.riktok.videos,
        
        // Earnings
        total_earnings: gameState.earnings.total,
        week_earnings: gameState.earnings.thisWeek,
        streaming_earnings: gameState.earnings.streaming,
        youtube_earnings: gameState.earnings.youtube,
        concert_earnings: gameState.earnings.concerts,
        album_sales_earnings: gameState.earnings.albumSales,
        
        // Career Stats
        total_streams: gameState.careerStats.totalStreams,
        total_album_sales: gameState.careerStats.totalAlbumSales,
        
        last_played: new Date().toISOString()
      }

      const { error: careerError } = await supabase
        .from('careers_rm2024')
        .update(careerUpdate)
        .eq('id', careerId)

      if (careerError) throw careerError

      return { success: true }
    } catch (error) {
      console.error('Save game state error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get career levels
  async getCareerLevels() {
    try {
      const { data, error } = await supabase
        .from('career_levels_rm2024')
        .select('*')
        .order('id', { ascending: true })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get career levels error:', error)
      return { success: false, error: error.message }
    }
  }

  // Subscribe to career changes
  subscribeToCareer(careerId, callback) {
    return supabase
      .channel(`career_${careerId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'careers_rm2024',
        filter: `id=eq.${careerId}`
      }, callback)
      .subscribe()
  }

  // Subscribe to notifications
  subscribeToNotifications(careerId, callback) {
    return supabase
      .channel(`notifications_${careerId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications_rm2024',
        filter: `career_id=eq.${careerId}`
      }, callback)
      .subscribe()
  }
}

export const careerService = new CareerService()
export default careerService