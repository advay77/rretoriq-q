import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Play,
  Mic,
  Target,
  Users,
  ArrowRight,
  Headphones,
  MessageSquare,
  BarChart3,
  CheckCircle,
  Lock,
  Sparkles,
  Square,
  Loader2,
  Clock,
  Volume2,
  MicOff
} from 'lucide-react'
import SEO, { seoData } from '../components/SEO'
import { speechToTextService } from '../services/speechToTextService'
import { openAIAnalysisService } from '../services/openAIAnalysisService'
import type { AnswerAnalysis, InterviewQuestion } from '../services/openAIAnalysisService'

interface DemoState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  transcript: string
  isAnalyzing: boolean
  analysis: AnswerAnalysis | null
  audioBlob: Blob | null
  isTranscribing: boolean
  error: string | null
}

const Demo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'communication' | 'interview' | null>(null)
  const [demoState, setDemoState] = useState<DemoState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    transcript: '',
    isAnalyzing: false,
    analysis: null,
    audioBlob: null,
    isTranscribing: false,
    error: null
  })

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const audioChunksRef = React.useRef<Blob[]>([])
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  const communicationQuestions: InterviewQuestion[] = [
    {
      id: 'comm-demo-1',
      question: 'Present your ideas on improving team collaboration in a remote work environment.',
      type: 'behavioral',
      difficulty: 'medium',
      skills: ['Communication', 'Leadership', 'Problem-solving', 'Teamwork'],
      expectedDuration: 120,
      category: 'Professional Communication'
    },
    {
      id: 'comm-demo-2',
      question: 'Explain a complex idea to a non-technical audience in under two minutes.',
      type: 'behavioral',
      difficulty: 'medium',
      skills: ['Clarity', 'Storytelling', 'Audience awareness'],
      expectedDuration: 120,
      category: 'Professional Communication'
    },
    {
      id: 'comm-demo-3',
      question: 'Handle a stakeholder disagreement during a presentation and keep the room aligned.',
      type: 'behavioral',
      difficulty: 'medium',
      skills: ['Conflict resolution', 'Executive presence', 'Influence'],
      expectedDuration: 120,
      category: 'Professional Communication'
    },
    {
      id: 'comm-demo-4',
      question: 'Deliver a concise project update highlighting risks, blockers, and next steps.',
      type: 'behavioral',
      difficulty: 'medium',
      skills: ['Conciseness', 'Risk communication', 'Prioritization'],
      expectedDuration: 120,
      category: 'Professional Communication'
    }
  ]

  const communicationQuestion = communicationQuestions[0]

  const interviewQuestion: InterviewQuestion = {
    id: 'interview-demo-1',
    question: "Tell me about yourself and your background.",
    type: 'behavioral',
    difficulty: 'easy',
    skills: ['Self-presentation', 'Communication', 'Career narrative'],
    expectedDuration: 90,
    category: 'Interview Practice'
  }

  // Recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setDemoState(prev => ({ ...prev, audioBlob, isTranscribing: true }))

        // Start transcription
        const transcriptionResult = await speechToTextService.transcribeAudio(audioBlob)

        if (transcriptionResult.success) {
          setDemoState(prev => ({
            ...prev,
            transcript: transcriptionResult.transcript,
            isTranscribing: false,
            isAnalyzing: true
          }))

          // Start AI analysis
          const question = activeDemo === 'communication' ? communicationQuestion : interviewQuestion
          const analysisResult = await openAIAnalysisService.analyzeAnswer({
            transcript: transcriptionResult.transcript,
            question,
            audioDuration: demoState.duration,
            transcriptionConfidence: transcriptionResult.confidence
          })

          setDemoState(prev => ({
            ...prev,
            analysis: analysisResult,
            isAnalyzing: false
          }))
        } else {
          setDemoState(prev => ({
            ...prev,
            error: transcriptionResult.error || 'Transcription failed',
            isTranscribing: false
          }))
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setDemoState(prev => ({ ...prev, isRecording: true, error: null }))

      // Start timer
      timerRef.current = setInterval(() => {
        setDemoState(prev => ({ ...prev, duration: prev.duration + 1 }))
      }, 1000)

    } catch (error) {
      setDemoState(prev => ({
        ...prev,
        error: 'Could not access microphone. Please check permissions.',
        isRecording: false
      }))
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && demoState.isRecording) {
      mediaRecorderRef.current.stop()
      setDemoState(prev => ({ ...prev, isRecording: false }))
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const resetDemo = () => {
    setDemoState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      transcript: '',
      isAnalyzing: false,
      analysis: null,
      audioBlob: null,
      isTranscribing: false,
      error: null
    })
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  // Reset demo state when switching between demo types
  useEffect(() => {
    resetDemo()
  }, [activeDemo])

  return (
    <>
      <SEO {...seoData.demo} />
      <div className="min-h-screen bg-white text-gray-900">
        {/* Hero Section */}
        <section className="pt-20 pb-12 px-4">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium border border-indigo-100">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Demo</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
              Experience{' '}
              <span className="font-medium text-indigo-600">
                Rretoriq
              </span>
              {' '}in action
            </h1>

            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Try our AI-powered communication coach with real examples.
              See how we help professionals master communication skills and ace interviews.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <button
                onClick={() => setActiveDemo('communication')}
                className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium text-base transition-all duration-300 ${activeDemo === 'communication'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Target className="w-5 h-5" />
                <span>Communication Skills</span>
              </button>

              <button
                onClick={() => setActiveDemo('interview')}
                className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium text-base transition-all duration-300 ${activeDemo === 'interview'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Users className="w-5 h-5" />
                <span>Interview Practice</span>
              </button>
            </div>
          </div>
        </section>

        {/* Demo Content */}
        <section className="pb-24 px-4">
          <div className="max-w-6xl mx-auto">
            {activeDemo === null && (
              <div className="text-center py-14 space-y-6">
                <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto">
                  <Sparkles className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Choose Your Practice Mode
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Select either Communication Skills or Interview Practice above to experience our AI-powered training platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setActiveDemo('communication')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-medium text-base transition-all hover:shadow-lg hover:shadow-indigo-600/25"
                  >
                    Try Communication Skills
                  </button>
                  <button
                    onClick={() => setActiveDemo('interview')}
                    className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-2xl font-medium text-base transition-all hover:bg-gray-50"
                  >
                    Try Interview Practice
                  </button>
                </div>
              </div>
            )}

            {activeDemo === 'communication' && (
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">Professional Communication Training</h3>
                    <p className="text-gray-600 font-light">Presentation & Professional Speaking Skills</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Question Card */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">Sample Questions</h4>
                      <div className={`rounded-2xl p-4 ${demoState.isRecording ? 'bg-red-50 border-2 border-red-200' : 'bg-gray-50'}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="space-y-3 text-gray-900 font-medium">
                            {communicationQuestions.map((q, idx) => (
                              <div
                                key={q.id}
                                className="rounded-xl border border-gray-200 bg-white/70 px-4 py-3 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
                              >
                                <div className="flex items-start gap-3">
                                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold border border-indigo-100">
                                    {idx + 1}
                                  </span>
                                  <div className="space-y-1">
                                    <p className="leading-snug text-gray-900">{q.question}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {demoState.isRecording && (
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-red-600 text-sm font-medium">Recording...</span>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="font-medium">Focus on:</p>
                          <ul className="list-disc list-inside ml-4 space-y-1 text-gray-500 font-light">
                            <li>Clear structure and logical flow</li>
                            <li>Professional vocabulary and tone</li>
                            <li>Practical examples and solutions</li>
                            <li>Confident delivery and body language</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Headphones className="w-4 h-4" />
                          <span className="text-sm font-light">Listen to example</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Mic className="w-4 h-4" />
                          <span className="text-sm font-light">Record your answer</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-xl">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <span className="text-lg font-mono text-gray-900">{formatTime(demoState.duration)}</span>
                      </div>

                      {!demoState.isRecording && !demoState.transcript ? (
                        <button
                          onClick={startRecording}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 transition-all hover:shadow-lg hover:shadow-indigo-600/25"
                        >
                          <Mic className="w-5 h-5" />
                          <span>Start Recording</span>
                        </button>
                      ) : demoState.isRecording ? (
                        <button
                          onClick={stopRecording}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 transition-all hover:shadow-lg hover:shadow-red-600/25"
                        >
                          <Square className="w-5 h-5" />
                          <span>Stop Recording</span>
                        </button>
                      ) : (
                        <button
                          onClick={resetDemo}
                          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 transition-all hover:shadow-lg hover:shadow-gray-600/25"
                        >
                          <Play className="w-5 h-5" />
                          <span>Try Again</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* AI Feedback Preview */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                        <span>AI Analysis</span>
                      </h4>

                      {demoState.error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                          <p className="text-red-700 text-sm">{demoState.error}</p>
                        </div>
                      )}

                      {demoState.isTranscribing && (
                        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                          <span className="text-blue-700">Converting speech to text...</span>
                        </div>
                      )}

                      {demoState.transcript && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                          <h5 className="text-gray-700 font-medium mb-2">Your Response:</h5>
                          <p className="text-gray-900 text-sm">{demoState.transcript}</p>
                        </div>
                      )}

                      {demoState.isAnalyzing && (
                        <div className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg">
                          <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                          <span className="text-indigo-700">Analyzing your response...</span>
                        </div>
                      )}

                      {demoState.analysis && (
                        <div className="space-y-4">
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                            <h5 className="text-emerald-700 font-medium mb-2">Strengths</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                              {demoState.analysis.feedback.strengths.map((strength, idx) => (
                                <li key={idx} className="flex items-start space-x-2">
                                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <h5 className="text-orange-700 font-medium mb-2">Areas for Improvement</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                              {demoState.analysis.feedback.suggestions.map((suggestion, idx) => (
                                <li key={idx}>• {suggestion}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h5 className="text-blue-700 font-medium mb-2">Overall Score</h5>
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold text-gray-900">{demoState.analysis.overallScore}</span>
                              <span className="text-gray-600">/100</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-lg font-semibold text-gray-900">{demoState.analysis.scores.clarity}</div>
                              <div className="text-xs text-gray-600">Clarity</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-lg font-semibold text-gray-900">{demoState.analysis.scores.relevance}</div>
                              <div className="text-xs text-gray-600">Relevance</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {!demoState.transcript && !demoState.isRecording && !demoState.isTranscribing && (
                        <div className="text-center p-8 text-gray-500">
                          <Volume2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p>Start recording to see real-time AI analysis</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2 text-indigo-700 mb-2">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm font-medium">Unlock Full Features</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">Get detailed feedback, grammar analysis, and personalized communication improvement plans.</p>
                      <Link to="/register" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1">
                        <span>Get Premium Access</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDemo === 'interview' && (
              <div className="bg-purple-50 rounded-3xl p-8 border border-purple-200">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">Interview Practice Session</h3>
                    <p className="text-gray-600 font-light">Software Engineer Position - Behavioral Questions</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Question Interface */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Current Question</h4>
                      <div className={`rounded-lg p-4 mb-4 ${demoState.isRecording ? 'bg-red-50 border-2 border-red-200' : 'bg-purple-50'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-gray-900 font-medium">{interviewQuestion.question}</p>
                          {demoState.isRecording && (
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-red-600 text-sm font-medium">Recording...</span>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>💡 Tips: Structure your answer using the STAR method (Situation, Task, Action, Result)</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm">30 second prep time</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Mic className="w-4 h-4" />
                          <span className="text-sm">2 minute response</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-4 p-4 bg-purple-50 rounded-xl">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <span className="text-lg font-mono text-gray-900">{formatTime(demoState.duration)}</span>
                      </div>

                      {!demoState.isRecording && !demoState.transcript ? (
                        <button
                          onClick={startRecording}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 transition-all hover:shadow-lg hover:shadow-purple-600/25"
                        >
                          <Mic className="w-5 h-5" />
                          <span>Start Recording</span>
                        </button>
                      ) : demoState.isRecording ? (
                        <button
                          onClick={stopRecording}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 transition-all hover:shadow-lg hover:shadow-red-600/25"
                        >
                          <Square className="w-5 h-5" />
                          <span>Stop Recording</span>
                        </button>
                      ) : (
                        <button
                          onClick={resetDemo}
                          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 transition-all hover:shadow-lg hover:shadow-gray-600/25"
                        >
                          <Play className="w-5 h-5" />
                          <span>Try Again</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Interview Analysis */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        <span>Interview Analysis</span>
                      </h4>

                      {demoState.error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                          <p className="text-red-700 text-sm">{demoState.error}</p>
                        </div>
                      )}

                      {demoState.isTranscribing && (
                        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                          <span className="text-blue-700">Converting speech to text...</span>
                        </div>
                      )}

                      {demoState.transcript && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                          <h5 className="text-gray-700 font-medium mb-2">Your Response:</h5>
                          <p className="text-gray-900 text-sm">{demoState.transcript}</p>
                        </div>
                      )}

                      {demoState.isAnalyzing && (
                        <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                          <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                          <span className="text-purple-700">Analyzing your interview response...</span>
                        </div>
                      )}

                      {demoState.analysis && (
                        <div className="space-y-4">
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                            <h5 className="text-emerald-700 font-medium mb-2">Communication Skills</h5>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${demoState.analysis.scores.clarity}%` }}></div>
                              </div>
                              <span className="text-sm text-gray-600">{demoState.analysis.scores.clarity}%</span>
                            </div>
                            <p className="text-sm text-gray-700">{demoState.analysis.feedback.strengths[0] || 'Clear communication'}</p>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h5 className="text-blue-700 font-medium mb-2">Content Quality</h5>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${demoState.analysis.scores.relevance}%` }}></div>
                              </div>
                              <span className="text-sm text-gray-600">{demoState.analysis.scores.relevance}%</span>
                            </div>
                            <p className="text-sm text-gray-700">{demoState.analysis.feedback.suggestions[0] || 'Good content structure'}</p>
                          </div>

                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <h5 className="text-purple-700 font-medium mb-2">Overall Score</h5>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${demoState.analysis.overallScore}%` }}></div>
                              </div>
                              <span className="text-sm text-gray-600">{demoState.analysis.overallScore}/100</span>
                            </div>
                            <p className="text-sm text-gray-700">{demoState.analysis.feedback.detailedFeedback.substring(0, 100)}...</p>
                          </div>
                        </div>
                      )}

                      {!demoState.transcript && !demoState.isRecording && !demoState.isTranscribing && (
                        <div className="text-center p-8 text-gray-500">
                          <MicOff className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p>Start recording to see real-time interview analysis</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2 text-purple-700 mb-2">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm font-medium">Premium Features</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">Get company-specific questions, detailed body language analysis, and personalized interview strategies.</p>
                      <Link to="/register" className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1">
                        <span>Upgrade to Premium</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 leading-tight">
              Ready to{' '}
              <span className="font-medium text-indigo-600">
                transform
              </span>
              {' '}your communication?
            </h2>

            <p className="text-lg text-gray-600 mb-8 font-light">
              Join thousands of professionals who have advanced their careers with AI-powered training.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-medium text-base transition-all hover:shadow-lg hover:shadow-gray-900/25"
              >
                Start Premium Practice
              </Link>
              <Link
                to="/pricing"
                className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-2xl font-medium text-base transition-all hover:bg-gray-50"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Demo