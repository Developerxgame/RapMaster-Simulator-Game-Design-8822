import { supabase } from '../lib/supabase'

class ContentService {
  // Create track
  async createTrack(careerId, trackData) {
    try {
      const { data, error } = await supabase
        .from('tracks_rm2024')
        .insert([{
          career_id: careerId,
          title: trackData.title,
          lyrics_by: trackData.lyrics,
          producer: trackData.producer,
          director: trackData.director,
          studio: trackData.studio,
          quality: trackData.quality,
          created_week: trackData.createdAt?.split('/')[0]?.replace('W', ''),
          created_year: trackData.createdAt?.split('/')[1]
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Create track error:', error)
      return { success: false, error: error.message }
    }
  }

  // Create album
  async createAlbum(careerId, albumData) {
    try {
      const { data, error } = await supabase
        .from('albums_rm2024')
        .insert([{
          career_id: careerId,
          title: albumData.title,
          track_ids: albumData.tracks,
          quality: albumData.quality,
          created_week: albumData.createdAt?.split('/')[0]?.replace('W', ''),
          created_year: albumData.createdAt?.split('/')[1]
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Create album error:', error)
      return { success: false, error: error.message }
    }
  }

  // Create music video
  async createMusicVideo(careerId, videoData) {
    try {
      const { data, error } = await supabase
        .from('music_videos_rm2024')
        .insert([{
          career_id: careerId,
          title: videoData.title,
          track_id: videoData.trackId,
          track_title: videoData.trackTitle,
          producer: videoData.producer,
          director: videoData.director,
          studio: videoData.studio,
          quality: videoData.quality,
          created_week: videoData.createdAt?.split('/')[0]?.replace('W', ''),
          created_year: videoData.createdAt?.split('/')[1]
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Create music video error:', error)
      return { success: false, error: error.message }
    }
  }

  // Release content
  async releaseContent(careerId, releaseData) {
    try {
      const { data, error } = await supabase
        .from('releases_rm2024')
        .insert([{
          career_id: careerId,
          content_id: releaseData.contentId,
          content_type: releaseData.type,
          title: releaseData.title,
          quality_rating: releaseData.quality,
          platform: releaseData.platform === 'RapTube' ? ['raptube'] : ['rapify'],
          views: releaseData.views || 0,
          streams: releaseData.streams || 0,
          album_sales: releaseData.albumSales || 0,
          earnings: releaseData.earnings || 0,
          daily_views: releaseData.dailyViews || 0,
          weekly_views: releaseData.weeklyViews || 0,
          monthly_views: releaseData.monthlyViews || 0,
          peak_weekly_views: releaseData.peakWeeklyViews || 0,
          trending: releaseData.trending || false,
          is_viral: releaseData.isViral || false,
          announced: releaseData.announced || false,
          chart_position: releaseData.chartPosition,
          release_week: releaseData.releaseWeek,
          release_year: releaseData.releaseYear,
          release_date: releaseData.releaseDate,
          age_multiplier: releaseData.ageMultiplier || 1.0,
          career_level: releaseData.careerLevel
        }])
        .select()
        .single()

      if (error) throw error

      // Update the original content as released
      if (releaseData.type === 'track') {
        await supabase
          .from('tracks_rm2024')
          .update({ released: true, release_id: data.id })
          .eq('id', releaseData.contentId)
      } else if (releaseData.type === 'album') {
        await supabase
          .from('albums_rm2024')
          .update({ released: true, release_id: data.id })
          .eq('id', releaseData.contentId)
      } else if (releaseData.type === 'video') {
        await supabase
          .from('music_videos_rm2024')
          .update({ released: true, release_id: data.id })
          .eq('id', releaseData.contentId)
      }

      return { success: true, data }
    } catch (error) {
      console.error('Release content error:', error)
      return { success: false, error: error.message }
    }
  }

  // Update release performance
  async updateReleasePerformance(releaseId, performanceData) {
    try {
      const { data, error } = await supabase
        .from('releases_rm2024')
        .update({
          views: performanceData.views,
          streams: performanceData.streams,
          earnings: performanceData.earnings,
          daily_views: performanceData.dailyViews,
          weekly_views: performanceData.weeklyViews,
          monthly_views: performanceData.monthlyViews,
          peak_weekly_views: performanceData.peakWeeklyViews,
          trending: performanceData.trending,
          is_viral: performanceData.isViral,
          chart_position: performanceData.chartPosition,
          age_multiplier: performanceData.ageMultiplier,
          updated_at: new Date().toISOString()
        })
        .eq('id', releaseId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Update release performance error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get top performing releases
  async getTopReleases(careerId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('releases_rm2024')
        .select('*')
        .eq('career_id', careerId)
        .order('views', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get top releases error:', error)
      return { success: false, error: error.message }
    }
  }

  // Create collaboration
  async createCollaboration(careerId, collabData) {
    try {
      const { data, error } = await supabase
        .from('collaborations_rm2024')
        .insert([{
          career_id: careerId,
          title: collabData.title,
          artist_name: collabData.artist,
          artist_avatar: collabData.artistAvatar,
          quality: collabData.quality,
          cost: collabData.cost,
          created_week: collabData.createdAt?.split('/')[0]?.replace('W', ''),
          created_year: collabData.createdAt?.split('/')[1]
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Create collaboration error:', error)
      return { success: false, error: error.message }
    }
  }
}

export const contentService = new ContentService()
export default contentService