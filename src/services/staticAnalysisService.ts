import type { AnswerAnalysis, AnalysisRequest } from './geminiAnalysisService';

export class StaticAnalysisService {
  private staticResponses: Record<string, AnswerAnalysis> = {};
  
  constructor() {
    // Initialize with some static responses for different question types
    this.initializeStaticResponses();
  }

  private initializeStaticResponses() {
    // Default response that can be used for any question
    const defaultResponse: AnswerAnalysis = {
      overallScore: 75,
      transcript: '',
      feedback: {
        strengths: [
          'Good use of specific examples',
          'Clear and concise communication',
          'Relevant experience mentioned'
        ],
        weaknesses: [
          'Could provide more technical details',
          'Answer could be more structured',
          'Consider elaborating on the impact of your actions'
        ],
        suggestions: [
          'Use the STAR method (Situation, Task, Action, Result) for more structured responses',
          'Include specific metrics or results when possible',
          'Practice varying your vocal tone for emphasis'
        ],
        detailedFeedback: 'Your response was good overall but could benefit from more specific examples and a clearer structure. Try to quantify your achievements where possible.'
      },
      scores: {
        clarity: 78,
        relevance: 82,
        structure: 70,
        completeness: 75,
        confidence: 80
      },
      keyPoints: {
        covered: [
          'Relevant experience mentioned',
          'Clear explanation of your role'
        ],
        missed: [
          'Specific metrics or results',
          'Lessons learned from the experience'
        ]
      },
      timeManagement: {
        duration: 0,
        efficiency: 'good',
        pacing: 'Good pace overall, with room for more detailed examples'
      },
      processingTime: 0
    };

    // Store the default response with a generic key
    this.staticResponses['default'] = defaultResponse;
  }

  async analyzeAnswer(request: AnalysisRequest): Promise<AnswerAnalysis> {
    // Use a hash of the question as the key to potentially return different responses
    const questionKey = this.hashCode(request.question.question) % 3; // 3 different variations
    const responseKey = `response_${questionKey}`;
    
    // If we have a specific response for this question type, use it, otherwise use default
    const response = this.staticResponses[responseKey] || this.staticResponses['default'];
    
    // Update the response with the actual transcript and duration
    return {
      ...response,
      transcript: request.transcript,
      timeManagement: {
        ...response.timeManagement,
        duration: request.audioDuration
      },
      processingTime: 500 // Simulate processing time in ms
    };
  }

  generateQuickFeedback(transcript: string, duration: number) {
    const wordCount = transcript.split(/\s+/).filter((w: string) => w.length > 0).length;
    const wordsPerMinute = Math.round((wordCount / duration) * 60);

    return {
      wordCount,
      duration,
      wordsPerMinute,
      estimatedScore: Math.min(Math.max(Math.round((wordCount / 100) * 80 + 20), 20), 95),
      quickTips: this.getQuickTips(wordCount, duration, wordsPerMinute)
    };
  }

  private getQuickTips(wordCount: number, duration: number, wpm: number): string[] {
    const tips: string[] = [];

    if (duration < 30) {
      tips.push('Consider providing more detailed examples');
    } else if (duration > 180) {
      tips.push('Try to be more concise and focus on key points');
    }

    if (wpm < 100) {
      tips.push('Speaking a bit faster could help convey confidence');
    } else if (wpm > 200) {
      tips.push('Speaking slower could improve clarity');
    }

    if (wordCount < 50) {
      tips.push('Expanding with specific examples would strengthen your response');
    }

    return tips;
  }

  isConfigured(): boolean {
    return true;
  }

  getModel(): string {
    return 'static-analysis';
  }

  // Helper function to generate a simple hash code
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}

// Export singleton instance
export const staticAnalysisService = new StaticAnalysisService();
export default staticAnalysisService;
