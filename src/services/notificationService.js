import { supabase } from '../lib/supabase'

class NotificationService {
  // Create notification
  async createNotification(careerId, notificationData) {
    try {
      const { data, error } = await supabase
        .from('notifications_rm2024')
        .insert([{
          career_id: careerId,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Create notification error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get notifications
  async getNotifications(careerId, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('notifications_rm2024')
        .select('*')
        .eq('career_id', careerId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get notifications error:', error)
      return { success: false, error: error.message }
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications_rm2024')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Mark notification as read error:', error)
      return { success: false, error: error.message }
    }
  }

  // Clear all notifications
  async clearAllNotifications(careerId) {
    try {
      const { error } = await supabase
        .from('notifications_rm2024')
        .delete()
        .eq('career_id', careerId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Clear notifications error:', error)
      return { success: false, error: error.message }
    }
  }
}

export const notificationService = new NotificationService()
export default notificationService