import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AnswerStorageService } from '../services/answerStorageService';
import type { InterviewSession, StoredAnswer } from '../services/answerStorageService';

import { 
  ArrowLeft, 
  Clock, 
  Trophy, 
  Target, 
  TrendingUp, 
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Share2,
  RefreshCw,
  Eye,
  Loader2
} from 'lucide-react';

interface SessionResultsProps {
  sessionId?: string;
  onClose?: () => void;
}

export const SessionResults: React.FC<SessionResultsProps> = ({ 
  sessionId: propSessionId, 
  onClose 
}) => {
  const { sessionId: paramSessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  
  const sessionId = propSessionId || paramSessionId;
  
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);

  const storageService = new AnswerStorageService();

  useEffect(() => {
    if (sessionId) {
      loadSessionResults();
    } else {
      setError('No session ID provided');
      setLoading(false);
    }
  }, [sessionId]);

  const loadSessionResults = async () => {
    if (!sessionId) return;

    setLoading(true);
    setError(null);

    try {
      const sessionData = await storageService.getSession(sessionId);
      if (!sessionData) {
        throw new Error('Session not found');
      }

      const sessionAnswers = await storageService.getSessionAnswers(sessionId);
      
      setSession(sessionData);
      setAnswers(sessionAnswers);
    } catch (error) {
      console.error('Error loading session results:', error);
      setError(error instanceof Error ? error.message : 'Failed to load session results');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/dashboard');
    }
  };

  const exportResults = () => {
    if (!session || !answers.length) return;

    const exportData = {
      session: {
        id: session.id,
        sessionName: session.sessionName,
        sessionType: session.sessionType,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        averageScore: session.averageScore,
        totalDuration: session.totalDuration,
        status: session.status
      },
      answers: answers.map(answer => ({
        questionId: answer.questionId,
        questionText: answer.question.text,
        questionType: answer.question.type,
        questionDifficulty: answer.question.difficulty,
        userAnswer: answer.transcript,
        duration: answer.duration,
        aiEvaluation: answer.aiEvaluation ? {
          overallScore: answer.aiEvaluation.overallScore,
          criteriaScores: answer.aiEvaluation.scores,
          strengths: answer.aiEvaluation.feedback.strengths,
          areasForImprovement: answer.aiEvaluation.feedback.weaknesses,
          suggestions: answer.aiEvaluation.feedback.suggestions,
          detailedFeedback: answer.aiEvaluation.feedback.detailedFeedback
        } : null,
        timestamp: answer.createdAt
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-session-${session.id}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'HR': return 'bg-blue-100 text-blue-800';
      case 'Technical': return 'bg-green-100 text-green-800';
      case 'Aptitude': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const calculateStats = () => {
    if (!answers.length) return null;

    const evaluatedAnswers = answers.filter(a => a.aiEvaluation);
    if (evaluatedAnswers.length === 0) return null;

    const totalScore = evaluatedAnswers.reduce((sum, a) => sum + (a.aiEvaluation?.overallScore || 0), 0);
    const averageScore = totalScore / evaluatedAnswers.length;
    const totalDuration = answers.reduce((sum, a) => sum + a.duration, 0);

    const criteriaAverages = {
      relevance: 0,
      completeness: 0,
      clarity: 0,
      technical_accuracy: 0,
      professionalism: 0
    };

    evaluatedAnswers.forEach(answer => {
      if (answer.aiEvaluation) {
        Object.keys(criteriaAverages).forEach(criteria => {
          criteriaAverages[criteria as keyof typeof criteriaAverages] += 
            answer.aiEvaluation!.scores[criteria as keyof typeof answer.aiEvaluation.scores];
        });
      }
    });

    Object.keys(criteriaAverages).forEach(criteria => {
      criteriaAverages[criteria as keyof typeof criteriaAverages] /= evaluatedAnswers.length;
    });

    // Collect all strengths and improvement areas
    const allStrengths: string[] = [];
    const allImprovements: string[] = [];
    
    evaluatedAnswers.forEach(answer => {
      if (answer.aiEvaluation) {
        allStrengths.push(...answer.aiEvaluation.feedback.strengths);
        allImprovements.push(...answer.aiEvaluation.feedback.weaknesses);
      }
    });

    // Count frequency of strengths and improvements
    const strengthCounts: Record<string, number> = {};
    const improvementCounts: Record<string, number> = {};

    allStrengths.forEach(strength => {
      strengthCounts[strength] = (strengthCounts[strength] || 0) + 1;
    });

    allImprovements.forEach(improvement => {
      improvementCounts[improvement] = (improvementCounts[improvement] || 0) + 1;
    });

    // Get top 3 most common
    const topStrengths = Object.entries(strengthCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([strength]) => strength);

    const topImprovements = Object.entries(improvementCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([improvement]) => improvement);

    return {
      averageScore,
      totalDuration,
      criteriaAverages,
      topStrengths,
      topImprovements,
      completionRate: (evaluatedAnswers.length / answers.length) * 100
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Session Results</h2>
          <p className="text-gray-600">Analyzing your interview performance...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Results</h2>
            <p className="text-gray-600 mb-6">{error || 'Session not found'}</p>
            
            <div className="space-y-3">
              <button
                onClick={handleClose}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Back to Dashboard
              </button>
              
              <button
                onClick={loadSessionResults}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleClose}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🎯 Interview Results
              </h1>
              <p className="text-gray-600">
                {session.sessionName} • {new Date(session.startedAt.seconds * 1000).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={exportResults}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(stats.averageScore)}`}>
                    {Math.round(stats.averageScore)}/100
                  </p>
                </div>
                <Trophy className={`w-8 h-8 ${getScoreColor(stats.averageScore)}`} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Questions Completed</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {session.completedQuestions}/{session.totalQuestions}
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(session.completedQuestions / session.totalQuestions) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Duration</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {session.totalDuration ? formatDuration(session.totalDuration) : formatDuration(stats.totalDuration)}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round(stats.completionRate)}%
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Criteria Breakdown */}
            {stats && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Breakdown</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(stats.criteriaAverages).map(([criteria, score]) => (
                    <div key={criteria} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {criteria.replace('_', ' ')}
                        </span>
                        <span className={`font-semibold ${getScoreColor(score * 10)}`}>
                          {score.toFixed(1)}/10
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${(score / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Question-by-Question Results */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Results</h3>
              
              <div className="space-y-4">
                {answers.map((answer, index) => (
                  <div 
                    key={answer.id} 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedAnswerIndex === index 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedAnswerIndex(selectedAnswerIndex === index ? null : index)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(answer.question.type)}`}>
                            {answer.question.type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(answer.question.difficulty)}`}>
                            {answer.question.difficulty}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDuration(answer.duration)}
                          </span>
                        </div>
                        
                        <h4 className="font-medium text-gray-900 mb-2">
                          Question {index + 1}: {answer.question.text}
                        </h4>
                        
                        {selectedAnswerIndex === index && (
                          <div className="mt-4 space-y-4">
                            <div>
                              <h5 className="font-medium text-gray-700 mb-2">Your Answer:</h5>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-gray-700 text-sm whitespace-pre-wrap">{answer.transcript}</p>
                              </div>
                            </div>
                            
                            {answer.aiEvaluation && (
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                  {Object.entries(answer.aiEvaluation.scores).map(([criteria, score]) => (
                                    <div key={criteria} className="text-center p-2 bg-gray-100 rounded">
                                      <div className="text-xs text-gray-600 capitalize mb-1">
                                        {criteria.replace('_', ' ')}
                                      </div>
                                      <div className={`text-sm font-semibold ${getScoreColor((score as number) * 10)}`}>
                                        {score as number}/10
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                {answer.aiEvaluation.feedback.strengths.length > 0 && (
                                  <div>
                                    <h6 className="font-medium text-green-800 mb-1">Strengths:</h6>
                                    <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                                      {answer.aiEvaluation.feedback.strengths.map((strength: string, i: number) => (
                                        <li key={i}>{strength}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {answer.aiEvaluation.feedback.weaknesses.length > 0 && (
                                  <div>
                                    <h6 className="font-medium text-orange-800 mb-1">Areas for Improvement:</h6>
                                    <ul className="list-disc list-inside text-sm text-orange-700 space-y-1">
                                      {answer.aiEvaluation.feedback.weaknesses.map((area: string, i: number) => (
                                        <li key={i}>{area}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {answer.aiEvaluation.feedback.suggestions.length > 0 && (
                                  <div>
                                    <h6 className="font-medium text-blue-800 mb-1">Suggestions:</h6>
                                    <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                      {answer.aiEvaluation.feedback.suggestions.slice(0, 3).map((suggestion: string, i: number) => (
                                        <li key={i}>{suggestion}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3 ml-4">
                        {answer.aiEvaluation ? (
                          <div className={`text-right px-3 py-2 rounded-lg ${getScoreBgColor(answer.aiEvaluation.overallScore)}`}>
                            <div className={`text-lg font-bold ${getScoreColor(answer.aiEvaluation.overallScore)}`}>
                              {answer.aiEvaluation.overallScore}/100
                            </div>
                          </div>
                        ) : (
                          <div className="text-right px-3 py-2 rounded-lg bg-gray-100">
                            <AlertCircle className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                        
                        <Eye className={`w-5 h-5 ${selectedAnswerIndex === index ? 'text-blue-600' : 'text-gray-400'}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Session Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Session Type:</span>
                  <span className="font-medium">{session.sessionType}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${session.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Started:</span>
                  <span className="font-medium">
                    {new Date(session.startedAt.seconds * 1000).toLocaleDateString()}
                  </span>
                </div>
                
                {session.completedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium">
                      {new Date(session.completedAt.seconds * 1000).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Key Insights */}
            {stats && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                
                <div className="space-y-4">
                  {stats.topStrengths.length > 0 && (
                    <div>
                      <h4 className="font-medium text-green-800 mb-2">Top Strengths</h4>
                      <ul className="space-y-1">
                        {stats.topStrengths.map((strength, index) => (
                          <li key={index} className="text-sm text-green-700 flex items-start">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-1 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {stats.topImprovements.length > 0 && (
                    <div>
                      <h4 className="font-medium text-orange-800 mb-2">Focus Areas</h4>
                      <ul className="space-y-1">
                        {stats.topImprovements.map((improvement, index) => (
                          <li key={index} className="text-sm text-orange-700 flex items-start">
                            <TrendingUp className="w-3 h-3 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
              
              <div className="space-y-3">
                <Link
                  to={`/ai-interview/${session.sessionType.toLowerCase()}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <RefreshCw size={16} />
                  <span>Practice Again</span>
                </Link>
                
                <Link
                  to="/progress"
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <BarChart3 size={16} />
                  <span>View Progress</span>
                </Link>
                
                <Link
                  to="/dashboard"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <ArrowLeft size={16} />
                  <span>Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};