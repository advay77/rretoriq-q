import {
  collection,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface SessionLimits {
  // Mock Interview limits
  techInterview: { used: number; limit: number }
  hrInterview: { used: number; limit: number }
  aptitudeInterview: { used: number; limit: number }

  // Let's Communicate limits
  speaking: { used: number; limit: number }
  reading: { used: number; limit: number }
  writing: { used: number; limit: number }
  voice: { used: number; limit: number }
}

export interface SessionTypeConfig {
  monthlyLimit: number
  maxQuestionsPerSession?: number
}

// Define monthly limits for each session type
export const SESSION_LIMITS: Record<string, SessionTypeConfig> = {
  // Mock Interview
  'interview-tech': { monthlyLimit: 4 },
  'interview-hr': { monthlyLimit: 4 },
  'interview-aptitude': { monthlyLimit: 4 },

  // Let's Communicate
  'practice-speaking': { monthlyLimit: 4 },
  'practice-reading': { monthlyLimit: 4, maxQuestionsPerSession: 3 },
  'practice-writing': { monthlyLimit: 2, maxQuestionsPerSession: 2 },
  'practice-voice': { monthlyLimit: 4 }
}

class SessionLimitService {
  /**
   * Get the start and end of the current month
   */
  private getCurrentMonthRange(): { start: Date; end: Date } {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    return { start, end }
  }

  /**
   * Get all session usage for the current month
   */
  async getMonthlyUsage(userId: string): Promise<SessionLimits> {
    try {
      const { start, end } = this.getCurrentMonthRange()

      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('userId', '==', userId),
        where('startTime', '>=', Timestamp.fromDate(start)),
        where('startTime', '<=', Timestamp.fromDate(end))
      )

      const snapshot = await getDocs(sessionsQuery)
      const sessions = snapshot.docs.map(doc => doc.data())

      // Count sessions by type
      const techInterviewCount = sessions.filter((s: any) =>
        s.status === 'completed' && s.sessionType === 'interview' && s.difficulty === 'technical'
      ).length

      const hrInterviewCount = sessions.filter((s: any) =>
        s.status === 'completed' && s.sessionType === 'interview' && s.difficulty === 'hr'
      ).length

      const aptitudeInterviewCount = sessions.filter((s: any) =>
        s.status === 'completed' && s.sessionType === 'interview' && s.difficulty === 'aptitude'
      ).length

      const speakingCount = sessions.filter((s: any) =>
        s.status === 'completed' && (s.sessionType === 'practice' || s.sessionType === 'ielts') && s.practiceType === 'speaking'
      ).length

      const readingCount = sessions.filter((s: any) =>
        s.status === 'completed' && (s.sessionType === 'practice' || s.sessionType === 'ielts') && s.practiceType === 'reading'
      ).length

      const writingCount = sessions.filter((s: any) =>
        s.status === 'completed' && (s.sessionType === 'practice' || s.sessionType === 'ielts') && s.practiceType === 'writing'
      ).length

      const voiceCount = sessions.filter((s: any) =>
        s.status === 'completed' && (s.sessionType === 'practice' || s.sessionType === 'ielts') && s.practiceType === 'voice'
      ).length

      return {
        techInterview: { used: techInterviewCount, limit: 4 },
        hrInterview: { used: hrInterviewCount, limit: 4 },
        aptitudeInterview: { used: aptitudeInterviewCount, limit: 4 },
        speaking: { used: speakingCount, limit: 4 },
        reading: { used: readingCount, limit: 4 },
        writing: { used: writingCount, limit: 2 },
        voice: { used: voiceCount, limit: 4 }
      }
    } catch (error) {
      console.error('Error fetching monthly usage:', error)
      return {
        techInterview: { used: 0, limit: 4 },
        hrInterview: { used: 0, limit: 4 },
        aptitudeInterview: { used: 0, limit: 4 },
        speaking: { used: 0, limit: 4 },
        reading: { used: 0, limit: 4 },
        writing: { used: 0, limit: 2 },
        voice: { used: 0, limit: 4 }
      }
    }
  }

  /**
   * Check if user can start a new session of given type
   */
  async canStartSession(userId: string, sessionType: 'interview' | 'practice' | 'ielts', practiceType?: string, difficulty?: string): Promise<{ allowed: boolean; reason?: string; remaining?: number }> {
    try {
      const usage = await this.getMonthlyUsage(userId)

      // Check interview sessions
      if (sessionType === 'interview') {
        if (difficulty === 'technical') {
          if (usage.techInterview.used >= usage.techInterview.limit) {
            return {
              allowed: false,
              reason: `You've reached your monthly limit of ${usage.techInterview.limit} Technical Interview sessions. Limit resets next month.`,
              remaining: 0
            }
          }
          return { allowed: true, remaining: usage.techInterview.limit - usage.techInterview.used }
        }

        if (difficulty === 'hr') {
          if (usage.hrInterview.used >= usage.hrInterview.limit) {
            return {
              allowed: false,
              reason: `You've reached your monthly limit of ${usage.hrInterview.limit} HR Interview sessions. Limit resets next month.`,
              remaining: 0
            }
          }
          return { allowed: true, remaining: usage.hrInterview.limit - usage.hrInterview.used }
        }

        if (difficulty === 'aptitude') {
          if (usage.aptitudeInterview.used >= usage.aptitudeInterview.limit) {
            return {
              allowed: false,
              reason: `You've reached your monthly limit of ${usage.aptitudeInterview.limit} Aptitude Interview sessions. Limit resets next month.`,
              remaining: 0
            }
          }
          return { allowed: true, remaining: usage.aptitudeInterview.limit - usage.aptitudeInterview.used }
        }
      }

      // Check practice sessions (Let's Communicate)
      if (sessionType === 'practice' || sessionType === 'ielts') {
        if (practiceType === 'speaking') {
          if (usage.speaking.used >= usage.speaking.limit) {
            return {
              allowed: false,
              reason: `You've reached your monthly limit of ${usage.speaking.limit} Speaking sessions. Limit resets next month.`,
              remaining: 0
            }
          }
          return { allowed: true, remaining: usage.speaking.limit - usage.speaking.used }
        }

        if (practiceType === 'reading') {
          if (usage.reading.used >= usage.reading.limit) {
            return {
              allowed: false,
              reason: `You've reached your monthly limit of ${usage.reading.limit} Reading sessions. Limit resets next month.`,
              remaining: 0
            }
          }
          return { allowed: true, remaining: usage.reading.limit - usage.reading.used }
        }

        if (practiceType === 'writing') {
          if (usage.writing.used >= usage.writing.limit) {
            return {
              allowed: false,
              reason: `You've reached your monthly limit of ${usage.writing.limit} Writing sessions. Limit resets next month.`,
              remaining: 0
            }
          }
          return { allowed: true, remaining: usage.writing.limit - usage.writing.used }
        }

        if (practiceType === 'voice') {
          if (usage.voice.used >= usage.voice.limit) {
            return {
              allowed: false,
              reason: `You've reached your monthly limit of ${usage.voice.limit} Voice sessions. Limit resets next month.`,
              remaining: 0
            }
          }
          return { allowed: true, remaining: usage.voice.limit - usage.voice.used }
        }
      }

      // Default allow if type not recognized
      return { allowed: true }
    } catch (error) {
      console.error('Error checking session limits:', error)
      // Allow on error to not block users
      return { allowed: true }
    }
  }

  /**
   * Get max questions allowed for a session type
   */
  getMaxQuestionsForSession(practiceType: string): number {
    if (practiceType === 'reading') return 3
    if (practiceType === 'writing') return 2
    return 10 // Default for speaking and other types
  }

  /**
   * Format remaining sessions text
   */
  formatRemainingText(used: number, limit: number): string {
    const remaining = limit - used
    if (remaining <= 0) return 'Limit reached'
    if (remaining === 1) return '1 session left'
    return `${remaining} sessions left`
  }
}

export const sessionLimitService = new SessionLimitService()
export default sessionLimitService
