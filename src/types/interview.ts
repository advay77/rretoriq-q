// Question types
export interface Question {
  id: string
  text: string
  type: 'HR' | 'Technical' | 'Behavioral'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category?: string
  followUpQuestions?: string[]
  expectedDuration?: number // in seconds
  keywords?: string[]
  createdAt: Date
  updatedAt: Date
}

// Answer and feedback types
export interface Answer {
  questionId: string
  questionText: string
  answerText: string
  audioUrl?: string
  duration: number
  timestamp: Date
}

export interface FeedbackAnalysis {
  score: number // 1-10
  strengths: string[]
  weaknesses: string[]
  feedback: string
  grammarScore: number
  relevanceScore: number
  confidenceScore: number
  fluencyScore: number
  suggestions: string[]
}

// Session types
export interface InterviewSession {
  id: string
  userId: string
  status: 'in_progress' | 'completed' | 'paused'
  startTime: Date
  endTime?: Date
  totalDuration?: number
  questions: Question[]
  answers: (Answer & { feedback?: FeedbackAnalysis })[]
  overallScore?: number
  overallFeedback?: string
  sessionType: 'practice' | 'mock' | 'assessment'
  createdAt: Date
  updatedAt: Date
}

// User session summary
export interface UserSessionSummary {
  id: string
  userId: string
  sessionId: string
  date: Date
  questionsAnswered: number
  totalQuestions: number
  averageScore: number
  highestScore: number
  lowestScore: number
  totalDuration: number
  sessionType: string
  completionStatus: 'completed' | 'partial'
}

// Progress tracking
export interface UserProgress {
  id: string
  userId: string
  totalSessions: number
  completedSessions: number
  totalPracticeTime: number // in minutes
  averageScore: number
  improvementRate: number
  skillBreakdown: {
    hr: { sessions: number; averageScore: number }
    technical: { sessions: number; averageScore: number }
    behavioral: { sessions: number; averageScore: number }
  }
  difficultyBreakdown: {
    easy: { sessions: number; averageScore: number }
    medium: { sessions: number; averageScore: number }
    hard: { sessions: number; averageScore: number }
  }
  lastPracticeDate: Date
  streakDays: number
  badges: string[]
  createdAt: Date
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

// Voice recording types
export interface VoiceRecording {
  audioBlob: Blob
  transcription: string
  duration: number
  confidence: number
}

// Real-time transcription
export interface TranscriptionResult {
  text: string
  isFinal: boolean
  confidence: number
  timestamp: number
}