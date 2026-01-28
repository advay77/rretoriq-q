export interface Question {
  id: string
  text: string
  type: 'Aptitude' | 'Technical' | 'HR'
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Advanced'
  subject?: 'DBMS' | 'C' | 'OOPs' | 'DS' // For Technical questions only
  skillsEvaluated: string[]
  metadata: {
    expectedAnswerLength: number
    keyPoints: string[]
    industry?: string
  }
  category?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface QuestionBank {
  aptitudeQuestions: {
    easy: Question[]
    medium: Question[]
    hard: Question[]
  }
  technicalQuestions: {
    easy: Question[]
    medium: Question[]
    hard: Question[]
  }
  hrQuestions: {
    easy: Question[]
    medium: Question[]
    hard: Question[]
  }
}

export interface QuestionFilters {
  type?: 'Aptitude' | 'Technical' | 'HR'
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Advanced'
  subject?: 'DBMS' | 'C' | 'OOPs' | 'DS'
  category?: string
  shuffle?: boolean
}

export interface PracticeSession {
  id: string
  userId: string
  questions: Question[]
  startTime: Date
  endTime?: Date
  responses: SessionResponse[]
  sessionType: 'Aptitude' | 'Technical' | 'HR' | 'Mixed'
}

export interface SessionResponse {
  questionId: string
  userAnswer: string
  audioRecording?: string
  timestamp: Date
  aiEvaluation?: AIEvaluation
}

export interface AIEvaluation {
  overallScore: number
  maxScore: number
  breakdown: {
    relevance: number
    clarity: number
    confidence: number
    structure: number
    examples: number
  }
  strengths: string[]
  improvements: string[]
  feedbackMessage: string
}

export interface QuestionStats {
  total: number
  byType: Record<string, number>
  byDifficulty: Record<string, number>
}