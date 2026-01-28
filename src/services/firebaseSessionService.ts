/**
 * Firebase Session Storage Service
 * 
 * Handles all Firebase Firestore operations for:
 * - User sessions
 * - Answer storage
 * - Progress tracking
 * - Analytics data
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { AnswerAnalysis } from './openAIAnalysisService'
import type { TranscriptionResult } from './speechToTextService'

// ==========================================
// TypeScript Interfaces
// ==========================================

export interface SessionData {
  id: string
  userId: string
  sessionType: 'ielts' | 'interview' | 'practice'
  interviewType?: 'hr' | 'technical' | 'aptitude' | 'mixed'
  practiceType?: 'speaking' | 'reading' | 'writing' | 'voice' // For Let's Communicate sessions
  difficulty?: string // For sessions with difficulty levels
  status: 'in-progress' | 'completed' | 'abandoned'
  startTime: Date
  endTime?: Date
  totalDuration: number // in seconds
  questions: SessionQuestion[]
  metadata?: {
    userAgent?: string
    platform?: string
    deviceType?: string
  }
}

export interface SessionQuestion {
  questionId: string
  questionText: string
  questionType: string
  difficulty: string
  answer?: {
    transcript: string
    transcriptionConfidence: number
    audioDuration: number
    wordCount: number
  }
  analysis?: AnswerAnalysis
  timestamp: Date
}

export interface UserProgress {
  userId: string
  totalSessions: number
  completedSessions: number
  totalPracticeTime: number // in minutes
  averageScore: number
  lastSessionDate: Date
  sessionsByType: {
    ielts: number
    interview: number
    practice: number
  }
  skillBreakdown: {
    clarity: number
    relevance: number
    structure: number
    completeness: number
    confidence: number
  }
  streakDays: number
  bestScore: number
  totalQuestions: number
  updatedAt: Date
}

export interface SessionResults {
  sessionId: string
  totalQuestions: number
  completedQuestions: number
  averageScore: number
  totalDuration: number
  analyses: AnswerAnalysis[]
  sessionType: string
  createdAt: Date
}

// ==========================================
// Firebase Session Storage Service Class
// ==========================================

class FirebaseSessionService {
  // Collection references
  private readonly SESSIONS_COLLECTION = 'sessions'
  private readonly USER_PROGRESS_COLLECTION = 'userProgress'
  private readonly ANSWERS_COLLECTION = 'answers'

  /**
   * Create a new practice session
   * @param userId - User ID
   * @param sessionType - Type of session (ielts, interview, practice)
   * @param interviewType - Interview type (if applicable)
   * @param practiceType - Practice type for Let's Communicate (speaking, reading, writing)
   * @returns Promise<string> - Session ID
   */
  async createSession(
    userId: string,
    sessionType: 'ielts' | 'interview' | 'practice',
    interviewType?: 'hr' | 'technical' | 'aptitude' | 'mixed',
    practiceType?: 'speaking' | 'reading' | 'writing' | 'voice'
  ): Promise<string> {
    try {
      // Check if user has available seats
      const userRef = doc(db, 'users', userId)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const userData = userSnap.data()
        const seats = userData.seats

        if (seats && seats.available <= 0) {
          throw new Error('No seats available. Please contact admin to purchase more seats.')
        }

        // Decrement available seats atomically
        if (seats) {
          await updateDoc(userRef, {
            'seats.available': increment(-1),
            'seats.allocated': increment(1)
          })
          console.log(`💺 Seat consumed. Remaining: ${seats.available - 1}`)
        }
      }

      const sessionId = `session_${Date.now()}_${userId.substring(0, 8)}`

      const sessionData: Partial<SessionData> = {
        id: sessionId,
        userId,
        sessionType,
        ...(interviewType && { interviewType }), // Only include if defined
        ...(practiceType && { practiceType }), // Include practice type if defined
        status: 'in-progress',
        startTime: new Date(),
        totalDuration: 0,
        questions: [],
        metadata: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          deviceType: this.getDeviceType()
        }
      }

      const sessionRef = doc(db, this.SESSIONS_COLLECTION, sessionId)
      await setDoc(sessionRef, {
        ...sessionData,
        startTime: serverTimestamp(),
        createdAt: serverTimestamp()
      })

      console.log('✅ Session created:', sessionId)
      return sessionId

    } catch (error) {
      console.error('❌ Failed to create session:', error)
      if (error instanceof Error && error.message.includes('No seats available')) {
        throw error // Re-throw seat error as-is
      }
      throw new Error('Failed to create practice session')
    }
  }

  /**
   * Save answer and analysis for a question
   * @param sessionId - Session ID
   * @param questionData - Question and answer data
   * @returns Promise<void>
   */
  async saveAnswer(
    sessionId: string,
    questionData: {
      questionId: string
      questionText: string
      questionType: string
      difficulty: string
      transcription: TranscriptionResult
      analysis: AnswerAnalysis
      audioDuration: number
    }
  ): Promise<void> {
    try {
      const sessionRef = doc(db, this.SESSIONS_COLLECTION, sessionId)
      const sessionSnap = await getDoc(sessionRef)

      if (!sessionSnap.exists()) {
        throw new Error('Session not found')
      }

      const session = sessionSnap.data() as SessionData
      const newQuestion: SessionQuestion = {
        questionId: questionData.questionId,
        questionText: questionData.questionText,
        questionType: questionData.questionType,
        difficulty: questionData.difficulty,
        answer: {
          transcript: questionData.transcription.transcript,
          transcriptionConfidence: questionData.transcription.confidence,
          audioDuration: questionData.audioDuration,
          wordCount: questionData.transcription.wordCount || 0
        },
        analysis: questionData.analysis,
        timestamp: new Date()
      }

      // Update session with new question
      await updateDoc(sessionRef, {
        questions: [...(session.questions || []), newQuestion],
        updatedAt: serverTimestamp()
      })

      // Also save to answers collection for quick retrieval
      const answerId = `${sessionId}_${questionData.questionId}`
      const answerRef = doc(db, this.ANSWERS_COLLECTION, answerId)
      await setDoc(answerRef, {
        ...newQuestion,
        sessionId,
        userId: session.userId,
        createdAt: serverTimestamp()
      })

      console.log('✅ Answer saved:', answerId)

    } catch (error) {
      console.error('❌ Failed to save answer:', error)
      throw new Error('Failed to save answer data')
    }
  }

  /**
   * Complete a session and calculate final statistics
   * @param sessionId - Session ID
   * @param results - Session results summary
   * @returns Promise<void>
   */
  async completeSession(
    sessionId: string,
    results: Omit<SessionResults, 'sessionId' | 'createdAt'>
  ): Promise<void> {
    try {
      const sessionRef = doc(db, this.SESSIONS_COLLECTION, sessionId)
      const sessionSnap = await getDoc(sessionRef)

      if (!sessionSnap.exists()) {
        throw new Error('Session not found')
      }

      const session = sessionSnap.data() as SessionData

      // Update session status and statistics
      await updateDoc(sessionRef, {
        status: 'completed',
        endTime: serverTimestamp(),
        totalDuration: results.totalDuration,
        completedQuestions: results.completedQuestions,
        averageScore: results.averageScore,
        updatedAt: serverTimestamp()
      })

      // Update user progress
      await this.updateUserProgress(session.userId, session, results)

      console.log('✅ Session completed:', sessionId)

    } catch (error) {
      console.error('❌ Failed to complete session:', error)
      throw new Error('Failed to complete session')
    }
  }

  /**
   * Update user progress statistics
   * @param userId - User ID
   * @param session - Session data
   * @param results - Session results
   * @returns Promise<void>
   */
  private async updateUserProgress(
    userId: string,
    session: SessionData,
    results: Omit<SessionResults, 'sessionId' | 'createdAt'>
  ): Promise<void> {
    try {
      const progressRef = doc(db, this.USER_PROGRESS_COLLECTION, userId)
      const progressSnap = await getDoc(progressRef)

      if (!progressSnap.exists()) {
        // Create new progress document
        const initialProgress: Partial<UserProgress> = {
          userId,
          totalSessions: 1,
          completedSessions: 1,
          totalPracticeTime: Math.round(results.totalDuration / 60),
          averageScore: results.averageScore,
          lastSessionDate: new Date(),
          sessionsByType: {
            ielts: session.sessionType === 'ielts' ? 1 : 0,
            interview: session.sessionType === 'interview' ? 1 : 0,
            practice: session.sessionType === 'practice' ? 1 : 0
          },
          skillBreakdown: this.calculateSkillBreakdown(results.analyses),
          streakDays: 1,
          bestScore: results.averageScore,
          totalQuestions: results.completedQuestions,
          updatedAt: new Date()
        }

        await setDoc(progressRef, {
          ...initialProgress,
          lastSessionDate: serverTimestamp(),
          updatedAt: serverTimestamp()
        })

      } else {
        // Update existing progress
        const currentProgress = progressSnap.data() as UserProgress
        const newAverage = this.calculateNewAverage(
          currentProgress.averageScore,
          currentProgress.completedSessions,
          results.averageScore
        )

        const skillBreakdown = this.mergeSkillBreakdown(
          currentProgress.skillBreakdown,
          this.calculateSkillBreakdown(results.analyses),
          currentProgress.completedSessions
        )

        const updateData = {
          totalSessions: increment(1),
          completedSessions: increment(1),
          totalPracticeTime: increment(Math.round(results.totalDuration / 60)),
          averageScore: newAverage,
          lastSessionDate: serverTimestamp(),
          [`sessionsByType.${session.sessionType}`]: increment(1),
          skillBreakdown,
          bestScore: Math.max(currentProgress.bestScore || 0, results.averageScore),
          totalQuestions: increment(results.completedQuestions),
          updatedAt: serverTimestamp()
        }

        await updateDoc(progressRef, updateData)
      }

      console.log('✅ User progress updated for:', userId)

    } catch (error) {
      console.error('❌ Failed to update user progress:', error)
      // Don't throw - progress update is not critical
    }
  }

  /**
   * Calculate skill breakdown from analyses
   * @param analyses - Array of answer analyses
   * @returns Skill breakdown object
   */
  private calculateSkillBreakdown(analyses: AnswerAnalysis[]): UserProgress['skillBreakdown'] {
    if (analyses.length === 0) {
      return {
        clarity: 0,
        relevance: 0,
        structure: 0,
        completeness: 0,
        confidence: 0
      }
    }

    const totals = analyses.reduce(
      (acc, analysis) => ({
        clarity: acc.clarity + (analysis.scores.clarity || 0),
        relevance: acc.relevance + (analysis.scores.relevance || 0),
        structure: acc.structure + (analysis.scores.structure || 0),
        completeness: acc.completeness + (analysis.scores.completeness || 0),
        confidence: acc.confidence + (analysis.scores.confidence || 0)
      }),
      { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 }
    )

    return {
      clarity: Math.round(totals.clarity / analyses.length),
      relevance: Math.round(totals.relevance / analyses.length),
      structure: Math.round(totals.structure / analyses.length),
      completeness: Math.round(totals.completeness / analyses.length),
      confidence: Math.round(totals.confidence / analyses.length)
    }
  }

  /**
   * Merge skill breakdowns with weighted average
   * @param current - Current skill breakdown
   * @param newSkills - New skill breakdown
   * @param currentSessionCount - Number of previous sessions
   * @returns Merged skill breakdown
   */
  private mergeSkillBreakdown(
    current: UserProgress['skillBreakdown'],
    newSkills: UserProgress['skillBreakdown'],
    currentSessionCount: number
  ): UserProgress['skillBreakdown'] {
    const weight = currentSessionCount / (currentSessionCount + 1)
    const newWeight = 1 / (currentSessionCount + 1)

    return {
      clarity: Math.round(current.clarity * weight + newSkills.clarity * newWeight),
      relevance: Math.round(current.relevance * weight + newSkills.relevance * newWeight),
      structure: Math.round(current.structure * weight + newSkills.structure * newWeight),
      completeness: Math.round(current.completeness * weight + newSkills.completeness * newWeight),
      confidence: Math.round(current.confidence * weight + newSkills.confidence * newWeight)
    }
  }

  /**
   * Calculate new weighted average score
   * @param currentAverage - Current average score
   * @param sessionCount - Number of sessions
   * @param newScore - New session score
   * @returns New average
   */
  private calculateNewAverage(
    currentAverage: number,
    sessionCount: number,
    newScore: number
  ): number {
    return Math.round(
      (currentAverage * sessionCount + newScore) / (sessionCount + 1)
    )
  }

  /**
   * Get user progress data
   * @param userId - User ID
   * @returns Promise<UserProgress | null>
   */
  async getUserProgress(userId: string): Promise<UserProgress | null> {
    try {
      const progressRef = doc(db, this.USER_PROGRESS_COLLECTION, userId)
      const progressSnap = await getDoc(progressRef)

      if (!progressSnap.exists()) {
        return null
      }

      const data = progressSnap.data()
      return {
        ...data,
        lastSessionDate: data.lastSessionDate?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as UserProgress

    } catch (error) {
      console.error('❌ Failed to get user progress:', error)
      return null
    }
  }

  /**
   * Get recent sessions for a user
   * @param userId - User ID
   * @param limitCount - Number of sessions to retrieve
   * @returns Promise<SessionData[]>
   */
  async getRecentSessions(userId: string, limitCount: number = 10): Promise<SessionData[]> {
    try {
      const sessionsRef = collection(db, this.SESSIONS_COLLECTION)
      const q = query(
        sessionsRef,
        where('userId', '==', userId),
        orderBy('startTime', 'desc'),
        limit(limitCount)
      )

      const querySnapshot = await getDocs(q)
      const sessions: SessionData[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        sessions.push({
          ...data,
          startTime: data.startTime?.toDate() || new Date(),
          endTime: data.endTime?.toDate(),
          questions: data.questions?.map((q: any) => ({
            ...q,
            timestamp: q.timestamp?.toDate() || new Date()
          })) || []
        } as SessionData)
      })

      return sessions

    } catch (error) {
      console.error('❌ Failed to get recent sessions:', error)
      return []
    }
  }

  /**
   * Get specific session data
   * @param sessionId - Session ID
   * @returns Promise<SessionData | null>
   */
  async getSession(sessionId: string): Promise<SessionData | null> {
    try {
      const sessionRef = doc(db, this.SESSIONS_COLLECTION, sessionId)
      const sessionSnap = await getDoc(sessionRef)

      if (!sessionSnap.exists()) {
        return null
      }

      const data = sessionSnap.data()
      return {
        ...data,
        startTime: data.startTime?.toDate() || new Date(),
        endTime: data.endTime?.toDate(),
        questions: data.questions?.map((q: any) => ({
          ...q,
          timestamp: q.timestamp?.toDate() || new Date()
        })) || []
      } as SessionData

    } catch (error) {
      console.error('❌ Failed to get session:', error)
      return null
    }
  }

  /**
   * Get device type from user agent
   * @returns string
   */
  private getDeviceType(): string {
    const ua = navigator.userAgent
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet'
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile'
    }
    return 'desktop'
  }
}

// Export singleton instance
export const firebaseSessionService = new FirebaseSessionService()
export default firebaseSessionService
