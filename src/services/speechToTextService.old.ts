/**
 * Speech-to-Text Service
 * 
 * This service handles audio transcription using OpenAI Whisper API
 * Optimized for interview scenarios with multi-language support
 * Falls back to Google Cloud Speech-to-Text if configured
 */

// OpenAI Whisper API configuration (Primary)
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''
const WHISPER_API_URL = 'https://api.openai.com/v1/audio/transcriptions'

// Google Cloud Speech-to-Text API configuration (Fallback)
const GOOGLE_SPEECH_API_KEY = import.meta.env.VITE_GOOGLE_SPEECH_API_KEY || ''
const SPEECH_API_URL = 'https://speech.googleapis.com/v1/speech:recognize'

// Configuration flags
const PREFER_WHISPER = import.meta.env.VITE_PREFER_WHISPER !== 'false'
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'

// Silence unused variable warnings in this legacy file (kept for reference)
void OPENAI_API_KEY
void WHISPER_API_URL
void PREFER_WHISPER
void DEV_MODE

export interface SpeechRecognitionConfig {
  encoding: 'WEBM_OPUS' | 'LINEAR16' | 'FLAC' | 'MP3'
  sampleRateHertz: number
  languageCode: string
  enableAutomaticPunctuation: boolean
  enableWordTimeOffsets: boolean
  model: string
  useEnhanced: boolean
}

export interface SpeechRecognitionRequest {
  config: SpeechRecognitionConfig
  audio: {
    content: string // Base64 encoded audio
  }
}

export interface SpeechRecognitionResponse {
  results: Array<{
    alternatives: Array<{
      transcript: string
      confidence: number
      words?: Array<{
        startTime: string
        endTime: string
        word: string
      }>
    }>
  }>
}

export interface TranscriptionResult {
  transcript: string
  confidence: number
  success: boolean
  error?: string
  processingTime: number
}

class SpeechToTextService {
  private apiKey: string
  private apiUrl: string

  constructor() {
    this.apiKey = GOOGLE_SPEECH_API_KEY
    this.apiUrl = SPEECH_API_URL
  }

  /**
   * Convert audio blob to base64 string for API submission
   * @param audioBlob - The recorded audio blob
   * @returns Promise<string> - Base64 encoded audio data
   */
  private async audioToBase64(audioBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Remove the data URL prefix (data:audio/webm;base64,)
        const base64Data = result.split(',')[1]
        resolve(base64Data)
      }
      reader.onerror = reject
      reader.readAsDataURL(audioBlob)
    })
  }

  /**
   * Get optimal speech recognition configuration for interviews
   * @param audioFormat - The format of the recorded audio
   * @param sampleRate - Sample rate of the audio (default: 48000)
   * @returns SpeechRecognitionConfig
   */
  private getSpeechConfig(
    audioFormat: 'WEBM_OPUS' | 'LINEAR16' = 'WEBM_OPUS',
    sampleRate: number = 48000
  ): SpeechRecognitionConfig {
    return {
      encoding: audioFormat,
      sampleRateHertz: sampleRate,
      languageCode: 'en-US',
      enableAutomaticPunctuation: true,
      enableWordTimeOffsets: false, // Disable for faster processing in interviews
      model: 'latest_long', // Best model for natural, conversational speech
      useEnhanced: true, // Use enhanced model for better accuracy
    }
  }

  /**
   * Transcribe audio using Google Cloud Speech-to-Text API
   * @param audioBlob - The recorded audio blob
   * @param options - Optional configuration overrides
   * @returns Promise<TranscriptionResult>
   */
  async transcribeAudio(
    audioBlob: Blob,
    options?: Partial<SpeechRecognitionConfig>
  ): Promise<TranscriptionResult> {
    const startTime = Date.now()

    try {
      // Convert audio to base64
      const audioContent = await this.audioToBase64(audioBlob)

      // Get speech recognition configuration
      const config = {
        ...this.getSpeechConfig(),
        ...options
      }

      // Prepare the request payload
      const requestPayload: SpeechRecognitionRequest = {
        config,
        audio: {
          content: audioContent
        }
      }

      console.log('🎤 Starting speech transcription...', {
        audioSize: audioBlob.size,
        audioType: audioBlob.type,
        config: config
      })

      // Make API request to Google Cloud Speech-to-Text
      console.log('📡 Making request to Google Speech API...', {
        url: `${this.apiUrl}?key=${this.apiKey.substring(0, 10)}...`,
        payloadSize: JSON.stringify(requestPayload).length
      })

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      })

      console.log('📡 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ Google Speech API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          apiUrl: `${this.apiUrl}?key=${this.apiKey.substring(0, 10)}...`,
          requestSize: audioContent.length,
          currentOrigin: window.location.origin
        })
        
        if (response.status === 403) {
          throw new Error(`Speech API access denied (403). This is likely due to API key restrictions. Please add "${window.location.origin}" to your Google Cloud Console API key's HTTP referrer restrictions.`)
        }
        
        throw new Error(`Speech API error: ${response.status} - ${errorData.error?.message || response.statusText}`)
      }

      const data: SpeechRecognitionResponse = await response.json()
      const processingTime = Date.now() - startTime
      
      console.log('📊 Speech API response data:', {
        hasResults: !!data.results,
        resultsCount: data.results?.length || 0,
        processingTime
      })

      // Extract the best transcript and confidence
      if (!data.results || data.results.length === 0) {
        return {
          transcript: '',
          confidence: 0,
          success: false,
          error: 'No speech detected in the audio',
          processingTime
        }
      }

      const bestResult = data.results[0]
      const bestAlternative = bestResult.alternatives[0]

      if (!bestAlternative) {
        return {
          transcript: '',
          confidence: 0,
          success: false,
          error: 'No transcription alternatives found',
          processingTime
        }
      }

      const finalTranscript = bestAlternative.transcript.trim()
      console.log('✅ Speech transcription successful', {
        transcript: finalTranscript,
        transcriptLength: finalTranscript.length,
        confidence: bestAlternative.confidence,
        processingTime: `${processingTime}ms`
      })

      return {
        transcript: finalTranscript,
        confidence: bestAlternative.confidence || 0,
        success: true,
        processingTime
      }

    } catch (error) {
      const processingTime = Date.now() - startTime
      console.error('❌ Speech transcription failed:', error)

      return {
        transcript: '',
        confidence: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        processingTime
      }
    }
  }

  /**
   * Check if the browser supports audio recording
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
        channelCount: 1, // Mono audio
        sampleRate: 48000, // High quality sample rate
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      }
    }
  }
}

// Export singleton instance
export const speechToTextService = new SpeechToTextService()
export default speechToTextService