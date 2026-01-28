/**
 * OpenAI Analysis Service
 * 
 * This service analyzes transcribed interview answers using OpenAI's GPT models
 * Provides detailed feedback, scoring, and improvement suggestions
 */

// Proxy configuration - call server-side proxy which holds API keys
const API_PROXY_BASE = import.meta.env.VITE_API_PROXY_BASE || (typeof window !== 'undefined' && window.location && window.location.hostname.includes('rretoriq25.web.app') ? 'https://rretoriq-backend-api.vercel.app/api' : '/api')
const OPENAI_PROXY_URL = `${API_PROXY_BASE}/openai-proxy`
const GEMINI_PROXY_URL = `${API_PROXY_BASE}/gemini-proxy`
const ANALYSIS_PROVIDER = import.meta.env.VITE_AI_ANALYSIS_PROVIDER || 'gemini'

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

class OpenAIAnalysisService {
  constructor() {
    // No client-side API key required — we call server-side proxy
  }

  /**
   * Generate detailed analysis prompt for the OpenAI API
   * @param question - The interview question object
   * @param transcript - The user's transcribed answer
   * @param duration - Answer duration in seconds
   * @param confidence - Transcription confidence score
   * @returns string - The formatted prompt
   */
  private generateAnalysisPrompt(
    question: InterviewQuestion,
    transcript: string,
    duration: number,
    confidence: number
  ): string {
    return `You are an expert interview coach analyzing a candidate's response to an interview question. Provide a comprehensive analysis.

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

ANALYSIS REQUIREMENTS:
Please provide a detailed analysis in the following JSON format:

{
  "overallScore": <number 0-100>,
  "feedback": {
    "strengths": [<array of specific strengths observed>],
    "weaknesses": [<array of areas needing improvement>],
    "suggestions": [<array of actionable improvement suggestions>],
    "detailedFeedback": "<comprehensive paragraph feedback>"
  },
  "scores": {
    "clarity": <number 0-100>,
    "relevance": <number 0-100>,
    "structure": <number 0-100>,
    "completeness": <number 0-100>,
    "confidence": <number 0-100>
  },
  "keyPoints": {
    "covered": [<array of key points the candidate addressed>],
    "missed": [<array of important points not addressed>]
  },
  "timeManagement": {
    "efficiency": "<excellent|good|average|poor>",
    "pacing": "<description of answer pacing and timing>"
  }
}

SCORING CRITERIA:
- Clarity (0-100): How clear and articulate the response is
- Relevance (0-100): How well the answer addresses the question
- Structure (0-100): Logical flow and organization of thoughts
- Completeness (0-100): How thoroughly the question is answered
- Confidence (0-100): Perceived confidence and conviction in delivery

Focus on providing constructive, actionable feedback that helps the candidate improve their interview performance.`
  }

  /**
   * Analyze interview answer using OpenAI GPT models
   * @param request - The analysis request containing transcript and question details
   * @returns Promise<AnswerAnalysis>
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

      console.log('🤖 Starting OpenAI analysis...', {
        questionType: request.question.type,
        transcriptLength: request.transcript.length,
        duration: request.audioDuration
      })

      let response
      if (ANALYSIS_PROVIDER === 'gemini') {
        // Gemini expects { input: 'text' }
        response = await fetch(GEMINI_PROXY_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: prompt, model: import.meta.env.VITE_GEMINI_MODEL || 'models/text-bison-001' })
        })
      } else {
        // Fallback to OpenAI proxy
        response = await fetch(OPENAI_PROXY_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gpt-4-turbo-preview',
            messages: [
              { role: 'system', content: 'You are an expert interview coach and HR professional with extensive experience in candidate evaluation. Provide detailed, constructive feedback.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 2000,
            response_format: { type: 'json_object' }
          })
        })
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`)
      }

      const data = await response.json()
      const processingTime = Date.now() - startTime

      let analysisContent = null
      let analysisResult = null

      if (ANALYSIS_PROVIDER === 'gemini') {
        // Expected shape forwarded from gemini-proxy: { candidates: [{ content: '...' }, ...] }
        const candidate = data?.candidates && data.candidates[0]
        analysisContent = candidate?.content || JSON.stringify(data)
        try {
          analysisResult = JSON.parse(analysisContent)
        } catch (err) {
          // If Gemini returned plain text, wrap it in a minimal structure
          analysisResult = {
            overallScore: 0,
            feedback: { strengths: [], weaknesses: [], suggestions: [], detailedFeedback: analysisContent },
            scores: { clarity: 0, relevance: 0, structure: 0, completeness: 0, confidence: 0 },
            keyPoints: { covered: [], missed: [] },
            timeManagement: { duration: request.audioDuration, efficiency: 'average', pacing: '' }
          }
        }
      } else {
        if (!data.choices || data.choices.length === 0) {
          throw new Error('No analysis results received from OpenAI')
        }

        analysisContent = data.choices[0].message.content
        try {
          analysisResult = JSON.parse(analysisContent)
        } catch (parseError) {
          console.error('Failed to parse OpenAI response:', analysisContent)
          throw new Error('Invalid response format from OpenAI')
        }
      }

      console.log('✅ OpenAI analysis completed', {
        overallScore: analysisResult.overallScore,
        processingTime: `${processingTime}ms`
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
      console.error('❌ OpenAI analysis failed:', error)

      // Return fallback analysis in case of error
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
   * Generate quick feedback for immediate display (while full analysis is processing)
   * @param transcript - The transcribed text
   * @param duration - Answer duration in seconds
   * @returns Quick feedback object
   */
  generateQuickFeedback(transcript: string, duration: number) {
    const wordCount = transcript.split(/\s+/).filter(word => word.length > 0).length
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
   * Generate quick tips based on basic metrics
   * @param wordCount - Number of words in transcript
   * @param duration - Answer duration
   * @param wpm - Words per minute
   * @returns Array of quick tips
   */
  private getQuickTips(wordCount: number, duration: number, wpm: number): string[] {
    const tips: string[] = []

    if (duration < 30) {
      tips.push('Consider providing more detailed examples in your answer')
    } else if (duration > 180) {
      tips.push('Try to be more concise and focus on key points')
    }

    if (wpm < 100) {
      tips.push('Speaking a bit faster could help convey more confidence')
    } else if (wpm > 200) {
      tips.push('Speaking a bit slower could improve clarity')
    }

    if (wordCount < 50) {
      tips.push('Expanding your answer with specific examples would strengthen your response')
    }

    return tips
  }

  /**
   * Check if OpenAI service is properly configured
   * @returns boolean
   */
  isConfigured(): boolean {
    // Consider the service configured if proxy base is provided (defaults to /api)
    return !!API_PROXY_BASE
  }
}

// Export singleton instance
export const openAIAnalysisService = new OpenAIAnalysisService()
export default openAIAnalysisService