import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import type { User as FirebaseUser } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, googleProvider, db } from '../lib/firebase'
import { userProfileService } from '../services/userProfileService'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  displayName: string
  photoURL?: string
  emailVerified: boolean
  createdAt: string
  profileCompleted?: boolean
  isNewUser?: boolean
  admin?: boolean // Custom claim for institutional admins
  institutionId?: string // Institution the user belongs to (for students)
  approved?: boolean // whether admin approved this user to access the app
  college?: string // User's college or educational institution
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  firstName: string
  lastName: string
  college: string
  phone: string
  location: string
  dateOfBirth: string
  occupation: string
  education: string
  languages: string
  bio: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  profileCompleted: boolean
  isNewUser: boolean
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>
  loginWithGoogle: () => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  initializeAuth: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
  checkProfileCompletion: (userId: string) => Promise<boolean>
  completeProfile: (userId: string, profileData: any) => Promise<void>
  markProfileCompleted: () => void
  refreshClaims: () => Promise<void>
}

type AuthStore = AuthState & AuthActions

// Helper function to convert Firebase user to our User type
const convertFirebaseUser = async (firebaseUser: FirebaseUser, isNewUser: boolean = false): Promise<User> => {
  // Try to get additional user data from Firestore
  const userDocRef = doc(db, 'users', firebaseUser.uid)
  const userDoc = await getDoc(userDocRef)

  // Check if user profile is completed
  const userProfile = await userProfileService.getUserProfile(firebaseUser.uid)
  const profileCompleted = userProfile ? checkProfileCompleteness(userProfile) : false

  // Get custom claims (admin status) from ID token. Force a token refresh
  // so recently-set custom claims (from admin SDK) are picked up by clients.
  let idTokenResult
  try {
    idTokenResult = await firebaseUser.getIdTokenResult(true)
  } catch (err) {
    // If forcing a refresh fails (network issues), fall back to cached token
    console.warn('Failed to refresh ID token for claims; falling back to cached token', err)
    idTokenResult = await firebaseUser.getIdTokenResult()
  }

  // Debug: show claims to diagnose admin access issues
  try {
    // eslint-disable-next-line no-console
    console.debug('Firebase ID token claims:', idTokenResult.claims)
  } catch (e) {
    // ignore
  }
  const isAdmin = idTokenResult.claims.admin === true || idTokenResult.claims.isAdmin === true

  if (userDoc.exists()) {
    const userData = userDoc.data()
    // If approved is undefined (older users), default to true to avoid locking existing accounts.
    const isApproved = userData.approved === undefined ? true : !!userData.approved
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      displayName: firebaseUser.displayName || `${userData.firstName} ${userData.lastName}`,
      photoURL: firebaseUser.photoURL || undefined,
      emailVerified: firebaseUser.emailVerified,
      createdAt: userData.createdAt || new Date().toISOString(),
      profileCompleted,
      isNewUser,
      admin: isAdmin,
      institutionId: userData.institutionId,
      approved: isApproved
    }
  }

  // Fallback to Firebase user data only
  const displayNameParts = firebaseUser.displayName?.split(' ') || ['', '']
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    firstName: displayNameParts[0] || '',
    lastName: displayNameParts.slice(1).join(' ') || '',
    displayName: firebaseUser.displayName || firebaseUser.email || '',
    photoURL: firebaseUser.photoURL || undefined,
    emailVerified: firebaseUser.emailVerified,
    createdAt: new Date().toISOString(),
    profileCompleted,
    isNewUser,
    admin: isAdmin
  }
}

// Helper function to check if profile is complete
const checkProfileCompleteness = (profile: any): boolean => {
  const requiredFields = ['firstName', 'lastName', 'phone', 'location', 'occupation']
  return requiredFields.every(field => profile[field] && profile[field].trim().length > 0)
}

// Helper function to save user data to Firestore
const saveUserToFirestore = async (firebaseUser: FirebaseUser, additionalData?: Partial<User>) => {
  const userDocRef = doc(db, 'users', firebaseUser.uid)
  const userData = {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    firstName: additionalData?.firstName || '',
    lastName: additionalData?.lastName || '',
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // New users are NOT approved by default. Admin must approve via terminal script.
    approved: typeof additionalData?.approved === 'boolean' ? additionalData!.approved : false,
    ...additionalData
  }

  await setDoc(userDocRef, userData, { merge: true })
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      profileCompleted: false,
      isNewUser: false,

      // Actions

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null })
          const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
          const user = await convertFirebaseUser(userCredential.user)
          // Previously we blocked sign-in for unapproved users. Approval flow
          // has been removed — accept the user regardless of any `approved` flag.

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            profileCompleted: user.profileCompleted || false,
            isNewUser: false
          })
        } catch (error: any) {
          const errorMessage = error.code?.replace('auth/', '').replace('-', ' ') || 'Login failed'
          set({
            error: errorMessage,
            isLoading: false
          })
          throw error
        }
      },

      loginWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null })
          const userCredential = await signInWithPopup(auth, googleProvider)

          // Check if this is a new user
          const existingProfile = await userProfileService.getUserProfile(userCredential.user.uid)
          const isNewUser = !existingProfile

          // Save user data to Firestore
          await saveUserToFirestore(userCredential.user)

          // Create profile if new user
          if (isNewUser) {
            const displayNameParts = userCredential.user.displayName?.split(' ') || ['', '']
            await userProfileService.createUserProfile(userCredential.user.uid, userCredential.user.email!, {
              firstName: displayNameParts[0] || '',
              lastName: displayNameParts.slice(1).join(' ') || '',
              displayName: userCredential.user.displayName || ''
            })
          }

          const user = await convertFirebaseUser(userCredential.user, isNewUser)

          // Approval flow removed — proceed normally

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            profileCompleted: user.profileCompleted || false,
            isNewUser
          })
        } catch (error: any) {
          const errorMessage = error.code?.replace('auth/', '').replace('-', ' ') || 'Google login failed'
          set({
            error: errorMessage,
            isLoading: false
          })
          throw error
        }
      },

      register: async (credentials: RegisterCredentials) => {
        try {
          set({ isLoading: true, error: null })
          const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password)

          // Prepare user profile data
          const userProfileData = {
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            displayName: `${credentials.firstName} ${credentials.lastName}`,
            email: credentials.email,
            phone: credentials.phone,
            location: credentials.location,
            dateOfBirth: credentials.dateOfBirth,
            occupation: credentials.occupation,
            education: credentials.education,
            languages: credentials.languages,
            bio: credentials.bio,
            college: credentials.college,
            // Set default values for preferences
            preferences: {
              learningGoal: 'general',
              practiceFrequency: 'weekly',
              difficultyLevel: 'intermediate',
              enableVoiceFeedback: true,
              showAnalytics: true
            },
            // Set default notification preferences
            notifications: {
              email: {
                practiceReminders: true,
                progressReports: true,
                newFeatures: true
              },
              push: {
                dailyReminder: true,
                achievements: true,
                sessionCompleted: true
              },
              reminderTime: '09:00'
            },
            // Set timestamps
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          // Update the user's display name
          await updateProfile(userCredential.user, {
            displayName: userProfileData.displayName
          })

          // Save user data to Firestore
          await saveUserToFirestore(userCredential.user, {
            ...userProfileData,
            // Additional fields for the main users collection
            emailVerified: false,
            profileCompleted: true,
            isNewUser: true
          })

          // Create user profile with all the collected information
          await userProfileService.createUserProfile(
            userCredential.user.uid,
            userCredential.user.email!,
            {
              ...userProfileData,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          )

          const user = await convertFirebaseUser(userCredential.user, true)

          // For new registrations, mark profile as not completed
          // since we still need additional profile information
          set({
            user: {
              ...user,
              profileCompleted: false
            },
            isAuthenticated: true,
            isLoading: false,
            profileCompleted: false,
            isNewUser: true
          })
        } catch (error: any) {
          const errorMessage = error.code?.replace('auth/', '').replace('-', ' ') || 'Registration failed'
          set({
            error: errorMessage,
            isLoading: false
          })
          throw error
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true })
          await signOut(auth)
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            profileCompleted: false,
            isNewUser: false
          })
        } catch (error) {
          console.error('Logout error:', error)
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            profileCompleted: false,
            isNewUser: false
          })
        }
      },

      // removed clearApprovalPending and approval UI state

      initializeAuth: () => {
        // Start loading and attach a watchdog timeout so the UI doesn't stay
        // stuck in 'Loading...' if the auth listener never fires (for
        // example when extensions block Firebase network requests).
        set({ isLoading: true })

        let settled = false
        const watchdog = setTimeout(() => {
          if (!settled) {
            console.warn('Auth initialization watchdog fired — marking not-loading to avoid indefinite spinner')
            set({ isLoading: false })
          }
        }, 10000) // 10s

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          try {
            if (firebaseUser) {
              const user = await convertFirebaseUser(firebaseUser)

              // Approval flow removed — allow user to stay signed in

              set({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                profileCompleted: user.profileCompleted || false,
                isNewUser: user.isNewUser || false
              })
            } else {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
                profileCompleted: false,
                isNewUser: false
              })
            }

            settled = true
            clearTimeout(watchdog)
          } catch (error) {
            console.error('Auth state change error:', error)
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: error instanceof Error ? error.message : 'Authentication error',
              profileCompleted: false,
              isNewUser: false
            })

            settled = true
            clearTimeout(watchdog)
          }
        })

        // Return unsubscribe function
        return unsubscribe
      },

      checkProfileCompletion: async (userId: string): Promise<boolean> => {
        try {
          const profile = await userProfileService.getUserProfile(userId)
          if (!profile) return false

          const isComplete = checkProfileCompleteness(profile)
          set({ profileCompleted: isComplete })
          return isComplete
        } catch (error) {
          console.error('Error checking profile completion:', error)
          return false
        }
      },

      // Force-refresh ID token claims and update stored user.admin flag.
      refreshClaims: async () => {
        try {
          const state = useAuthStore.getState()
          const currentUser = auth.currentUser
          if (!currentUser) return

          // Force refresh token to pick up recently-set custom claims
          let idTokenResult
          try {
            idTokenResult = await currentUser.getIdTokenResult(true)
          } catch (err) {
            console.warn('refreshClaims: failed to force-refresh token, falling back to cached token', err)
            idTokenResult = await currentUser.getIdTokenResult()
          }

          const isAdmin = idTokenResult.claims?.admin === true || idTokenResult.claims?.isAdmin === true

          // Update the stored user object if present
          const existingUser = state.user
          if (existingUser) {
            const updatedUser = { ...existingUser, admin: isAdmin }
            // Use the same setter used elsewhere
            // Note: set is not available here, so call setLoading as a lightweight state update
            // then replace the user by calling initializeAuth flow if needed. Simpler: write directly
            useAuthStore.setState({ user: updatedUser, isAuthenticated: true })
          }
        } catch (error) {
          console.error('Error refreshing claims:', error)
        }
      },

      completeProfile: async (userId: string, profileData: any) => {
        try {
          await userProfileService.updateUserProfile(userId, profileData)
          set({ profileCompleted: true, isNewUser: false })
        } catch (error) {
          console.error('Error completing profile:', error)
          throw error
        }
      },

      markProfileCompleted: () => set({ profileCompleted: true, isNewUser: false }),

      clearError: () => set({ error: null }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        profileCompleted: state.profileCompleted,
        isNewUser: state.isNewUser
      }),
    }
  )
)

// Initialize auth state on app load
export const initializeAuth = () => {
  const { initializeAuth: initAuth } = useAuthStore.getState()
  return initAuth()
}