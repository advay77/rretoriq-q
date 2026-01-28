/**
 * Enhanced InterviewSession Component
 * 
 * Integrates AudioRecorder, AnalysisResults, Firebase session storage,
 * Speech-to-Text, and OpenAI analysis services for complete interview practice
 */

import React, { useState, useEffect } from 'react'
import { Clock, SkipForward, CheckCircle, ArrowRight, Home, RotateCcw, Loader2 } from 'lucide-react'
import AudioRecorder from './AudioRecorder'
import AnalysisResults from './AnalysisResults'
import type { AnswerAnalysis, InterviewQuestion } from '../services/openAIAnalysisService'
import type { TranscriptionResult } from '../services/speechToTextService'
import type { Question } from '../types/questions'
import { firebaseSessionService } from '../services/firebaseSessionService'

interface EnhancedInterviewSessionProps {
  questions: Question[]
  sessionType: 'hr' | 'technical' | 'aptitude' | 'mixed'
  userId: string
  onSessionComplete: (sessionId: string, results: SessionResults) => void
  onSessionExit: () => void
}

interface SessionResults {
  totalQuestions: number
  completedQuestions: number
  averageScore: number
  totalDuration: number
  analyses: AnswerAnalysis[]
  sessionType: string
}

interface SessionState {
  currentQuestionIndex: number
  isComplete: boolean
  startTime: number
  analyses: AnswerAnalysis[]
  transcriptions: TranscriptionResult[]
  isSaving: boolean
  saveError: string | null
}

export const EnhancedInterviewSession: React.FC<EnhancedInterviewSessionProps> = ({
  questions,
  sessionType,
  userId,
  onSessionComplete,
  onSessionExit
}) => {
  const [sessionState, setSessionState] = useState<SessionState>({
    currentQuestionIndex: 0,
    isComplete: false,
    startTime: Date.now(),
    analyses: [],
    transcriptions: [],
    isSaving: false,
    saveError: null
  })

  const [currentAnalysis, setCurrentAnalysis] = useState<AnswerAnalysis | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${userId}`)
  const [firebaseSessionId, setFirebaseSessionId] = useState<string | null>(null)

  // Initialize Firebase session on mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const fbSessionId = await firebaseSessionService.createSession(
          userId,
          'interview',
          sessionType
        )
        setFirebaseSessionId(fbSessionId)
        console.log('✅ Firebase session initialized:', fbSessionId)
      } catch (error) {
        console.error('❌ Failed to initialize Firebase session:', error)
        setSessionState(prev => ({
          ...prev,
          saveError: 'Failed to initialize session. Your progress may not be saved.'
        }))
      }
    }

    initializeSession()
  }, [userId, sessionType])

  // Convert Question to InterviewQuestion format
  const convertToInterviewQuestion = (question: Question): InterviewQuestion => ({
    id: question.id,
    question: question.text,
    type: question.type.toLowerCase() as any || 'behavioral',
    difficulty: (question.difficulty?.toLowerCase() as 'easy' | 'medium' | 'hard') || 'medium',
    skills: question.skillsEvaluated || [],
    expectedDuration: 120,
    category: question.category || 'General'
  })

  const currentQuestion = questions[sessionState.currentQuestionIndex]
  const isLastQuestion = sessionState.currentQuestionIndex === questions.length - 1

  /**
   * Handle analysis completion for current question
   * Saves answer and analysis to Firebase
   */
  const handleAnalysisComplete = async (analysis: AnswerAnalysis) => {
    setCurrentAnalysis(analysis)
    setShowAnalysis(true)
    
    // Update session state with new analysis
    setSessionState(prev => ({
      ...prev,
      analyses: [...prev.analyses, analysis]
    }))

    // Save to Firebase
    if (firebaseSessionId) {
      setSessionState(prev => ({ ...prev, isSaving: true, saveError: null }))
      
      try {
        const transcription = sessionState.transcriptions[sessionState.transcriptions.length - 1]
        
        await firebaseSessionService.saveAnswer(firebaseSessionId, {
          questionId: currentQuestion.id,
          questionText: currentQuestion.text,
          questionType: currentQuestion.type,
          difficulty: currentQuestion.difficulty || 'medium',
          transcription: transcription || {
            transcript: analysis.transcript,
            confidence: 0,
            success: true,
            processingTime: 0
          },
          analysis,
          audioDuration: analysis.timeManagement.duration
        })
        
        console.log('✅ Answer saved to Firebase')
        setSessionState(prev => ({ ...prev, isSaving: false }))
        
      } catch (error) {
        console.error('❌ Failed to save answer to Firebase:', error)
        setSessionState(prev => ({
          ...prev,
          isSaving: false,
          saveError: 'Failed to save your answer. Please check your connection.'
        }))
      }
    }
  }

  /**
   * Handle transcription completion
   */
  const handleTranscriptionComplete = (result: TranscriptionResult) => {
    setSessionState(prev => ({
      ...prev,
      transcriptions: [...prev.transcriptions, result]
    }))
  }

  /**
   * Move to next question or complete session
   */
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      completeSession()
    } else {
      setSessionState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }))
      setCurrentAnalysis(null)
      setShowAnalysis(false)
    }
  }

  /**
   * Skip current question without recording
   */
  const handleSkipQuestion = () => {
    // Create a placeholder analysis for skipped question
    const skippedAnalysis: AnswerAnalysis = {
      overallScore: 0,
      transcript: '',
      feedback: {
        strengths: [],
        weaknesses: ['Question was skipped'],
        suggestions: ['Consider attempting all questions in a real interview'],
        detailedFeedback: 'This question was skipped during the practice session.'
      },
      scores: {
        clarity: 0,
        relevance: 0,
        structure: 0,
        completeness: 0,
        confidence: 0
      },
      keyPoints: {
        covered: [],
        missed: ['All key points - question not attempted']
      },
      timeManagement: {
        duration: 0,
        efficiency: 'poor',
        pacing: 'Question skipped'
      },
      processingTime: 0
    }

    setCurrentAnalysis(skippedAnalysis)
    setShowAnalysis(true)
    
    setSessionState(prev => ({
      ...prev,
      analyses: [...prev.analyses, skippedAnalysis]
    }))
  }

  /**
   * Complete the entire interview session
   * Saves final results to Firebase and updates user progress
   */
  const completeSession = async () => {
    const totalDuration = Math.floor((Date.now() - sessionState.startTime) / 1000)
    const completedQuestions = sessionState.analyses.length
    const averageScore = completedQuestions > 0 
      ? Math.round(sessionState.analyses.reduce((sum, analysis) => sum + analysis.overallScore, 0) / completedQuestions)
      : 0

    const results: SessionResults = {
      totalQuestions: questions.length,
      completedQuestions,
      averageScore,
      totalDuration,
      analyses: sessionState.analyses,
      sessionType
    }

    // Save to Firebase
    if (firebaseSessionId) {
      setSessionState(prev => ({ ...prev, isSaving: true }))
      
      try {
        await firebaseSessionService.completeSession(firebaseSessionId, results)
        console.log('✅ Session completed and saved to Firebase')
      } catch (error) {
        console.error('❌ Failed to complete session in Firebase:', error)
        setSessionState(prev => ({
          ...prev,
          saveError: 'Failed to save final results. Your progress may not be fully saved.'
        }))
      } finally {
        setSessionState(prev => ({ ...prev, isSaving: false }))
      }
    }

    setSessionState(prev => ({ ...prev, isComplete: true }))
    onSessionComplete(sessionId, results)
  }

  /**
   * Format session time
   */
  const formatSessionTime = (): string => {
    const elapsed = Math.floor((Date.now() - sessionState.startTime) / 1000)
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Show completion screen
  if (sessionState.isComplete) {
    const averageScore = sessionState.analyses.length > 0
      ? Math.round(sessionState.analyses.reduce((sum, analysis) => sum + analysis.overallScore, 0) / sessionState.analyses.length)
      : 0

    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Session Complete!</h1>
            <p className="text-gray-600">
              You've completed {sessionState.analyses.length} out of {questions.length} questions
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Session Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{averageScore}</div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{sessionState.analyses.length}</div>
                <div className="text-sm text-gray-600">Questions Answered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{formatSessionTime()}</div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 capitalize">{sessionType}</div>
                <div className="text-sm text-gray-600">Session Type</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.href = '/ai-interview'}
              className="flex items-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Practice Again</span>
            </button>
            <button
              onClick={onSessionExit}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={onSessionExit}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                ← Exit
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span className="text-gray-900 font-semibold font-mono text-sm">{formatSessionTime()}</span>
              </div>
              
              {sessionState.isSaving && (
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Saving...</span>
                </div>
              )}
              
              {sessionState.saveError && (
                <div className="text-xs text-red-600">⚠️ {sessionState.saveError}</div>
              )}
            </div>
            <div className="text-sm font-semibold text-gray-700">
              Question {sessionState.currentQuestionIndex + 1}/{questions.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${((sessionState.currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid lg:grid-cols-2 gap-6 h-full">
            {/* Left Column - Question & Recorder */}
            <div className="flex flex-col space-y-4">
              {/* Question Card */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                    {currentQuestion.category || sessionType.toUpperCase()}
                  </span>
                  {currentQuestion.difficulty && (
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md ${
                      currentQuestion.difficulty?.toLowerCase() === 'easy' ? 'bg-green-100 text-green-700' :
                      currentQuestion.difficulty?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {currentQuestion.difficulty}
                    </span>
                  )}
                  <button
                    onClick={handleSkipQuestion}
                    className="ml-auto text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    <span>Skip</span>
                  </button>
                </div>
                
                <h2 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                  {currentQuestion.text}
                </h2>

                {currentQuestion.skillsEvaluated && currentQuestion.skillsEvaluated.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1.5 font-medium">Skills Evaluated:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {currentQuestion.skillsEvaluated.map((skill, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    ⏱️ Recommended: {Math.floor((currentQuestion.metadata?.expectedAnswerLength || 120) / 60)} min
                  </span>
                </div>
              </div>

              {/* Audio Recorder Card */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <AudioRecorder
                  key={`question-${sessionState.currentQuestionIndex}`}
                  question={convertToInterviewQuestion(currentQuestion)}
                  onAnalysisComplete={handleAnalysisComplete}
                  onTranscriptionComplete={handleTranscriptionComplete}
                  maxDuration={Math.min(currentQuestion.metadata?.expectedAnswerLength || 60, 60)}
                  className=""
                />
              </div>
            </div>

            {/* Right Column - Analysis Results */}
            <div className="flex flex-col">
              {showAnalysis && currentAnalysis ? (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-full">
                  {/* Results - Scrollable */}
                  <div className="flex-1 overflow-y-auto p-5">
                    <AnalysisResults analysis={currentAnalysis} className="" />
                  </div>
                  
                  {/* Fixed Action Buttons */}
                  <div className="border-t border-gray-200 p-4 bg-gray-50 flex gap-3">
                    <button
                      onClick={() => {
                        setShowAnalysis(false)
                        setCurrentAnalysis(null)
                      }}
                      className="flex-1 bg-gray-600 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors font-semibold text-sm"
                    >
                      ↻ Record Again
                    </button>
                    
                    <button
                      onClick={handleNextQuestion}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2.5 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all font-semibold text-sm shadow-md"
                    >
                      <span>{isLastQuestion ? '✓ Complete' : 'Next Question'}</span>
                      {!isLastQuestion && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-8 text-center h-full flex flex-col justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <CheckCircle className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Record</h3>
                  <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
                    Click "Start Recording" to begin. Your response will be analyzed instantly for detailed feedback.
                  </p>
                  
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 max-w-sm mx-auto">
                    <p className="text-xs text-gray-700 font-medium mb-2">💡 Tips for Best Results:</p>
                    <div className="text-xs text-gray-600 space-y-1 text-left">
                      <p>✓ Speak clearly and confidently</p>
                      <p>✓ Structure your answer logically</p>
                      <p>✓ Use specific examples</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedInterviewSession