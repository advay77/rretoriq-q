import React, { useState, useEffect } from 'react';
import { BookOpen, Send, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import type { EmailQuestion } from '../data/emailQuestions';
import { getRandomEmailQuestion } from '../data/emailQuestions';
import { analyzeEmailWithGemini, type EmailAnalysisResult } from '../services/geminiEmailAnalysisService';
import WritingResults from './WritingResults';
import { useAuthStore } from '../store/authStore';
import { firebaseSessionService } from '../services/firebaseSessionService';

interface EmailWritingSessionProps {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  onSessionComplete: () => void;
}

const EmailWritingSession: React.FC<EmailWritingSessionProps> = ({ difficulty, onSessionComplete }) => {
  const { user } = useAuthStore();
  const [currentQuestion, setCurrentQuestion] = useState<EmailQuestion | null>(null);
  const [emailText, setEmailText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<EmailAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date>(new Date());

  // Load question on mount or when difficulty changes
  useEffect(() => {
    loadQuestion();
  }, [difficulty]);

  // Update word count as user types
  useEffect(() => {
    const words = emailText.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [emailText]);

  const loadQuestion = async () => {
    const question = getRandomEmailQuestion(difficulty);
    setCurrentQuestion(question);
    setEmailText('');
    setAnalysisResult(null);
    setError(null);
    setWordCount(0);
    setSessionStartTime(new Date());
    console.log('📧 Loaded question:', question.id, question.difficulty);

    // Create a new Firebase session for tracking
    if (user) {
      try {
        const newSessionId = await firebaseSessionService.createSession(user.id, 'ielts');
        setSessionId(newSessionId);
        console.log('✅ Created Firebase session:', newSessionId);
      } catch (err) {
        console.error('❌ Error creating session:', err);
      }
    }
  };

  const handleSubmit = async () => {
    if (!emailText.trim()) {
      setError('Please write your email before submitting.');
      return;
    }

    if (!currentQuestion) {
      setError('No question loaded. Please refresh the page.');
      return;
    }

    if (wordCount < 20) {
      setError('Your email seems too short. Please provide a more complete response (at least 20 words).');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log('📤 Submitting email for analysis...');
      const result = await analyzeEmailWithGemini(emailText, currentQuestion);
      setAnalysisResult(result);
      console.log('✅ Analysis complete:', result);

      // Save session results to Firebase
      if (user && sessionId) {
        try {
          const sessionEndTime = new Date();
          const durationInSeconds = Math.floor((sessionEndTime.getTime() - sessionStartTime.getTime()) / 1000);

          // Save answer using the firebaseSessionService format
          await firebaseSessionService.saveAnswer(sessionId, {
            questionId: currentQuestion.id,
            questionText: currentQuestion.text,
            questionType: 'email-writing',
            difficulty: difficulty,
            transcription: {
              transcript: emailText,
              confidence: 1.0,
              success: true,
              processingTime: 0,
              wordCount: wordCount
            },
            analysis: {
              overallScore: result.overallScore,
              transcript: emailText,
              feedback: {
                strengths: result.strengths,
                weaknesses: result.areasForImprovement,
                suggestions: result.recommendations,
                detailedFeedback: result.recommendations.join(' ')
              },
              scores: {
                clarity: result.detailedFeedback.clarity.score,
                relevance: result.detailedFeedback.professionalism.score,
                structure: result.detailedFeedback.structure.score,
                completeness: result.detailedFeedback.completeness.score,
                confidence: result.detailedFeedback.tone.score
              },
              keyPoints: {
                covered: result.keyPointsCovered,
                missed: result.keyPointsMissed
              },
              timeManagement: {
                duration: durationInSeconds,
                efficiency: 'good',
                pacing: 'appropriate'
              },
              processingTime: 0
            },
            audioDuration: 0
          });

          // Complete the session
          await firebaseSessionService.completeSession(sessionId, {
            totalQuestions: 1,
            completedQuestions: 1,
            averageScore: result.overallScore,
            totalDuration: durationInSeconds,
            analyses: [{
              overallScore: result.overallScore,
              transcript: emailText,
              feedback: {
                strengths: result.strengths,
                weaknesses: result.areasForImprovement,
                suggestions: result.recommendations,
                detailedFeedback: result.recommendations.join(' ')
              },
              scores: {
                clarity: result.detailedFeedback.clarity.score,
                relevance: result.detailedFeedback.professionalism.score,
                structure: result.detailedFeedback.structure.score,
                completeness: result.detailedFeedback.completeness.score,
                confidence: result.detailedFeedback.tone.score
              },
              keyPoints: {
                covered: result.keyPointsCovered,
                missed: result.keyPointsMissed
              },
              timeManagement: {
                duration: durationInSeconds,
                efficiency: 'good',
                pacing: 'appropriate'
              },
              processingTime: 0
            }],
            sessionType: 'email-writing'
          });
          console.log('✅ Session saved to Firebase');
        } catch (err) {
          console.error('❌ Error saving session:', err);
        }
      }
    } catch (err) {
      console.error('❌ Analysis error:', err);
      setError('Failed to analyze your email. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTryAgain = () => {
    loadQuestion();
  };

  const handleFinish = () => {
    // This will trigger going back to difficulty selection without unmounting
    onSessionComplete();
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading question...</span>
        </div>
      </div>
    );
  }

  // Show results if analysis is complete
  if (analysisResult) {
    return (
      <WritingResults
        result={analysisResult}
        question={currentQuestion}
        userEmail={emailText}
        onTryAgain={handleTryAgain}
        onFinish={handleFinish}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <BookOpen className="w-6 h-6 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-600">
                Email Writing Practice
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {difficulty}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email Scenario
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {currentQuestion.text}
            </p>
          </div>
        </div>

        {/* Skills Being Evaluated */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Skills Being Evaluated:</p>
          <div className="flex flex-wrap gap-2">
            {currentQuestion.skillsEvaluated.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs text-emerald-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Email Composition Area */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Your Email Response
            </label>
            <span className="text-xs text-gray-500">
              {wordCount} words · Expected: ~{currentQuestion.metadata.expectedAnswerLength} words
            </span>
          </div>
          <textarea
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            placeholder="Start writing your email here...&#10;&#10;Example:&#10;Subject: [Your subject line]&#10;&#10;Dear [Name],&#10;&#10;[Your message body]&#10;&#10;Best regards,&#10;[Your name]"
            className="w-full h-[400px] px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none font-mono text-sm leading-relaxed"
            disabled={isAnalyzing}
          />
        </div>

        {/* Tips */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
          <p className="text-sm font-medium text-emerald-700 mb-2">💡 Writing Tips:</p>
          <ul className="text-xs text-gray-700 space-y-1">
            {currentQuestion.metadata.keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">Error</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleTryAgain}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl text-gray-700 font-medium transition-all duration-300 flex items-center space-x-2"
            disabled={isAnalyzing}
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Question</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isAnalyzing || !emailText.trim()}
            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl text-white font-semibold transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-xl"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit for Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Character/Word Counter Info */}
      <div className="text-center text-xs text-gray-500">
        Write a professional email addressing all the key points mentioned above.
        <br />
        Take your time to craft a well-structured response.
      </div>
    </div>
  );
};

export default EmailWritingSession;
