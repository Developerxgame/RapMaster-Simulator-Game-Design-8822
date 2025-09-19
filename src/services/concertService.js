import { supabase } from '../lib/supabase'

class ConcertService {
  // Create concert
  async createConcert(careerId, concertData) {
    try {
      const { data, error } = await supabase
        .from('concerts_rm2024')
        .insert([{
          career_id: careerId,
          venue: concertData.venue,
          capacity: concertData.capacity,
          attendance: concertData.attendance,
          earnings: concertData.earnings,
          performance_quality: concertData.performanceQuality,
          sold_out: concertData.soldOut,
          concert_date: concertData.date
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Create concert error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get concert history
  async getConcertHistory(careerId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('concerts_rm2024')
        .select('*')
        .eq('career_id', careerId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get concert history error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get concert stats
  async getConcertStats(careerId) {
    try {
      const { data, error } = await supabase
        .from('concerts_rm2024')
        .select('earnings, attendance, sold_out')
        .eq('career_id', careerId)

      if (error) throw error

      const stats = {
        totalConcerts: data.length,
        totalEarnings: data.reduce((sum, concert) => sum + (concert.earnings || 0), 0),
        totalAttendance: data.reduce((sum, concert) => sum + (concert.attendance || 0), 0),
        soldOutShows: data.filter(concert => concert.sold_out).length,
        averageAttendance: data.length > 0 ? data.reduce((sum, concert) => sum + (concert.attendance || 0), 0) / data.length : 0
      }

      return { success: true, data: stats }
    } catch (error) {
      console.error('Get concert stats error:', error)
      return { success: false, error: error.message }
    }
  }
}

export const concertService = new ConcertService()
export default concertService