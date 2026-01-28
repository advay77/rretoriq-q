import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'
import { updateProfile, updatePassword } from 'firebase/auth'
import { db, auth } from '../lib/firebase'

interface UserProfile {
  uid: string
  email: string
  firstName: string
  lastName: string
  displayName?: string
  photoURL?: string
  phone?: string
  location?: string
  dateOfBirth?: string
  occupation?: string
  company?: string
  education?: string
  languages?: string
  bio?: string
  college?: string
  institutionId?: string
  institutionName?: string
  createdAt?: Date
  updatedAt?: Date
  preferences?: {
    learningGoal: string
    practiceFrequency: string
    difficultyLevel: string
    enableVoiceFeedback: boolean
    showAnalytics: boolean
  }
  notifications?: {
    email: {
      practiceReminders: boolean
      progressReports: boolean
      newFeatures: boolean
    }
    push: {
      dailyReminder: boolean
      achievements: boolean
      sessionCompleted: boolean
    }
    reminderTime: string
  }
}

interface UserStats {
  totalSessions: number
  averageScore: number
  totalPracticeTime: number // in minutes
  memberSince: Date
  lastActivity: Date | null
}

class UserProfileService {
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'user_profiles', uid))

      if (userDoc.exists()) {
        const data = userDoc.data()
        let institutionName: string | undefined = undefined

        // Fetch institution name if institutionId exists
        if (data.institutionId) {
          try {
            const institutionDoc = await getDoc(doc(db, 'institutions', data.institutionId))
            if (institutionDoc.exists()) {
              institutionName = institutionDoc.data().institutionName
            }
          } catch (instError) {
            console.error('Error fetching institution:', instError)
          }
        }

        return {
          ...data,
          uid,
          institutionName,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as UserProfile
      }

      return null
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  async createUserProfile(uid: string, email: string, initialData?: Partial<UserProfile>): Promise<void> {
    try {
      const now = new Date()
      const defaultProfile: UserProfile = {
        uid,
        email,
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        displayName: initialData?.displayName || '',
        createdAt: now,
        updatedAt: now,
        preferences: {
          learningGoal: 'IELTS Preparation',
          practiceFrequency: 'Daily',
          difficultyLevel: 'Intermediate',
          enableVoiceFeedback: true,
          showAnalytics: true
        },
        notifications: {
          email: {
            practiceReminders: true,
            progressReports: true,
            newFeatures: false
          },
          push: {
            dailyReminder: true,
            achievements: true,
            sessionCompleted: false
          },
          reminderTime: '09:00'
        },
        ...initialData
      }

      await setDoc(doc(db, 'user_profiles', uid), defaultProfile)
    } catch (error) {
      console.error('Error creating user profile:', error)
      throw error
    }
  }

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date()
      }

      await updateDoc(doc(db, 'user_profiles', uid), updateData)

      // Update Firebase Auth profile if name changed
      if (updates.firstName || updates.lastName || updates.displayName) {
        const displayName = updates.displayName || `${updates.firstName || ''} ${updates.lastName || ''}`.trim()
        if (auth.currentUser && displayName) {
          await updateProfile(auth.currentUser, { displayName })
        }
      }
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  async getUserStats(uid: string): Promise<UserStats> {
    try {
      // Get user profile for member since date
      const profile = await this.getUserProfile(uid)
      const memberSince = profile?.createdAt || new Date()

      // Get user sessions for statistics - FIXED: using 'sessions' collection
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('userId', '==', uid)
      )

      const sessionsSnapshot = await getDocs(sessionsQuery)
      const allSessions = sessionsSnapshot.docs.map(doc => ({
        ...doc.data(),
        startTime: doc.data().startTime?.toDate(),
        endTime: doc.data().endTime?.toDate()
      }))

      // Filter completed sessions in memory
      const sessions = allSessions.filter((s: any) => s.status === 'completed')

      // Calculate statistics
      const totalSessions = sessions.length

      const scores = sessions.map((s: any) => s.averageScore || 0).filter(score => score > 0)
      const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0

      const totalPracticeTime = sessions.reduce((total: number, session: any) => {
        return total + (session.totalDuration || 0)
      }, 0)

      // Get last activity
      const lastActivity = sessions.length > 0 && sessions[0].startTime ? sessions[0].startTime : null

      return {
        totalSessions,
        averageScore: Math.round(averageScore * 10) / 10,
        totalPracticeTime, // in seconds
        memberSince,
        lastActivity
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return {
        totalSessions: 0,
        averageScore: 0,
        totalPracticeTime: 0,
        memberSince: new Date(),
        lastActivity: null
      }
    }
  }

  async updatePassword(_currentPassword: string, newPassword: string): Promise<void> {
    try {
      if (!auth.currentUser) {
        throw new Error('No authenticated user')
      }

      // Note: In production, you should reauthenticate the user with currentPassword
      // before updating to newPassword for security
      await updatePassword(auth.currentUser, newPassword)
    } catch (error) {
      console.error('Error updating password:', error)
      throw error
    }
  }

  async deleteUserAccount(uid: string): Promise<void> {
    try {
      // Delete user profile document
      await updateDoc(doc(db, 'user_profiles', uid), {
        deleted: true,
        deletedAt: new Date()
      })

      // Note: Actual user account deletion should be handled by Firebase Admin SDK
      // This is a soft delete of the profile data
    } catch (error) {
      console.error('Error deleting user account:', error)
      throw error
    }
  }

  formatMemberSince(date: Date): string {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 30) {
      return `Member for ${diffDays} days`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `Member for ${months} month${months > 1 ? 's' : ''}`
    } else {
      const years = Math.floor(diffDays / 365)
      return `Member for ${years} year${years > 1 ? 's' : ''}`
    }
  }

  formatPracticeTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)

    if (minutes < 60) {
      return `${minutes}m`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (remainingMinutes === 0) {
      return `${hours}h`
    }

    return `${hours}h ${remainingMinutes}m`
  }
}

export const userProfileService = new UserProfileService()
export type { UserProfile, UserStats }
export default userProfileService