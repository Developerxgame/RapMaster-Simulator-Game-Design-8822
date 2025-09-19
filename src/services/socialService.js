import { supabase } from '../lib/supabase'

class SocialService {
  // Create social post
  async createSocialPost(careerId, postData) {
    try {
      const { data, error } = await supabase
        .from('social_posts_rm2024')
        .insert([{
          career_id: careerId,
          platform: postData.platform,
          content: postData.content,
          likes: postData.likes || 0,
          comments: postData.comments || 0,
          shares: postData.shares || 0,
          is_viral: postData.isViral || false,
          is_announcement: postData.isAnnouncement || false,
          content_id: postData.contentId,
          post_week: postData.createdAt?.split('/')[0]?.replace('W', ''),
          post_year: postData.createdAt?.split('/')[1]
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Create social post error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get social posts for a platform
  async getSocialPosts(careerId, platform, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('social_posts_rm2024')
        .select('*')
        .eq('career_id', careerId)
        .eq('platform', platform)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get social posts error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get viral posts
  async getViralPosts(careerId) {
    try {
      const { data, error } = await supabase
        .from('social_posts_rm2024')
        .select('*')
        .eq('career_id', careerId)
        .eq('is_viral', true)
        .order('likes', { ascending: false })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get viral posts error:', error)
      return { success: false, error: error.message }
    }
  }
}

export const socialService = new SocialService()
export default socialService