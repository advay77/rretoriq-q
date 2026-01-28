import {
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'
import { db } from '../lib/firebase'

interface DashboardStats {
  totalSessions: number
  averageScore: number
  totalPracticeTime: number
  achievementsCount: number
  improvementRate: number
  streakDays: number
}

interface SessionSummary {
  id: string
  type: string
  score: number
  date: string
  duration: string
}

interface WeeklyProgressData {
  name: string
  hr: number
  technical: number
  behavioral: number
}

interface SkillBreakdown {
  name: string
  value: number
}

class DashboardService {
  async getUserStats(userId: string): Promise<DashboardStats> {
    try {
      // Simplified query - filter by userId only
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('userId', '==', userId)
      )
      
      const sessionsSnapshot = await getDocs(sessionsQuery)
      const allSessions = sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime?.toDate(),
        endTime: doc.data().endTime?.toDate()
      }))

      // Filter completed sessions in memory
      const sessions = allSessions.filter((s: any) => s.status === 'completed') as any[]

      // Calculate statistics
      const totalSessions = sessions.length
      const completedSessions = sessions.filter((s: any) => s.status === 'completed')
      
      const scores = completedSessions.map((s: any) => s.averageScore || 0).filter((s: number) => s > 0)
      const averageScore = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0
      
      const totalPracticeTime = completedSessions.reduce((total: number, session: any) => {
        return total + (session.totalDuration || 0)
      }, 0)

      // Calculate improvement rate (last 5 vs first 5 sessions)
      const recentSessions = completedSessions.slice(-5)
      const oldSessions = completedSessions.slice(0, 5)
      
      const recentAvg = recentSessions.length > 0 
        ? recentSessions.reduce((sum: number, s: any) => sum + (s.averageScore || 0), 0) / recentSessions.length 
        : 0
      const oldAvg = oldSessions.length > 0 
        ? oldSessions.reduce((sum: number, s: any) => sum + (s.averageScore || 0), 0) / oldSessions.length 
        : 0
      
      const improvementRate = oldAvg > 0 ? ((recentAvg - oldAvg) / oldAvg) * 100 : 0

      // Calculate streak days (sessions in consecutive days)
      let streakDays = 0
      const today = new Date()
      const sessionDates = completedSessions
        .map((s: any) => s.startTime)
        .filter((date: any) => date)
        .sort((a: any, b: any) => b!.getTime() - a!.getTime())

      if (sessionDates.length > 0) {
        const uniqueDates = [...new Set(sessionDates.map(date => date!.toDateString()))]
        let currentDate = new Date(today)
        
        for (const dateStr of uniqueDates) {
          const sessionDate = new Date(dateStr)
          const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
          
          if (diffDays <= streakDays + 1) {
            streakDays++
            currentDate = sessionDate
          } else {
            break
          }
        }
      }

      return {
        totalSessions,
        averageScore: Math.round(averageScore * 10) / 10,
        totalPracticeTime, // Keep in seconds, will be converted to hours in display
        achievementsCount: Math.floor(totalSessions / 5) + (averageScore > 7 ? 2 : 0) + (streakDays > 3 ? 1 : 0),
        improvementRate: Math.round(improvementRate * 10) / 10,
        streakDays
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return {
        totalSessions: 0,
        averageScore: 0,
        totalPracticeTime: 0,
        achievementsCount: 0,
        improvementRate: 0,
        streakDays: 0
      }
    }
  }

  async getRecentSessions(userId: string, limitCount: number = 4): Promise<SessionSummary[]> {
    try {
      // Simplified query
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('userId', '==', userId)
      )
      
      const sessionsSnapshot = await getDocs(sessionsQuery)
      const allSessions = sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime?.toDate()
      }))

      // Filter, sort, and limit in memory
      return allSessions
        .filter((session: any) => session.status === 'completed')
        .sort((a: any, b: any) => {
          const timeA = a.startTime?.getTime() || 0
          const timeB = b.startTime?.getTime() || 0
          return timeB - timeA
        })
        .slice(0, limitCount)
        .map((data: any) => {
        const startTime = data.startTime
        const totalDuration = data.totalDuration || 0
        
        // Determine session type
        let sessionType = data.sessionType || 'interview'
        if (data.interviewType) {
          sessionType = `${data.interviewType} Interview`
        } else if (sessionType === 'ielts') {
          sessionType = 'IELTS Speaking'
        } else if (sessionType === 'interview') {
          sessionType = 'Mixed Interview'
        }

        return {
          id: data.id,
          type: sessionType,
          score: data.averageScore || 0,
          date: startTime ? startTime.toLocaleDateString() : new Date().toLocaleDateString(),
          duration: `${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s`
        }
      })
    } catch (error) {
      console.error('Error fetching recent sessions:', error)
      return []
    }
  }

  async getWeeklyProgress(userId: string): Promise<WeeklyProgressData[]> {
    try {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      // Simplified query
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('userId', '==', userId)
      )
      
      const sessionsSnapshot = await getDocs(sessionsQuery)
      const allSessions = sessionsSnapshot.docs.map(doc => ({
        ...doc.data(),
        startTime: doc.data().startTime?.toDate()
      }))

      // Filter and sort in memory
      const sessions = allSessions.filter((session: any) => {
        return session.status === 'completed' && 
               session.startTime &&
               session.startTime >= sevenDaysAgo
      }).sort((a: any, b: any) => {
        const timeA = a.startTime?.getTime() || 0
        const timeB = b.startTime?.getTime() || 0
        return timeA - timeB
      }) as any[]

      // Group sessions by day and calculate averages by type
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const weeklyData: WeeklyProgressData[] = []
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dayName = dayNames[date.getDay()]
        
        const daySessions = sessions.filter((session: any) => {
          if (!session.startTime) return false
          return session.startTime.toDateString() === date.toDateString()
        })

        // Calculate average scores by interview type for this day
        const avgScore = daySessions.length > 0
          ? daySessions.reduce((sum: number, s: any) => sum + (s.averageScore || 0), 0) / daySessions.length
          : 0

        weeklyData.push({
          name: dayName,
          hr: Math.round(avgScore * 10) / 10,
          technical: Math.round(avgScore * 10) / 10,
          behavioral: Math.round(avgScore * 10) / 10
        })
      }

      return weeklyData
    } catch (error) {
      console.error('Error fetching weekly progress:', error)
      // Return mock data as fallback
      return [
        { name: 'Mon', hr: 0, technical: 0, behavioral: 0 },
        { name: 'Tue', hr: 0, technical: 0, behavioral: 0 },
        { name: 'Wed', hr: 0, technical: 0, behavioral: 0 },
        { name: 'Thu', hr: 0, technical: 0, behavioral: 0 },
        { name: 'Fri', hr: 0, technical: 0, behavioral: 0 },
        { name: 'Sat', hr: 0, technical: 0, behavioral: 0 },
        { name: 'Sun', hr: 0, technical: 0, behavioral: 0 }
      ]
    }
  }

  async getSkillsBreakdown(userId: string): Promise<SkillBreakdown[]> {
    try {
      // Simplified query
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('userId', '==', userId)
      )
      
      const sessionsSnapshot = await getDocs(sessionsQuery)
      const allSessions = sessionsSnapshot.docs.map(doc => doc.data())

      // Filter completed sessions in memory
      const sessions = allSessions.filter((s: any) => s.status === 'completed')

      // If no data, return default structure
      if (sessions.length === 0) {
        return [
          { name: 'HR', value: 0 },
          { name: 'Technical', value: 0 },
          { name: 'Behavioral', value: 0 }
        ]
      }

      // Calculate average score
      const avgScore = sessions.reduce((sum: number, s: any) => sum + (s.averageScore || 0), 0) / sessions.length

      return [
        { name: 'HR', value: Math.round(avgScore * 10) / 10 },
        { name: 'Technical', value: Math.round(avgScore * 10) / 10 },
        { name: 'Behavioral', value: Math.round(avgScore * 10) / 10 }
      ]
    } catch (error) {
      console.error('Error fetching skills breakdown:', error)
      return [
        { name: 'HR', value: 0 },
        { name: 'Technical', value: 0 },
        { name: 'Behavioral', value: 0 }
      ]
    }
  }

  async getTodaysSchedule(userId: string): Promise<any[]> {
    // For now, return empty array - no scheduled sessions
    // This can be enhanced later with a scheduling system
    try {
      // Check if user has any sessions today
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      
      const todaysSessionsQuery = query(
        collection(db, 'sessions'),
        where('userId', '==', userId),
        where('startTime', '>=', startOfDay),
        where('startTime', '<', endOfDay)
      )
      
      const todaysSessionsSnapshot = await getDocs(todaysSessionsQuery)
      
      // If user already practiced today, return empty (no more suggestions)
      if (todaysSessionsSnapshot.docs.length > 0) {
        return []
      }
      
      // If no practice today, suggest based on user's practice history
      const stats = await this.getUserStats(userId)
      
      if (stats.totalSessions === 0) {
        // New user - suggest starting with IELTS or Interview practice
        return [
          {
            time: 'Anytime',
            type: 'IELTS Practice',
            topic: 'Start your first practice session'
          }
        ]
      }
      
      // Existing user - suggest continuing practice
      return [
        {
          time: 'Anytime',
          type: 'Continue Practice',
          topic: 'Keep improving your skills'
        }
      ]
    } catch (error) {
      console.error('Error generating schedule:', error)
      return []
    }
  }
}

export const dashboardService = new DashboardService()
export default dashboardService