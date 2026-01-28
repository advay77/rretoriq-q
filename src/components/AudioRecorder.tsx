/**
 * AudioRecorder Component
 * 
 * A comprehensive audio recording component for interview responses
 * Integrates with Speech-to-Text and provides real-time feedback
 */

import React, { useState, useRef, useEffect } from 'react'
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Upload,
  Volume2,
  AlertCircle,

  Loader2,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'
import { speechToTextService, type TranscriptionResult } from '../services/speechToTextService'
import { type AnswerAnalysis, type InterviewQuestion } from '../services/geminiAnalysisService'
import { staticFeedbackService } from '../services/staticFeedbackService'

interface AudioRecorderProps {
  question: InterviewQuestion
  onAnalysisComplete?: (analysis: AnswerAnalysis) => void | Promise<void>
  onTranscriptionComplete?: (result: TranscriptionResult) => void
  maxDuration?: number // in seconds, default 300 (5 minutes)
  autoStop?: boolean // auto-stop when max duration reached
  className?: string
  showTranscription?: boolean // whether to display the transcription text (default: true)
}

type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped' | 'processing' | 'completed'

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  question,
  onAnalysisComplete,
  onTranscriptionComplete,
  maxDuration = 300,
  autoStop = true,
  className = '',
  showTranscription = true
}) => {
  // Recording state management
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioURL, setAudioURL] = useState<string | null>(null)

  // Analysis state
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisFeedback, setAnalysisFeedback] = useState<string>('')

  // Audio visualization


  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const animationRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const audioLevelRef = useRef<{ maxRms: number; sumRms: number; frames: number }>({
    maxRms: 0,
    sumRms: 0,
    frames: 0
  })

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording()
      if (timerRef.current) clearInterval(timerRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (audioURL) URL.revokeObjectURL(audioURL)
    }
  }, [audioURL])

  /**
   * Initialize audio recording with optimal settings
   */
  const initializeRecording = async (): Promise<MediaStream | null> => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Audio recording not supported in this browser')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 48000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      })

      mediaStreamRef.current = stream

      // Set up audio visualization
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      analyserRef.current.fftSize = 2048

      // Start visualization loop handled by useEffect

      return stream
    } catch (error) {
      console.error('Failed to initialize recording:', error)
      return null
    }
  }


  /**
   * Handle audio visualization with Canvas
   */
  useEffect(() => {
    if (recordingState === 'recording' && analyserRef.current && canvasRef.current) {
      setError(null) // Clear error when recording starts
      const canvas = canvasRef.current
      const canvasCtx = canvas.getContext('2d')
      const analyser = analyserRef.current

      if (!canvasCtx) return

      // Configuration for the bars
      const BAR_WIDTH = 4
      const BAR_GAP = 2
      const TOTAL_BAR_WIDTH = BAR_WIDTH + BAR_GAP
      const MAX_BARS = Math.ceil(canvas.width / TOTAL_BAR_WIDTH)

      // Use a ref to store the amplitude history so it persists across renders
      // We attach it to the canvas element for convenience or use a mutable variable
      // Since we are inside useEffect, a local mutable array is fine IF we didn't need it to persist 
      // between different effect calls. But recordingState changes trigger re-run.
      // We want to reset when recording starts anyway.
      const amplitudeHistory: number[] = new Array(MAX_BARS).fill(0)

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const draw = () => {
        animationRef.current = requestAnimationFrame(draw)

        // Get fresh time domain data (waveform)
        analyser.getByteTimeDomainData(dataArray)

        // Calculate RMS (Root Mean Square) volume for this frame
        let sumSquares = 0
        for (let i = 0; i < bufferLength; i++) {
          const normalized = (dataArray[i] - 128) / 128
          sumSquares += normalized * normalized
        }
        const rms = Math.sqrt(sumSquares / bufferLength)

        audioLevelRef.current.sumRms += rms
        audioLevelRef.current.frames += 1
        if (rms > audioLevelRef.current.maxRms) {
          audioLevelRef.current.maxRms = rms
        }

        // Boost the signal a bit to make it look good
        const amplifiedVolume = Math.min(rms * 4, 1) // Cap at 1.0

        // Add new value to history
        amplitudeHistory.push(amplifiedVolume)

        // Remove old values to keep the flowing effect
        if (amplitudeHistory.length > MAX_BARS) {
          amplitudeHistory.shift()
        }

        // DRAWING
        canvasCtx.fillStyle = '#FAFAFA' // Match the bg color or clear
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

        // Create gradient
        const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, '#6366f1') // Indigo 500
        gradient.addColorStop(0.5, '#ec4899') // Pink 500
        gradient.addColorStop(1, '#6366f1') // Indigo 500

        canvasCtx.fillStyle = gradient

        // Draw bars
        // We draw from right to left so the newest is on the right
        // actually standard array order: index 0 is left (oldest), index len is right (newest)
        // This creates a "scrolling left" effect
        amplitudeHistory.forEach((amp, index) => {
          // Calculate bar height based on amplitude
          // Min height 2px so it's always visible
          const h = Math.max(canvas.height * amp * 0.9, 4)

          // Center vertically
          const y = (canvas.height - h) / 2
          const x = index * TOTAL_BAR_WIDTH

          // Draw rounded bar
          canvasCtx.beginPath()
          canvasCtx.roundRect(x, y, BAR_WIDTH, h, 4)
          canvasCtx.fill()
        })
      }

      draw()
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [recordingState])

  /**
   * Start recording audio
   */
  const startRecording = async () => {
    const stream = await initializeRecording()
    if (!stream) return

    try {
      audioLevelRef.current = { maxRms: 0, sumRms: 0, frames: 0 }

      // Check supported MIME types and choose the best one
      let mimeType = 'audio/webm;codecs=opus'
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.warn('WEBM with Opus not supported, trying alternatives...')
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm'
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4'
        } else {
          mimeType = '' // Let browser choose
        }
      }

      console.log('🎙️ Using MIME type:', mimeType)

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)

      const audioChunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: mimeType || 'audio/webm' })
        console.log('🎵 Audio blob created:', {
          size: blob.size,
          type: blob.type,
          duration: duration
        })
        setAudioBlob(blob)
        setAudioURL(URL.createObjectURL(blob))
        setRecordingState('stopped')

        // Clean up stream
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder

      setRecordingState('recording')
      setDuration(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1

          // Auto-stop if max duration reached
          if (autoStop && newDuration >= maxDuration) {
            stopRecording()
            return maxDuration
          }

          return newDuration
        })
      }, 1000)

    } catch (error) {
      console.error('Failed to start recording:', error)
      stream.getTracks().forEach(track => track.stop())
    }
  }

  /**
   * Pause/resume recording
   */
  const togglePauseRecording = () => {
    if (!mediaRecorderRef.current) return

    if (recordingState === 'recording') {
      mediaRecorderRef.current.pause()
      setRecordingState('paused')
      if (timerRef.current) clearInterval(timerRef.current)
    } else if (recordingState === 'paused') {
      mediaRecorderRef.current.resume()
      setRecordingState('recording')

      // Resume timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1
          if (autoStop && newDuration >= maxDuration) {
            stopRecording()
            return maxDuration
          }
          return newDuration
        })
      }, 1000)
    }
  }

  /**
   * Stop recording
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }


  }

  /**
   * Reset recording session
   */
  const resetRecording = () => {
    stopRecording()

    if (audioURL) {
      URL.revokeObjectURL(audioURL)
    }

    setRecordingState('idle')
    setDuration(0)
    setAudioBlob(null)
    setAudioURL(null)
    setTranscriptionResult(null)
    setIsAnalyzing(false)
    setError(null)
    setAnalysisFeedback('')

    audioLevelRef.current = { maxRms: 0, sumRms: 0, frames: 0 }

  }

  /**
   * Process the recorded audio (transcription + analysis)
   */
  const processAudio = async () => {
    if (!audioBlob) {
      console.error('❌ No audio blob available for processing')
      return
    }

    console.log('🎯 Starting audio processing pipeline...')
    setRecordingState('processing')
    setIsAnalyzing(true)
    setError(null)

    try {
      // Step 1: Try to transcribe (optional - won't fail if this fails)
      setAnalysisFeedback('🎤 Transcribing your audio...')
      let transcriptText = ''

      try {
        const transcription = await speechToTextService.transcribeAudio(audioBlob)
        setTranscriptionResult(transcription)
        onTranscriptionComplete?.(transcription)

        if (transcription.success && transcription.transcript) {
          transcriptText = transcription.transcript
          console.log('✅ Transcription successful:', transcriptText.substring(0, 50) + '...')
        } else {
          console.warn('⚠️ Transcription failed, continuing with empty transcript')
        }
      } catch (transcriptionError) {
        console.warn('⚠️ Transcription error (continuing anyway):', transcriptionError)
      }

      // Step 2: Analyze audio metrics (works with or without transcript)
      setAnalysisFeedback('📊 Analyzing your response...')
      const audioMetrics = staticFeedbackService.analyzeAudioMetrics(
        audioBlob,
        duration,
        transcriptText,
        audioLevelRef.current
      )

      // Step 3: Generate static feedback (ALWAYS happens)
      const analysis = staticFeedbackService.generateFeedback(audioMetrics)

      console.log('✅ Static feedback generated:', {
        scenario: audioMetrics.hasVoice ? (audioMetrics.duration < 5 ? 'short' : 'good') : 'no-voice',
        score: analysis.overallScore,
        duration: audioMetrics.duration,
        wordCount: audioMetrics.wordCount,
        hasTranscript: transcriptText.length > 0
      })

      onAnalysisComplete?.(analysis)
      setAnalysisFeedback('✅ Analysis complete!')
      setRecordingState('completed')

    } catch (error) {
      console.error('❌ Critical error in audio processing:', error)
      setError('Failed to process audio. Please try again.')
      setRecordingState('stopped')
    } finally {
      setIsAnalyzing(false)
    }
  }

  /**
   * Format duration display
   */
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * Get recording state color
   */
  const getStateColor = (): string => {
    switch (recordingState) {
      case 'recording': return 'text-red-600'
      case 'paused': return 'text-yellow-600'
      case 'stopped': return 'text-blue-600'
      case 'processing': return 'text-purple-600'
      case 'completed': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Record Your Answer</h3>
        <div className={`flex items-center space-x-2 ${getStateColor()}`}>
          <Clock className="w-4 h-4" />
          <span className="font-mono text-sm">{formatDuration(duration)}</span>
          <span className="text-xs capitalize">({recordingState})</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-red-800">Recording Analysis Failed</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Audio Waveform Visualization */}
      {recordingState === 'recording' && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Volume2 className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span className="text-sm font-medium text-gray-700">Recording...</span>
          </div>
          <div className="w-full h-24 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden relative">
            <canvas
              ref={canvasRef}
              width={600}
              height={100}
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        {recordingState === 'idle' && (
          <button
            onClick={startRecording}
            className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Mic className="w-5 h-5" />
            <span>Start Recording</span>
          </button>
        )}

        {(recordingState === 'recording' || recordingState === 'paused') && (
          <>
            <button
              onClick={togglePauseRecording}
              className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              {recordingState === 'recording' ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              <Square className="w-5 h-5" />
              <span>Stop</span>
            </button>
          </>
        )}

        {recordingState === 'stopped' && (
          <>
            <button
              onClick={processAudio}
              disabled={isAnalyzing}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              <span>{isAnalyzing ? 'Processing...' : 'Analyze Answer'}</span>
            </button>

            <button
              onClick={resetRecording}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </button>
          </>
        )}

        {recordingState === 'processing' && (
          <div className="w-full mt-4">
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-blue-700">{analysisFeedback || 'Processing your response...'}</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width: analysisFeedback ? `${Math.min(100, (analysisFeedback.split('...').length / 5) * 100)}%` : '0%'
                }}
              ></div>
            </div>
          </div>
        )}

        {recordingState === 'completed' && (
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-green-700 font-medium">Analysis Complete!</span>
            <button
              onClick={resetRecording}
              className="ml-4 flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Record Again</span>
            </button>
          </div>
        )}
      </div>

      {/* Audio Playback */}
      {audioURL && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Your Recording</h4>
          <audio controls className="w-full" src={audioURL} />
        </div>
      )}

      {/* Transcription Display - Non-editable (only shown if showTranscription is true) */}
      {showTranscription && transcriptionResult && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-medium text-gray-700">Your Answer Transcription</h4>
              {transcriptionResult.success ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>Confidence: {Math.round(transcriptionResult.confidence * 100)}%</span>
              <span>•</span>
              <span>Words: {transcriptionResult.transcript.split(' ').length}</span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">T</span>
                </div>
              </div>
              <div className="flex-1">
                {transcriptionResult.success ? (
                  <>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Transcribed Text</h5>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                      <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap select-text">
                        {transcriptionResult.transcript}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 italic">
                      {recordingState === 'completed'
                        ? '✅ This transcription has been analyzed. It will remain visible until you proceed to the next question.'
                        : 'This transcription will be sent to AI for analysis. It cannot be edited.'}
                    </p>
                  </>
                ) : (
                  <div className="text-red-600 text-sm">
                    <h5 className="font-medium mb-1">Transcription Error</h5>
                    <p>{transcriptionResult.error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Information */}
      <div className="text-xs text-gray-500 text-center">
        Maximum recording duration: {formatDuration(maxDuration)} •
        Question type: {question.type} •
        Expected duration: {formatDuration(Math.min(question.expectedDuration, maxDuration))}
      </div>
    </div>
  )
}

export default AudioRecorder
