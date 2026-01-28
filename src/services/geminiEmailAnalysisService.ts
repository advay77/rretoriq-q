import type { EmailQuestion } from '../data/emailQuestions';

// Proxy configuration - call server-side proxy which holds API keys
const API_PROXY_BASE = import.meta.env.VITE_API_PROXY_BASE || (typeof window !== 'undefined' && window.location && window.location.hostname.includes('rretoriq25.web.app') ? 'https://rretoriq-backend-api.vercel.app/api' : '/api')
const GEMINI_PROXY_URL = `${API_PROXY_BASE}/gemini-proxy`

// Gemini model configuration
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash-exp'

export interface EmailAnalysisResult {
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  detailedFeedback: {
    clarity: { score: number; comment: string };
    professionalism: { score: number; comment: string };
    structure: { score: number; comment: string };
    tone: { score: number; comment: string };
    completeness: { score: number; comment: string };
  };
  keyPointsCovered: string[];
  keyPointsMissed: string[];
  grammarAndStyle: string[];
  recommendations: string[];
  sampleImprovement?: string;
}

export const analyzeEmailWithGemini = async (
  emailText: string,
  question: EmailQuestion
): Promise<EmailAnalysisResult> => {
  try {
    console.log('🔍 Starting email analysis with Gemini...');
    console.log('Question:', question.text);
    console.log('Email length:', emailText.length);

    const prompt = `You are an expert communication coach evaluating a professional email. Analyze the following email response and provide detailed, constructive feedback.

**Question/Scenario:**
${question.text}

**Difficulty Level:** ${question.difficulty}

**Skills Being Evaluated:** ${question.skillsEvaluated.join(', ')}

**Expected Key Points:**
${question.metadata.keyPoints.map((point, idx) => `${idx + 1}. ${point}`).join('\n')}

**User's Email Response:**
${emailText}

**Instructions:**
Provide a comprehensive analysis in the following JSON format. Be constructive, specific, and encouraging while being honest about areas for improvement.

{
  "overallScore": <number 0-100>,
  "strengths": [<array of 2-4 specific strengths in the email>],
  "areasForImprovement": [<array of 2-4 specific areas that need work>],
  "detailedFeedback": {
    "clarity": {
      "score": <0-100>,
      "comment": "<specific feedback on how clear and understandable the email is>"
    },
    "professionalism": {
      "score": <0-100>,
      "comment": "<feedback on professional tone, language, and etiquette>"
    },
    "structure": {
      "score": <0-100>,
      "comment": "<feedback on email organization, formatting, subject line if mentioned>"
    },
    "tone": {
      "score": <0-100>,
      "comment": "<feedback on appropriateness of tone for the situation>"
    },
    "completeness": {
      "score": <0-100>,
      "comment": "<feedback on whether all necessary information was included>"
    }
  },
  "keyPointsCovered": [<array of key points from the expected list that were addressed>],
  "keyPointsMissed": [<array of key points from the expected list that were not addressed>],
  "grammarAndStyle": [<array of 2-3 grammar, spelling, or style observations (can be positive or corrective)>],
  "recommendations": [<array of 3-5 actionable recommendations for improvement>],
  "sampleImprovement": "<optional: a brief example of how a weak section could be improved>"
}

**Important:**
- Be specific and reference actual content from the user's email
- Balance criticism with encouragement
- Provide actionable feedback that the user can apply immediately
- Consider the difficulty level when scoring
- Return ONLY valid JSON, no additional text`;

    // Call the Gemini proxy API
    const response = await fetch(GEMINI_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.text || data.response || '';

    console.log('✅ Gemini response received');

    // Extract JSON from the response
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const analysis: EmailAnalysisResult = JSON.parse(jsonText);

    console.log('✅ Analysis completed:', {
      overallScore: analysis.overallScore,
      strengthsCount: analysis.strengths.length,
      improvementsCount: analysis.areasForImprovement.length
    });

    return analysis;
  } catch (error) {
    console.error('❌ Error analyzing email:', error);
    throw new Error('Failed to analyze email. Please try again.');
  }
};

// Helper function to get performance level based on score
export const getPerformanceLevel = (score: number): { level: string; color: string; message: string } => {
  if (score >= 90) {
    return {
      level: 'Excellent',
      color: 'text-green-500',
      message: 'Outstanding work! Your email demonstrates professional excellence.'
    };
  } else if (score >= 80) {
    return {
      level: 'Very Good',
      color: 'text-blue-500',
      message: 'Great job! Your email is well-crafted with minor room for improvement.'
    };
  } else if (score >= 70) {
    return {
      level: 'Good',
      color: 'text-yellow-500',
      message: 'Good effort! Your email covers the basics well with some areas to enhance.'
    };
  } else if (score >= 60) {
    return {
      level: 'Satisfactory',
      color: 'text-orange-500',
      message: 'Adequate work. Focus on the feedback to improve your email writing.'
    };
  } else {
    return {
      level: 'Needs Improvement',
      color: 'text-red-500',
      message: 'Keep practicing! Review the feedback carefully and try again.'
    };
  }
};
