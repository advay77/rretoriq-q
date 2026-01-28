/**
 * Google Gemini AI Analysis Service
 * 
 * Analyzes interview answers using Google's Gemini 1.5 models
 * Much more cost-effective than OpenAI GPT-4 (~99% cheaper)
 * 
 * Pricing (as of 2025):
 * - Gemini 1.5 Flash: ~$0.0001 per analysis (recommended)
 * - Gemini 1.5 Pro: ~$0.001 per analysis (higher quality)
 */

// Proxy configuration - call server-side proxy which holds API keys
const API_PROXY_BASE = import.meta.env.VITE_API_PROXY_BASE || (typeof window !== 'undefined' && window.location && window.location.hostname.includes('rretoriq25.web.app') ? 'https://rretoriq-backend-api.vercel.app/api' : '/api')
const GEMINI_PROXY_URL = `${API_PROXY_BASE}/gemini-proxy`

// Gemini model (still configurable client-side, but key lives on server)
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash-exp'

export interface InterviewQuestion {
  id: string
  question: string
  type: 'behavioral' | 'technical' | 'situational' | 'case-study'
  difficulty: 'easy' | 'medium' | 'hard'
  skills: string[]
  expectedDuration: number // in seconds
  category: string
}

export interface AnswerAnalysis {
  overallScore: number // 0-100
  transcript: string
  feedback: {
    strengths: string[]
    weaknesses: string[]
    suggestions: string[]
    detailedFeedback: string
  }
  scores: {
    clarity: number // 0-100
    relevance: number // 0-100
    structure: number // 0-100
    completeness: number // 0-100
    confidence: number // 0-100
  }
  keyPoints: {
    covered: string[]
    missed: string[]
  }
  timeManagement: {
    duration: number
    efficiency: 'excellent' | 'good' | 'average' | 'poor'
    pacing: string
  }
  processingTime: number
}

export interface AnalysisRequest {
  transcript: string
  question: InterviewQuestion
  audioDuration: number // in seconds
  transcriptionConfidence: number
}

class GeminiAnalysisService {
  private model: string

  constructor() {
    // The API key and endpoint live on the server-side proxy.
    this.model = GEMINI_MODEL
  }

  /**
   * Generate detailed analysis prompt for Gemini
   */
  private generateAnalysisPrompt(
    question: InterviewQuestion,
    transcript: string,
    duration: number,
    confidence: number
  ): string {
    return `You are an expert interview coach analyzing a candidate's response. Provide comprehensive feedback.

QUESTION DETAILS:
- Question: "${question.question}"
- Type: ${question.type}
- Difficulty: ${question.difficulty}
- Skills Evaluated: ${question.skills.join(', ')}
- Expected Duration: ${question.expectedDuration} seconds
- Category: ${question.category}

CANDIDATE'S RESPONSE:
- Transcript: "${transcript}"
- Actual Duration: ${duration} seconds
- Transcription Confidence: ${Math.round(confidence * 100)}%

ANALYSIS INSTRUCTIONS:
Provide your analysis in **valid JSON format only**. No markdown, no code blocks, just pure JSON:

{
  "overallScore": <number 0-100>,
  "feedback": {
    "strengths": [<array of 3-5 specific strengths>],
    "weaknesses": [<array of 2-4 areas for improvement>],
    "suggestions": [<array of 3-5 actionable recommendations>],
    "detailedFeedback": "<2-3 sentence comprehensive feedback>"
  },
  "scores": {
    "clarity": <number 0-100>,
    "relevance": <number 0-100>,
    "structure": <number 0-100>,
    "completeness": <number 0-100>,
    "confidence": <number 0-100>
  },
  "keyPoints": {
    "covered": [<key points addressed>],
    "missed": [<important points not mentioned>]
  },
  "timeManagement": {
    "efficiency": "<excellent|good|average|poor>",
    "pacing": "<brief description of timing>"
  }
}

SCORING CRITERIA:
- Clarity: How clear and articulate is the response
- Relevance: How well the answer addresses the question
- Structure: Logical flow and organization
- Completeness: Thoroughness of the response
- Confidence: Perceived conviction and assertiveness

Return ONLY the JSON object, no additional text.`
  }

  /**
   * Analyze interview answer using Google Gemini
   */
  async analyzeAnswer(request: AnalysisRequest): Promise<AnswerAnalysis> {
    const startTime = Date.now()

    try {
      const prompt = this.generateAnalysisPrompt(
        request.question,
        request.transcript,
        request.audioDuration,
        request.transcriptionConfidence
      )

      console.log('🤖 Starting Gemini AI analysis via server proxy...', {
        model: this.model,
        questionType: request.question.type,
        transcriptLength: request.transcript.length,
        duration: request.audioDuration
      })

      const response = await fetch(GEMINI_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: this.model, input: prompt })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }))
        console.error('❌ Gemini API Error:', errorData)

        // Provide specific error messages
        if (response.status === 400) {
          throw new Error(`Invalid request: ${errorData.error?.message || 'Bad request'}`)
        } else if (response.status === 403) {
          throw new Error('Invalid Gemini API key. Please check your VITE_GEMINI_API_KEY')
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again')
        }

        throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`)
      }

      const data = await response.json()
      const processingTime = Date.now() - startTime

      console.log('📊 Gemini API response received:', {
        hasCandidates: !!data.candidates,
        processingTime: `${processingTime}ms`
      })

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No analysis results received from Gemini')
      }

      const candidate = data.candidates[0]
      if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        throw new Error('Invalid response format from Gemini')
      }

      const analysisText = candidate.content.parts[0].text
      let analysisResult

      try {
        // Remove markdown code blocks if present
        let cleanedText = analysisText.trim()
        if (cleanedText.startsWith('```json')) {
          cleanedText = cleanedText.replace(/^```json\n/, '').replace(/\n```$/, '')
        } else if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/^```\n/, '').replace(/\n```$/, '')
        }

        analysisResult = JSON.parse(cleanedText)
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', analysisText)
        throw new Error('Invalid JSON response from Gemini. Please try again.')
      }

      console.log('✅ Gemini analysis completed', {
        overallScore: analysisResult.overallScore,
        processingTime: `${processingTime}ms`,
        model: this.model
      })

      // Return the complete analysis with additional metadata
      return {
        ...analysisResult,
        transcript: request.transcript,
        timeManagement: {
          ...analysisResult.timeManagement,
          duration: request.audioDuration
        },
        processingTime
      }

    } catch (error) {
      const processingTime = Date.now() - startTime
      console.error('❌ Gemini analysis failed FULL DETAILS:', error) // Changed logging

      // Return fallback analysis
      return {
        overallScore: 0,
        transcript: request.transcript,
        feedback: {
          strengths: [],
          weaknesses: ['Analysis service temporarily unavailable'],
          suggestions: ['Please try again later'],
          detailedFeedback: 'We encountered an issue analyzing your response. Please try again later.'
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
          missed: []
        },
        timeManagement: {
          duration: request.audioDuration,
          efficiency: 'poor',
          pacing: 'Unable to analyze due to service error'
        },
        processingTime
      }
    }
  }

  /**
   * Generate quick feedback for immediate display
   */
  generateQuickFeedback(transcript: string, duration: number) {
    const wordCount = transcript.split(/\s+/).filter((w: string) => w.length > 0).length
    const wordsPerMinute = Math.round((wordCount / duration) * 60)

    return {
      wordCount,
      duration,
      wordsPerMinute,
      estimatedScore: Math.min(Math.max(Math.round((wordCount / 100) * 80 + 20), 20), 95),
      quickTips: this.getQuickTips(wordCount, duration, wordsPerMinute)
    }
  }

  /**
   * Generate quick tips based on metrics
   */
  private getQuickTips(wordCount: number, duration: number, wpm: number): string[] {
    const tips: string[] = []

    if (duration < 30) {
      tips.push('Consider providing more detailed examples')
    } else if (duration > 180) {
      tips.push('Try to be more concise and focus on key points')
    }

    if (wpm < 100) {
      tips.push('Speaking a bit faster could help convey confidence')
    } else if (wpm > 200) {
      tips.push('Speaking slower could improve clarity')
    }

    if (wordCount < 50) {
      tips.push('Expanding with specific examples would strengthen your response')
    }

    return tips
  }

  /**
   * Check if service is properly configured
   */
  isConfigured(): boolean {
    // Client-side configuration always considered true because the server proxy
    // holds the required API key. This avoids exposing keys in the browser.
    return true
  }

  /**
   * Get current model being used
   */
  getModel(): string {
    return this.model
  }
}

// Export singleton instance
export const geminiAnalysisService = new GeminiAnalysisService()
export default geminiAnalysisService
