/**
 * Speech-to-Text Service
 * 
 * Handles audio transcription using OpenAI Whisper API (primary) 
 * with Google Cloud Speech-to-Text as fallback
 * 
 * Features:
 * - Multi-language support (English, Hindi, etc.)
 * - Error handling and retry logic
 * - File format conversion
 * - Confidence scoring
 */

// API Configuration
const API_PROXY_BASE = import.meta.env.VITE_API_PROXY_BASE || (typeof window !== 'undefined' && window.location && window.location.hostname.includes('rretoriq25.web.app') ? 'https://rretoriq-backend-api.vercel.app/api' : '/api')
const GEMINI_TRANSCRIBE_PROXY_URL = `${API_PROXY_BASE}/gemini-transcribe`
// Proxy will handle retries and rate limiting server-side if needed

// Supported languages
export type SupportedLanguage = 'en' | 'hi' | 'auto'

export interface TranscriptionOptions {
  language?: SupportedLanguage
  enableTimestamps?: boolean
  temperature?: number // 0-1, lower = more deterministic
}

export interface TranscriptionResult {
  transcript: string
  confidence: number
  success: boolean
  error?: string
  processingTime: number
  language?: string
  wordCount?: number
  duration?: number
}

class SpeechToTextService {
  constructor() {
    // No client-side API key required — we call the server-side whisper proxy
  }

  /**
   * Convert audio blob to format suitable for Whisper API
   * Whisper supports: mp3, mp4, mpeg, mpga, m4a, wav, webm
   * @param audioBlob - The recorded audio blob
   * @returns Promise<File> - Formatted audio file
   */
  private async prepareAudioFile(audioBlob: Blob): Promise<File> {
    // Whisper accepts webm directly, so we just need to create a File object
    const file = new File([audioBlob], 'recording.webm', {
      type: audioBlob.type || 'audio/webm'
    })

    console.log('🎵 Audio file prepared:', {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.type,
      maxSize: '25 MB'
    })

    // Validate file size (Whisper has 25MB limit)
    const MAX_SIZE = 25 * 1024 * 1024 // 25MB in bytes
    if (file.size > MAX_SIZE) {
      throw new Error(`Audio file too large: ${(file.size / 1024 / 1024).toFixed(2)} MB. Maximum: 25 MB`)
    }

    return file
  }

  /**
   * Transcribe audio using OpenAI Whisper API
   * @param audioBlob - The recorded audio blob
   * @param options - Optional transcription settings
   * @returns Promise<TranscriptionResult>
   */
  async transcribeWithWhisper(
    audioBlob: Blob,
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    const startTime = Date.now()
    const {
      language = 'en',
    } = options

    try {
      // Prepare audio file
      const audioFile = await this.prepareAudioFile(audioBlob)

      // Create form data
      const formData = new FormData()
      formData.append('file', audioFile)

      // Set language (use 'auto' for automatic detection)
      if (language !== 'auto') {
        formData.append('language', language)
      }

      console.log('🎤 Sending to Gemini transcription proxy...', {
        language: language === 'auto' ? 'auto-detect' : language,
        fileSize: `${(audioFile.size / 1024).toFixed(2)} KB`
      })

      // Upload to server-side whisper proxy (server holds OpenAI key)
      const response = await fetch(GEMINI_TRANSCRIBE_PROXY_URL, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }))
        console.error('❌ Gemini Transcription Error:', {
          status: response.status,
          error: errorData.error || errorData
        })

        // Provide specific error messages
        if (response.status === 413) {
          throw new Error('Audio file too large. Please record a shorter response (max 25MB)')
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again')
        }

        throw new Error(`Gemini transcription error: ${errorData.error?.message || errorData.error || response.statusText}`)
      }

      const data = await response.json()
      const processingTime = Date.now() - startTime

      console.log('📊 Gemini transcription response:', {
        hasText: !!data.text,
        textLength: data.text?.length || 0,
        processingTime: `${processingTime}ms`
      })

      if (!data.text || data.text.trim().length === 0) {
        return {
          transcript: '',
          confidence: 0,
          success: false,
          error: 'No speech detected in the audio. Please try speaking more clearly.',
          processingTime,
          wordCount: 0
        }
      }

      const transcript = data.text.trim()
      const wordCount = transcript.split(/\s+/).filter((w: string) => w.length > 0).length

      // Estimate confidence (Whisper doesn't provide direct confidence scores)
      // Use word count and duration as proxy
      const estimatedConfidence = this.estimateConfidence(wordCount)

      console.log('✅ Transcription successful:', {
        transcript: transcript.substring(0, 100) + (transcript.length > 100 ? '...' : ''),
        wordCount,
        confidence: estimatedConfidence,
      })

      return {
        transcript,
        confidence: estimatedConfidence,
        success: true,
        processingTime,
        wordCount
      }

    } catch (error) {
      const processingTime = Date.now() - startTime
      console.error('❌ Whisper transcription failed:', error)

      return {
        transcript: '',
        confidence: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during transcription',
        processingTime
      }
    }
  }

  /**
   * Estimate transcription confidence based on word count and duration
   * @param wordCount - Number of words transcribed
   * @param duration - Audio duration in seconds
   * @returns number - Confidence score (0-1)
   */
  private estimateConfidence(wordCount: number, duration?: number): number {
    if (!wordCount) return 0

    // Base confidence on word density (words per second)
    // Typical speech: 2-3 words per second
    const targetWPS = 2.5
    const actualWPS = duration ? wordCount / duration : targetWPS
    const wpsScore = Math.min(actualWPS / targetWPS, 1.5) / 1.5

    // Base confidence on absolute word count
    // More words generally = more confident transcription
    const wordCountScore = Math.min(wordCount / 50, 1)

    // Combine scores
    const confidence = (wpsScore * 0.6 + wordCountScore * 0.4)

    return Math.min(Math.max(confidence, 0.3), 0.95) // Clamp between 0.3 and 0.95
  }

  // retry/delay helpers removed; proxy fetch calls are used directly

  /**
   * Main transcription method (uses Whisper by default)
   * @param audioBlob - The recorded audio blob
   * @param options - Optional transcription settings
   * @returns Promise<TranscriptionResult>
   */
  async transcribeAudio(
    audioBlob: Blob,
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    console.log('🎯 Starting audio transcription pipeline...', {
      blobSize: `${(audioBlob.size / 1024).toFixed(2)} KB`,
      blobType: audioBlob.type,
      provider: 'OpenAI Whisper'
    })

    return this.transcribeWithWhisper(audioBlob, options)
  }

  /**
   * Check if audio recording is supported in browser
   * @returns boolean
   */
  static isAudioRecordingSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  }

  /**
   * Get optimal audio recording constraints for speech recognition
   * @returns MediaStreamConstraints
   */
  static getAudioConstraints(): MediaStreamConstraints {
    return {
      audio: {
        channelCount: 1, // Mono audio (sufficient for speech)
        sampleRate: 48000, // High quality
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      }
    }
  }

  /**
   * Check if service is properly configured
   * @returns boolean
   */
  isConfigured(): boolean {
    // Consider configured if a proxy base is available (defaults to /api)
    return !!API_PROXY_BASE
  }

  /**
   * Get supported audio formats
   * @returns string[]
   */
  static getSupportedFormats(): string[] {
    return [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/mp4',
      'audio/mpeg',
      'audio/wav',
      'audio/m4a'
    ]
  }
}

// Export singleton instance
export const speechToTextService = new SpeechToTextService()
export default speechToTextService
