import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Play,
  Mic,
  Clock,
  BookOpen,
  CheckCircle,
  ArrowRight,
  PenTool,
  MessageSquare,
  Settings,
  ArrowLeft,
  Volume2
} from 'lucide-react'
import { speakingQuestions, type CommunicationQuestion } from '../../data/communicationQuestions'
import { readingImageQuestions, type ReadingImageQuestion } from '../../data/readingImageQuestions'
import { AudioRecorder } from '../../components/AudioRecorder'
import type { AnswerAnalysis, InterviewQuestion } from '../../services/geminiAnalysisService'
import type { TranscriptionResult } from '../../services/speechToTextService'
import { AnalysisResults } from '../../components/AnalysisResults'
import { firebaseSessionService } from '../../services/firebaseSessionService'
import { auth } from '../../lib/firebase'
import EmailWritingSession from '../../components/EmailWritingSession'
import { sessionLimitService } from '../../services/sessionLimitService'

export default function IELTSPractice() {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState<'speaking' | 'reading' | 'writing' | 'voice'>('speaking')
  const [currentQuestion, setCurrentQuestion] = useState<CommunicationQuestion | null>(null)
  const [currentReadingQuestion, setCurrentReadingQuestion] = useState<ReadingImageQuestion | null>(null)
  const [responses, setResponses] = useState<{ [key: string]: string }>({})
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedQuestions, setSelectedQuestions] = useState<CommunicationQuestion[]>([])
  const [selectedReadingQuestions, setSelectedReadingQuestions] = useState<ReadingImageQuestion[]>([])
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState({
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    numberOfQuestions: 5
  })
  const [analysis, setAnalysis] = useState<AnswerAnalysis | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [allAnalyses, setAllAnalyses] = useState<{ [key: string]: AnswerAnalysis }>({})
  const [currentTranscription, setCurrentTranscription] = useState<TranscriptionResult | null>(null)
  const [audioStartTime, setAudioStartTime] = useState<number | null>(null)
  const [writingDifficulty, setWritingDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | null>(null)

  const isReading = selectedType === 'reading'

  const skillTypes = [
    {
      type: 'speaking' as const,
      title: 'Speaking',
      icon: <Mic className="w-6 h-6" />,
      description: 'Practice speaking skills with real-time recording',
      limit: '4 sessions/month',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      stats: { questions: '3-4', duration: '15-20m', level: 'Mid' }
    },
    {
      type: 'reading' as const,
      title: 'Reading',
      icon: <BookOpen className="w-6 h-6" />,
      description: 'Enhance reading skills with comprehension tasks',
      limit: '4 sessions/month • Max 3 questions',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      stats: { questions: 'Max 3', duration: '10-15m', level: 'Mid' }
    },
    {
      type: 'writing' as const,
      title: 'Writing',
      icon: <PenTool className="w-6 h-6" />,
      description: 'Develop writing abilities with structured tasks',
      limit: '2 sessions/month • Max 2 questions',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      stats: { questions: 'Max 2', duration: '10-15m', level: 'Mid' }
    },
    {
      type: 'voice' as const,
      title: 'Voice',
      icon: <Volume2 className="w-6 h-6" />,
      description: 'Analyze your voice pitch, pace and clarity',
      limit: '4 sessions/month',
      color: 'bg-emerald-500',
      hoverColor: 'hover:bg-emerald-600',
      stats: { questions: '3-4', duration: '15-20m', level: 'Mid' }
    }
  ]

  // Remove timer effects since AudioRecorder handles timing
  // Remove speech recognition since AudioRecorder uses Whisper

  // Convert CommunicationQuestion to InterviewQuestion format for AudioRecorder
  const convertToInterviewQuestion = (commQuestion: CommunicationQuestion): InterviewQuestion => ({
    id: commQuestion.id,
    question: commQuestion.question,
    type: 'behavioral',
    difficulty: commQuestion.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard',
    skills: commQuestion.keyPoints || [],
    expectedDuration: commQuestion.timeLimit,
    category: 'Communication'
  })

  // Convert ReadingImageQuestion to InterviewQuestion format for AudioRecorder
  const convertReadingToInterviewQuestion = (readingQuestion: ReadingImageQuestion): InterviewQuestion => ({
    id: readingQuestion.id,
    question: `Based on the image showing "${readingQuestion.title}", ${readingQuestion.description}`,
    type: 'behavioral',
    difficulty: 'medium',
    skills: readingQuestion.suggestedPoints,
    expectedDuration: 90, // 90 seconds for reading
    category: 'Reading & Speaking'
  })

  const handleAnalysisComplete = async (analysisResult: AnswerAnalysis) => {
    setAnalysis(analysisResult)

    // Determine current active question (Speaking or Reading)
    const activeQuestionId = isReading && currentReadingQuestion ? currentReadingQuestion.id : currentQuestion?.id
    const activeQuestionText = isReading && currentReadingQuestion
      ? `Reading: ${currentReadingQuestion.title}`
      : currentQuestion?.question

    // Store analysis for session summary
    if (activeQuestionId) {
      setAllAnalyses(prev => ({
        ...prev,
        [activeQuestionId]: analysisResult
      }))

      // Mark response as complete
      setResponses(prev => ({
        ...prev,
        [activeQuestionId]: 'Response recorded and analyzed'
      }))

      // Save to Firebase if session is active
      if (sessionId && auth.currentUser && currentTranscription) {
        try {
          const timeLimit = isReading && currentReadingQuestion ? 90 : (currentQuestion?.timeLimit || 60)
          const audioDuration = audioStartTime ? Math.round((Date.now() - audioStartTime) / 1000) : timeLimit

          await firebaseSessionService.saveAnswer(sessionId, {
            questionId: activeQuestionId,
            questionText: activeQuestionText || 'Unknown Question',
            questionType: isReading ? 'reading' : (selectedType === 'voice' ? 'voice' : 'speaking'),
            difficulty: isReading ? 'medium' : (currentQuestion?.difficulty.toLowerCase() || 'medium'),
            transcription: currentTranscription,
            analysis: analysisResult,
            audioDuration: audioDuration
          })
          console.log('✅ Answer saved to Firebase')
        } catch (error) {
          console.error('❌ Failed to save answer:', error)
        }
      }
    }
  }

  const handleTranscriptionComplete = (result: TranscriptionResult) => {
    // Store transcription for later use when saving to Firebase
    setCurrentTranscription(result)
    setAudioStartTime(Date.now())
    console.log('Transcription complete:', result.transcript)
  }

  const startSession = async () => {
    if (!auth.currentUser) {
      alert('Please log in to start a practice session.')
      return
    }

    // Check session limits before starting
    const limitCheck = await sessionLimitService.canStartSession(
      auth.currentUser.uid,
      'ielts',
      selectedType
    )

    if (!limitCheck.allowed) {
      alert(limitCheck.reason || 'You have reached your monthly limit for this session type.')
      return
    }

    // Enforce question limits for reading and writing
    let questionCount = preferences.numberOfQuestions
    if (selectedType === 'reading') {
      questionCount = Math.min(questionCount, 3) // Max 3 questions for reading
    } else if (selectedType === 'writing') {
      questionCount = Math.min(questionCount, 2) // Max 2 questions for writing
    }

    setShowPreferences(false)
    setSessionStarted(true)
    setSessionStartTime(new Date())

    // Create Firebase session
    try {
      const newSessionId = await firebaseSessionService.createSession(
        auth.currentUser.uid,
        'ielts', // Using 'ielts' sessionType
        undefined, // No interview type for practice sessions
        selectedType // practiceType: speaking, reading, or writing
      )
      setSessionId(newSessionId)
      console.log('✅ Session created:', newSessionId)
    } catch (error) {
      console.error('❌ Failed to create session:', error)
    }

    // Filter questions by selected difficulty for speaking or voice
    if (selectedType === 'speaking' || selectedType === 'voice') {
      const filteredQuestions = speakingQuestions.filter(
        q => q.difficulty === preferences.difficulty
      )
      const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, questionCount)
      setSelectedQuestions(selected)
      setCurrentQuestion(selected[0])
      setCurrentQuestionIndex(0)
    }

    // For reading - no difficulty filter, random selection, max 3 questions
    if (selectedType === 'reading') {
      const shuffled = [...readingImageQuestions].sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, questionCount)
      setSelectedReadingQuestions(selected)
      setCurrentReadingQuestion(selected[0])
      setCurrentQuestionIndex(0)
    }
    // For writing, we'll add logic when questions are available
  }

  const nextQuestion = async () => {
    const totalQuestions = selectedType === 'reading' ? selectedReadingQuestions.length : selectedQuestions.length

    if (currentQuestionIndex < totalQuestions - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)

      if (selectedType === 'reading') {
        setCurrentReadingQuestion(selectedReadingQuestions[nextIndex])
      } else {
        setCurrentQuestion(selectedQuestions[nextIndex])
      }

      setAnalysis(null)
      setCurrentTranscription(null)
      setAudioStartTime(null)
    } else {
      // Complete the session
      await completeSession()
      setSessionComplete(true)
    }
  }

  const completeSession = async () => {
    if (!sessionId || !auth.currentUser || !sessionStartTime) return

    try {
      // Calculate overall metrics
      const analyses = Object.values(allAnalyses)
      const avgOverallScore = analyses.reduce((sum, a) => sum + a.overallScore, 0) / analyses.length
      const totalDuration = Math.round((Date.now() - sessionStartTime.getTime()) / 1000)

      // Complete the session in Firebase
      await firebaseSessionService.completeSession(sessionId, {
        totalQuestions: selectedQuestions.length,
        completedQuestions: Object.keys(responses).length,
        averageScore: avgOverallScore,
        totalDuration: totalDuration,
        analyses: analyses,
        sessionType: 'communication-practice'
      })

      console.log('✅ Session completed successfully')
    } catch (error) {
      console.error('❌ Failed to complete session:', error)
    }
  }

  const resetSession = () => {
    setSessionStarted(false)
    setSessionComplete(false)
    setCurrentQuestion(null)
    setResponses({})
    setSelectedQuestions([])
    setCurrentQuestionIndex(0)
    setShowPreferences(false)
    setAnalysis(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <CheckCircle className="w-12 h-12 text-gray-600 mx-auto mb-6" />
            <h1 className="text-2xl font-light text-gray-900 mb-3">Session Complete!</h1>
            <p className="text-gray-600">Great job completing your {selectedType} practice session.</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-10 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-8">Session Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <p className="text-2xl font-light text-gray-900">{Object.keys(responses).length}</p>
                <p className="text-sm text-gray-600 mt-2">Questions Answered</p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <p className="text-2xl font-light text-gray-900">8.5</p>
                <p className="text-sm text-gray-600 mt-2">Estimated Score</p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <p className="text-2xl font-light text-gray-900">{formatTime(Object.keys(responses).length * 45)}</p>
                <p className="text-sm text-gray-600 mt-2">Total Time</p>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <h3 className="font-medium text-gray-900">Feedback & Recommendations</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-800 text-sm leading-relaxed"><span className="font-medium">Strengths:</span> Clear pronunciation, good vocabulary range, well-structured responses.</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-800 text-sm leading-relaxed"><span className="font-medium">Areas for Improvement:</span> Work on fluency in longer responses, use more varied sentence structures.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={resetSession}
                className="flex-1 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Practice Again
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 border border-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:border-gray-300 transition-colors font-medium"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/progress')}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                View Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (sessionStarted && (currentQuestion || currentReadingQuestion)) {
    const isReading = selectedType === 'reading'
    const totalQuestions = isReading ? selectedReadingQuestions.length : selectedQuestions.length
    const questionId = isReading ? currentReadingQuestion?.id : currentQuestion?.id

    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-teal-50 to-cyan-50">
        {/* Fixed Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <button
                  onClick={resetSession}
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  ← Exit
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-base font-bold text-gray-900">
                  Let's Communicate
                </h1>
                {!isReading && currentQuestion && (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${currentQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {currentQuestion.difficulty}
                  </span>
                )}
                {isReading && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-100 text-purple-700">
                    Reading & Speaking
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-gray-700">
                Question {currentQuestionIndex + 1}/{totalQuestions}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column - Question or Image */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                {/* Reading Image View */}
                {isReading && currentReadingQuestion && (
                  <>
                    {/* Image First - Large and Prominent */}
                    <div className="mb-6">
                      <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ minHeight: '300px' }}>
                        <img
                          src={encodeURI(currentReadingQuestion.imagePath)}
                          alt={currentReadingQuestion.theme}
                          className="w-full h-full object-contain"
                          style={{ maxHeight: '500px' }}
                          onLoad={() => {
                            console.log('✅ Image loaded successfully:', currentReadingQuestion.imagePath)
                          }}
                          onError={(e) => {
                            console.error('❌ Image failed to load:', currentReadingQuestion.imagePath)
                            console.error('❌ Encoded path:', encodeURI(currentReadingQuestion.imagePath))
                            e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found'
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-gray-900 mb-2">{currentReadingQuestion.theme}</h2>
                      <p className="text-sm text-gray-700 leading-relaxed">{currentReadingQuestion.title}</p>
                    </div>

                    <div className="mb-5">
                      <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Instructions</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{currentReadingQuestion.description}</p>
                    </div>

                    {currentReadingQuestion.suggestedPoints && currentReadingQuestion.suggestedPoints.length > 0 && (
                      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                        <p className="text-xs font-semibold text-gray-700 mb-2">💡 Points to Consider:</p>
                        <ul className="space-y-1.5 text-sm text-gray-700">
                          {currentReadingQuestion.suggestedPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-purple-600 mr-2">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">Speaking Time: 90 seconds</span>
                    </div>
                  </>
                )}

                {/* Speaking Question View */}
                {!isReading && currentQuestion && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-4 h-4 text-teal-600" />
                          <span className="font-medium">Time: {formatTime(currentQuestion.timeLimit)}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center space-x-1.5 text-blue-600">
                          <span className="font-semibold">{currentQuestionIndex + 1} of {selectedQuestions.length}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-5">
                      <h2 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Instructions</h2>
                      <p className="text-sm text-gray-700 leading-relaxed">{currentQuestion.instructions}</p>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-base font-bold text-gray-900 mb-3">Question</h2>
                      <p className="text-base text-gray-800 leading-relaxed">{currentQuestion.question}</p>
                    </div>

                    {currentQuestion.keyPoints && currentQuestion.keyPoints.length > 0 && (
                      <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg">
                        <p className="text-xs font-semibold text-gray-700 mb-2">💡 Key Points to Consider:</p>
                        <ul className="space-y-1.5 text-sm text-gray-700">
                          {currentQuestion.keyPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-teal-600 mr-2">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Right Column - Recording Interface */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col">
                {isReading && currentReadingQuestion && (
                  <div className="flex-1">
                    <AudioRecorder
                      key={`reading-${currentQuestionIndex}`}
                      question={convertReadingToInterviewQuestion(currentReadingQuestion)}
                      onAnalysisComplete={handleAnalysisComplete}
                      onTranscriptionComplete={handleTranscriptionComplete}
                      maxDuration={90}
                      autoStop={true}
                      showTranscription={false}
                    />

                    {/* Analysis Results */}
                    {analysis && (
                      <div className="mt-6">
                        <AnalysisResults analysis={analysis} />
                      </div>
                    )}
                  </div>
                )}

                {(selectedType === 'speaking' || selectedType === 'voice') && currentQuestion && (
                  <div className="flex-1">
                    <AudioRecorder
                      key={`${selectedType}-${currentQuestionIndex}`}
                      question={convertToInterviewQuestion(currentQuestion)}
                      onAnalysisComplete={handleAnalysisComplete}
                      onTranscriptionComplete={handleTranscriptionComplete}
                      maxDuration={Math.min(currentQuestion.timeLimit, 60)}
                      autoStop={true}
                      showTranscription={false}
                    />

                    {/* Analysis Results - Only show analysis, not transcription */}
                    {analysis && (
                      <div className="mt-6">
                        <AnalysisResults analysis={analysis} />
                      </div>
                    )}
                  </div>
                )}

                {/* Writing Interface */}
                {selectedType === 'writing' && currentQuestion && (
                  <div className="flex-1 flex flex-col">
                    <textarea
                      value={responses[currentQuestion.id] || ''}
                      onChange={(e) => setResponses(prev => ({
                        ...prev,
                        [currentQuestion.id]: e.target.value
                      }))}
                      placeholder="Type your response here..."
                      className="flex-1 p-4 border border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 resize-none text-sm"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-3">
                      <span className="font-medium">Word count: {(responses[currentQuestion.id] || '').split(/\s+/).filter(word => word.length > 0).length}</span>
                      <span>Minimum: 150 words</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer - Action Buttons */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <button
              onClick={resetSession}
              className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Exit Session
            </button>

            <button
              onClick={nextQuestion}
              disabled={
                selectedType === 'writing'
                  ? !responses[questionId || '']
                  : !analysis
              }
              className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-2.5 rounded-lg hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-sm shadow-md flex items-center space-x-2"
            >
              <span>{currentQuestionIndex === totalQuestions - 1 ? 'Complete Session' : 'Next Question'}</span>
              {currentQuestionIndex < totalQuestions - 1 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Preferences Screen (only for Speaking/Voice - Reading has no difficulty)
  if (showPreferences && (selectedType === 'speaking' || selectedType === 'voice')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setShowPreferences(false)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Selection</span>
          </button>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Session Preferences</h2>
                <p className="text-gray-600 text-sm">Customize your practice session</p>
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(['Easy', 'Medium', 'Hard'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setPreferences(prev => ({ ...prev, difficulty: level }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${preferences.difficulty === level
                      ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                  >
                    <div className="text-center">
                      <div className={`text-lg font-bold mb-1 ${preferences.difficulty === level ? 'text-blue-600' : 'text-gray-700'
                        }`}>
                        {level}
                      </div>
                      <div className="text-xs text-gray-600">
                        {level === 'Easy' && '60-75s questions'}
                        {level === 'Medium' && '75-105s questions'}
                        {level === 'Hard' && '105-120s questions'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Number of Questions
              </label>
              <input
                type="number"
                min="3"
                max="10"
                value={preferences.numberOfQuestions}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  numberOfQuestions: Math.max(3, Math.min(10, parseInt(e.target.value) || 3))
                }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 font-medium"
              />
              <p className="text-xs text-gray-500 mt-2">Choose between 3 and 10 questions</p>
            </div>

            {/* Session Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                Session Summary
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="ml-2 font-bold text-gray-900">{preferences.difficulty}</span>
                </div>
                <div>
                  <span className="text-gray-600">Questions:</span>
                  <span className="ml-2 font-bold text-gray-900">{preferences.numberOfQuestions}</span>
                </div>
                <div>
                  <span className="text-gray-600">Estimated Time:</span>
                  <span className="ml-2 font-bold text-gray-900">
                    {Math.round(preferences.numberOfQuestions * 2)} minutes
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-bold text-gray-900 capitalize">{selectedType}</span>
                </div>
              </div>
            </div>


            {/* Start Button */}
            <button
              onClick={startSession}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Start Session</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Reading Preferences - No difficulty selection, just number of questions
  if (showPreferences && selectedType === 'reading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setShowPreferences(false)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Selection</span>
          </button>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Reading & Speaking Session</h2>
                <p className="text-gray-600 text-sm">View images and speak about the themes</p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg mb-6">
              <p className="text-sm text-gray-700 leading-relaxed">
                📖 In this session, you'll see thought-provoking images representing various themes.
                Observe each image carefully and speak about what you see, your interpretation, and your thoughts on the theme.
                You'll have <strong>90 seconds</strong> to express yourself for each image.
              </p>
            </div>

            {/* Number of Questions */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Number of Images
              </label>
              <input
                type="number"
                min="3"
                max="10"
                value={preferences.numberOfQuestions}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  numberOfQuestions: Math.max(3, Math.min(10, parseInt(e.target.value) || 3))
                }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-900 font-medium"
              />
              <p className="text-xs text-gray-500 mt-2">Choose between 3 and 10 images</p>
            </div>

            {/* Session Summary */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 mb-6 border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                Session Summary
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Images:</span>
                  <span className="ml-2 font-bold text-gray-900">{preferences.numberOfQuestions}</span>
                </div>
                <div>
                  <span className="text-gray-600">Time per Image:</span>
                  <span className="ml-2 font-bold text-gray-900">90 seconds</span>
                </div>
                <div>
                  <span className="text-gray-600">Estimated Time:</span>
                  <span className="ml-2 font-bold text-gray-900">
                    {Math.round(preferences.numberOfQuestions * 1.5)} minutes
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-bold text-gray-900">Reading & Speaking</span>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startSession}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Start Session</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Email Writing Difficulty Selection (for Writing type)
  if (showPreferences && selectedType === 'writing' && !writingDifficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setShowPreferences(false)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Selection</span>
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Email Writing Practice</h1>
            <p className="text-gray-600">Choose your difficulty level to start</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Easy */}
            <button
              onClick={() => setWritingDifficulty('Easy')}
              className="group bg-white hover:bg-gradient-to-br hover:from-emerald-50 hover:to-green-50 rounded-2xl p-8 border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-xl hover:shadow-emerald-500/20"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">📧</span>
                </div>
                <h3 className="text-2xl font-bold text-emerald-700 mb-3">Easy</h3>
                <p className="text-sm text-gray-600 mb-4">Basic workplace emails</p>
                <ul className="text-xs text-gray-600 space-y-2 text-left">
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span>Simple requests and confirmations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span>Thank you notes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span>Team communications</span>
                  </li>
                </ul>
              </div>
            </button>

            {/* Medium */}
            <button
              onClick={() => setWritingDifficulty('Medium')}
              className="group bg-white hover:bg-gradient-to-br hover:from-amber-50 hover:to-yellow-50 rounded-2xl p-8 border-2 border-amber-200 hover:border-amber-400 transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-xl hover:shadow-amber-500/20"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">💼</span>
                </div>
                <h3 className="text-2xl font-bold text-amber-700 mb-3">Medium</h3>
                <p className="text-sm text-gray-600 mb-4">Professional communications</p>
                <ul className="text-xs text-gray-600 space-y-2 text-left">
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Client communications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Progress updates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Follow-up emails</span>
                  </li>
                </ul>
              </div>
            </button>

            {/* Hard */}
            <button
              onClick={() => setWritingDifficulty('Hard')}
              className="group bg-white hover:bg-gradient-to-br hover:from-rose-50 hover:to-red-50 rounded-2xl p-8 border-2 border-rose-200 hover:border-rose-400 transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-xl hover:shadow-rose-500/20"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-rose-700 mb-3">Hard</h3>
                <p className="text-sm text-gray-600 mb-4">Complex situations</p>
                <ul className="text-xs text-gray-600 space-y-2 text-left">
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">•</span>
                    <span>Conflict resolution</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">•</span>
                    <span>Leadership emails</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">•</span>
                    <span>Sensitive situations</span>
                  </li>
                </ul>
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Email Writing Session
  if (selectedType === 'writing' && writingDifficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
        <EmailWritingSession
          difficulty={writingDifficulty}
          onSessionComplete={() => {
            setWritingDifficulty(null)
            setShowPreferences(false)
            setSelectedType('speaking')
          }}
        />
      </div>
    )
  }

  // Skill Selection Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-3">Let's Communicate</h1>
          <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto px-4 font-medium">
            Choose a skill to practice. Our AI-powered system will provide personalized feedback and scoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {skillTypes.map((skill) => (
            <div
              key={skill.type}
              className={`bg-gradient-to-br ${skill.type === 'speaking'
                ? 'from-blue-500 to-indigo-600'
                : skill.type === 'reading'
                  ? 'from-purple-500 to-violet-600'
                  : skill.type === 'writing'
                    ? 'from-orange-500 to-amber-600'
                    : 'from-emerald-500 to-teal-600'
                } rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col h-full`}
              onClick={() => {
                setSelectedType(skill.type)
                setShowPreferences(true)
              }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="relative z-10 flex flex-col h-full uppercase-none">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-lg shrink-0">
                  <div className="text-white">
                    {skill.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 shrink-0">{skill.title}</h3>
                <p className="text-white/90 mb-6 leading-relaxed text-sm min-h-[40px] flex-grow">{skill.description}</p>

                <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-xs mb-6 shrink-0">
                  <div className="text-center p-1 rounded-lg bg-white/10">
                    <div className="font-bold text-white text-xs sm:text-sm">{skill.stats.questions}</div>
                    <div className="text-white/80 whitespace-nowrap overflow-hidden text-ellipsis">Questions</div>
                  </div>
                  <div className="text-center p-1 rounded-lg bg-white/10">
                    <div className="font-bold text-white text-xs sm:text-sm">{skill.stats.duration}</div>
                    <div className="text-white/80 whitespace-nowrap overflow-hidden text-ellipsis">Duration</div>
                  </div>
                  <div className="text-center p-1 rounded-lg bg-white/10">
                    <div className="font-bold text-white text-xs sm:text-sm">{skill.stats.level}</div>
                    <div className="text-white/80 whitespace-nowrap overflow-hidden text-ellipsis">Level</div>
                  </div>
                </div>

                {/* Monthly Limit Info */}
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2.5 mb-5 shrink-0 min-h-[48px] flex items-center justify-center">
                  <p className="text-white text-[10px] sm:text-xs font-semibold text-center leading-tight">{skill.limit}</p>
                </div>

                <button className="w-full bg-white text-gray-900 py-3 px-4 rounded-xl hover:bg-white/90 transition-colors font-bold shadow-lg mt-auto">
                  Start Practice
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-teal-100 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Play className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">1. Select & Start</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Choose your skill and begin the practice session with real IELTS-style questions.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">2. Practice & Record</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Answer questions with our recording system and receive real-time guidance.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">3. Get Feedback</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Receive detailed feedback and scoring to improve your performance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}