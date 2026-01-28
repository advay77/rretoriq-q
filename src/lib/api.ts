import axios, { AxiosError } from 'axios'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Important for refresh token cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token management
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token!)
    }
  })

  failedQueue = []
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const { accessToken } = response.data.data
        localStorage.setItem('accessToken', accessToken)

        processQueue(null, accessToken)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  subscriptionTier: 'free' | 'premium' | 'enterprise'
  emailVerified: boolean
  createdAt: string
  profile?: UserProfile
}

export interface UserProfile {
  id: string
  userId: string
  avatar?: string
  phoneNumber?: string
  dateOfBirth?: string
  country?: string
  nativeLanguage?: string
  targetLanguage: string
  targetIeltsScore?: string
  testDate?: string
  targetIndustry?: string
  targetPosition?: string
  experienceLevel?: string
  preferredTime?: string
  studyGoals?: string[]
  createdAt: string
  updatedAt: string
}

export interface IeltsSession {
  id: string
  testType: 'speaking' | 'writing' | 'reading' | 'listening'
  duration: number
  overallScore?: number
  fluencyScore?: number
  pronunciationScore?: number
  grammarScore?: number
  vocabularyScore?: number
  isCompleted: boolean
  createdAt: string
}

export interface InterviewSession {
  id: string
  companyType: string
  positionLevel: string
  interviewType: string
  duration: number
  confidenceScore?: number
  clarityScore?: number
  contentScore?: number
  overallScore?: number
  isCompleted: boolean
  createdAt: string
}

export interface UserProgress {
  id: string
  skillType: string
  currentLevel: number
  improvementRate: number
  totalSessions: number
  totalPracticeTime: number
  averageScore?: number
  bestScore?: number
  lastPracticeDate?: string
  streakDays: number
}

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.message) {
    return error.message
  }
  return 'An unexpected error occurred'
}

export default api