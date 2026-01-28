import {
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'
import { db } from '../lib/firebase'

interface ProgressStats {
  overallIeltsScore: number
  interviewAverage: number
  totalPracticeHours: number
  streakDays: number
  weeklyImprovement: number
  interviewImprovement: number
  thisWeekHours: number
}

interface SessionData {
  id: string
  type: string
  date: string
  score: number
  duration: string
  improvement: string
}

interface WeeklyProgressData {
  date: string
  ielts: number
  interview: number
  sessions: number
}

interface SkillData {
  skill: string
  current: number
  target: number
  improvement: number
}

interface MonthlyData {
  month: string
  sessions: number
  avgScore: number
  timeSpent: number
}

interface RadarData {
  skill: string
  score: number
}

class ProgressService {
  async getProgressStats(userId: string): Promise<ProgressStats> {
    try {
      // Simplified query - filter by userId only, then filter completed in memory
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('userId', '==', userId)
      )
      
      const sessionsSnapshot = await getDocs(sessionsQuery)
      const allSessions = sessionsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        startTime: doc.data().startTime?.toDate(),
        endTime: doc.data().endTime?.toDate()
      }))

      // Filter completed sessions and sort by startTime in memory
      const sessions = allSessions
        .filter((s: any) => s.status === 'completed')
        .sort((a: any, b: any) => {
          const timeA = a.startTime?.getTime() || 0
          const timeB = b.startTime?.getTime() || 0
          return timeB - timeA
        })

      if (sessions.length === 0) {
        return {
          overallIeltsScore: 0,
          interviewAverage: 0,
          totalPracticeHours: 0,
          streakDays: 0,
          weeklyImprovement: 0,
          interviewImprovement: 0,
          thisWeekHours: 0
        }
      }

      // Calculate IELTS/Communication scores (including practice sessions)
      const ieltsScores = sessions
        .filter((s: any) => (s.sessionType === 'ielts' || s.sessionType === 'practice') && s.averageScore)
        .map((s: any) => s.averageScore)
      
      const overallIeltsScore = ieltsScores.length > 0 
        ? ieltsScores.reduce((a, b) => a + b, 0) / ieltsScores.length 
        : 0

      // Calculate interview scores
      const interviewScores = sessions
        .filter((s: any) => s.sessionType === 'interview' && s.averageScore)
        .map((s: any) => s.averageScore)
      
      const interviewAverage = interviewScores.length > 0 
        ? interviewScores.reduce((a, b) => a + b, 0) / interviewScores.length 
        : 0

      // Calculate total practice time
      const totalMinutes = sessions.reduce((total: number, session: any) => {
        return total + (session.totalDuration || 0)
      }, 0)
      const totalPracticeHours = totalMinutes // Keep in seconds for consistency

      // Calculate streak days
      const streakDays = this.calculateStreakDays(sessions)

      // Calculate this week's hours
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      
      const thisWeekSessions = sessions.filter((s: any) => 
        s.startTime && s.startTime > oneWeekAgo
      )
      const thisWeekMinutes = thisWeekSessions.reduce((total: number, session: any) => {
        return total + (session.totalDuration || 0)
      }, 0)
      const thisWeekHours = thisWeekMinutes // Keep in seconds for consistency

      // Calculate improvement trends
      const recentSessions = sessions.slice(0, 5)
      const olderSessions = sessions.slice(5, 10)
      
      const recentAvg = recentSessions.length > 0 
        ? recentSessions.reduce((sum: number, s: any) => sum + (s.averageScore || 0), 0) / recentSessions.length 
        : 0
      const olderAvg = olderSessions.length > 0 
        ? olderSessions.reduce((sum: number, s: any) => sum + (s.averageScore || 0), 0) / olderSessions.length 
        : 0
      
      const weeklyImprovement = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0
      const interviewImprovement = weeklyImprovement // Simplified for now

      return {
        overallIeltsScore: Math.round(overallIeltsScore * 10) / 10,
        interviewAverage: Math.round(interviewAverage),
        totalPracticeHours,
        streakDays,
        weeklyImprovement: Math.round(weeklyImprovement * 10) / 10,
        interviewImprovement: Math.round(interviewImprovement),
        thisWeekHours
      }
    } catch (error) {
      console.error('Error fetching progress stats:', error)
      return {
        overallIeltsScore: 0,
        interviewAverage: 0,
        totalPracticeHours: 0,
        streakDays: 0,
        weeklyImprovement: 0,
        interviewImprovement: 0,
        thisWeekHours: 0
      }
    }
  }

  async getRecentSessions(userId: string, limitCount: number = 10): Promise<SessionData[]> {
    try {
      // Simplified query - fetch all user sessions and filter/sort in memory
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('userId', '==', userId)
      )
      
      const sessionsSnapshot = await getDocs(sessionsQuery)
      const allSessions = sessionsSnapshot.docs.map(doc => doc.data())
      
      // Filter completed, sort by startTime, and limit in memory
      const completedSessions = allSessions
        .filter((s: any) => s.status === 'completed')
        .sort((a: any, b: any) => {
          const timeA = a.startTime?.toDate()?.getTime() || 0
          const timeB = b.startTime?.toDate()?.getTime() || 0
          return timeB - timeA
        })
        .slice(0, limitCount)
      
      return completedSessions.map((data: any, index) => {
        const startTime = data.startTime?.toDate()
        const totalDuration = data.totalDuration || 0
        
        // Calculate improvement (simplified - compare with average)
        const improvement = index < completedSessions.length - 1 
          ? `+${Math.round(Math.random() * 5 * 10) / 10}` // Placeholder calculation
          : '+0.0'

        return {
          id: data.id || `session-${index}`,
          type: data.sessionType === 'ielts' || data.sessionType === 'practice' 
            ? 'Let\'s Communicate' 
            : data.sessionType === 'interview'
            ? 'Mock Interview'
            : 'Practice Session',
          date: startTime ? startTime.toLocaleDateString() : new Date().toLocaleDateString(),
          score: data.averageScore || 0,
          duration: `${Math.floor(totalDuration / 60)}m`,
          improvement
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
      
      // Simplified query - fetch all user sessions and filter in memory
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('userId', '==', userId)
      )
      
      const sessionsSnapshot = await getDocs(sessionsQuery)
      const allSessions = sessionsSnapshot.docs.map(doc => ({
        ...doc.data(),
        startTime: doc.data().startTime?.toDate()
      }))

      // Filter by date and status in memory
      const sessions = allSessions.filter((session: any) => {
        return session.status === 'completed' && 
               session.startTime && 
               session.startTime >= sevenDaysAgo
      }).sort((a: any, b: any) => {
        const timeA = a.startTime?.getTime() || 0
        const timeB = b.startTime?.getTime() || 0
        return timeA - timeB
      })

      const weeklyData: WeeklyProgressData[] = []
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        
        const daySessions = sessions.filter((session: any) => {
          if (!session.startTime) return false
          return session.startTime.toDateString() === date.toDateString()
        })

        const ieltsScores = daySessions
          .filter((s: any) => s.sessionType === 'ielts' || s.sessionType === 'practice')
          .map((s: any) => s.averageScore || 0)
        
        const interviewScores = daySessions
          .filter((s: any) => s.sessionType === 'interview')
          .map((s: any) => s.averageScore || 0)

        const ieltsAvg = ieltsScores.length > 0 
          ? ieltsScores.reduce((a, b) => a + b, 0) / ieltsScores.length 
          : 0
        const interviewAvg = interviewScores.length > 0 
          ? interviewScores.reduce((a, b) => a + b, 0) / interviewScores.length 
          : 0

        weeklyData.push({
          date: date.toISOString().split('T')[0],
          ielts: Math.round(ieltsAvg * 10) / 10,
          interview: Math.round(interviewAvg),
          sessions: daySessions.length
        })
      }

      return weeklyData
    } catch (error) {
      console.error('Error fetching weekly progress:', error)
      return []
    }
  }

  async getSkillsBreakdown(userId: string): Promise<SkillData[]> {
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
      
      if (sessions.length === 0) {
        return [
          { skill: 'Speaking', current: 0, target: 8.0, improvement: 0 },
          { skill: 'Listening', current: 0, target: 8.0, improvement: 0 },
          { skill: 'Reading', current: 0, target: 8.0, improvement: 0 },
          { skill: 'Writing', current: 0, target: 8.0, improvement: 0 }
        ]
      }

      // For now, return basic skills analysis based on overall scores
      // This can be enhanced with more detailed feedback analysis
      const avgScore = sessions.reduce((sum: number, s: any) => sum + (s.averageScore || 0), 0) / sessions.length

      return [
        { skill: 'Speaking', current: Math.round((avgScore * 0.9) * 10) / 10, target: 8.0, improvement: 0.3 },
        { skill: 'Listening', current: Math.round((avgScore * 0.85) * 10) / 10, target: 8.0, improvement: 0.2 },
        { skill: 'Reading', current: Math.round((avgScore * 1.1) * 10) / 10, target: 8.0, improvement: 0.4 },
        { skill: 'Writing', current: Math.round((avgScore * 0.8) * 10) / 10, target: 8.0, improvement: 0.1 }
      ]
    } catch (error) {
      console.error('Error fetching skills breakdown:', error)
      return [
        { skill: 'Speaking', current: 0, target: 8.0, improvement: 0 },
        { skill: 'Listening', current: 0, target: 8.0, improvement: 0 },
        { skill: 'Reading', current: 0, target: 8.0, improvement: 0 },
        { skill: 'Writing', current: 0, target: 8.0, improvement: 0 }
      ]
    }
  }

  async getMonthlyStats(userId: string): Promise<MonthlyData[]> {
    try {
      const fourMonthsAgo = new Date()
      fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4)
      
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

      // Filter by date and status in memory
      const sessions = allSessions.filter((session: any) => {
        return session.status === 'completed' && 
               session.startTime && 
               session.startTime >= fourMonthsAgo
      }).sort((a: any, b: any) => {
        const timeA = a.startTime?.getTime() || 0
        const timeB = b.startTime?.getTime() || 0
        return timeA - timeB
      })

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthlyData: MonthlyData[] = []
      
      for (let i = 3; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthName = monthNames[date.getMonth()]
        
        const monthSessions = sessions.filter((session: any) => {
          if (!session.startTime) return false
          return session.startTime.getMonth() === date.getMonth() && 
                 session.startTime.getFullYear() === date.getFullYear()
        })

        const avgScore = monthSessions.length > 0 
          ? monthSessions.reduce((sum: number, s: any) => sum + (s.averageScore || 0), 0) / monthSessions.length 
          : 0

        const timeSpent = monthSessions.reduce((total: number, session: any) => {
          return total + (session.totalDuration || 0)
        }, 0)

        monthlyData.push({
          month: monthName,
          sessions: monthSessions.length,
          avgScore: Math.round(avgScore * 10) / 10,
          timeSpent: Math.round(timeSpent / 60) // Convert to hours
        })
      }

      return monthlyData
    } catch (error) {
      console.error('Error fetching monthly stats:', error)
      return []
    }
  }

  async getRadarData(userId: string): Promise<RadarData[]> {
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
      
      if (sessions.length === 0) {
        return [
          { skill: 'Fluency', score: 0 },
          { skill: 'Vocabulary', score: 0 },
          { skill: 'Grammar', score: 0 },
          { skill: 'Pronunciation', score: 0 },
          { skill: 'Coherence', score: 0 },
          { skill: 'Confidence', score: 0 }
        ]
      }

      // Calculate based on overall performance
      const avgScore = sessions.reduce((sum: number, s: any) => sum + (s.averageScore || 0), 0) / sessions.length
      const normalizedScore = Math.min(100, (avgScore / 9) * 100) // Convert to percentage (max score is 9.0)

      return [
        { skill: 'Fluency', score: Math.min(100, Math.round(normalizedScore * 0.9)) },
        { skill: 'Vocabulary', score: Math.min(100, Math.round(normalizedScore * 0.85)) },
        { skill: 'Grammar', score: Math.min(100, Math.round(normalizedScore * 0.95)) },
        { skill: 'Pronunciation', score: Math.min(100, Math.round(normalizedScore * 1.0)) },
        { skill: 'Coherence', score: Math.min(100, Math.round(normalizedScore * 0.88)) },
        { skill: 'Confidence', score: Math.min(100, Math.round(normalizedScore * 0.92)) }
      ]
    } catch (error) {
      console.error('Error fetching radar data:', error)
      return [
        { skill: 'Fluency', score: 0 },
        { skill: 'Vocabulary', score: 0 },
        { skill: 'Grammar', score: 0 },
        { skill: 'Pronunciation', score: 0 },
        { skill: 'Coherence', score: 0 },
        { skill: 'Confidence', score: 0 }
      ]
    }
  }

  private calculateStreakDays(sessions: any[]): number {
    if (sessions.length === 0) return 0
    
    const sessionDates = sessions
      .map(s => s.startTime)
      .filter(date => date)
      .sort((a, b) => b.getTime() - a.getTime())

    if (sessionDates.length === 0) return 0

    const uniqueDates = [...new Set(sessionDates.map(date => date.toDateString()))]
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const sessionDate = new Date(uniqueDates[i])
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === i) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }
}

export const progressService = new ProgressService()
export default progressService