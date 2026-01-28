/**
 * AnalysisResults Component
 * 
 * Displays comprehensive interview answer analysis results
 * Shows scores, feedback, and actionable improvements
 */

import React, { useState } from 'react'
import { 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Target, 
  Award,
  Lightbulb,
  MessageSquare,
  BarChart3,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import type { AnswerAnalysis } from '../services/openAIAnalysisService'

interface AnalysisResultsProps {
  analysis: AnswerAnalysis
  className?: string
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysis,
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState<{
    covered: boolean
    missed: boolean
    strengths: boolean
    weaknesses: boolean
    suggestions: boolean
  }>({
    covered: false,
    missed: false,
    strengths: false,
    weaknesses: false,
    suggestions: false
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }
  /**
   * Get color class based on score
   */
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  /**
   * Get progress bar color based on score
   */
  const getProgressColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  /**
   * Render score bar component - Compact version
   */
  const ScoreBar: React.FC<{ label: string; score: number; icon: React.ReactNode }> = ({
    label,
    score,
    icon
  }) => (
    <div className="flex items-center space-x-2">
      <div className="text-gray-500 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-xs font-medium text-gray-700 truncate">{label}</span>
          <span className={`text-xs font-bold ${getScoreColor(score)} ml-2`}>{score}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-500 ${getProgressColor(score)}`}
            style={{ width: `${Math.max(score, 5)}%` }}
          />
        </div>
      </div>
    </div>
  )

  /**
   * Format duration for display
   */
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={`${className}`}>
      {/* Compact Header with Overall Score */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xl font-bold mb-2">
          {analysis.overallScore}
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Interview Analysis Complete</h2>
        <p className="text-xs text-gray-600">
          Your response has been analyzed across multiple criteria
        </p>
      </div>

      {/* Compact Detailed Scores */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
          <BarChart3 className="w-4 h-4 mr-1.5" />
          Detailed Scores
        </h3>
        <div className="space-y-2 bg-gray-50 rounded-lg p-3">
          <ScoreBar 
            label="Clarity & Articulation"
            score={analysis.scores.clarity}
            icon={<MessageSquare className="w-3.5 h-3.5" />}
          />
          <ScoreBar 
            label="Relevance to Question"
            score={analysis.scores.relevance}
            icon={<Target className="w-3.5 h-3.5" />}
          />
          <ScoreBar 
            label="Structure & Organization"
            score={analysis.scores.structure}
            icon={<TrendingUp className="w-3.5 h-3.5" />}
          />
          <ScoreBar 
            label="Completeness"
            score={analysis.scores.completeness}
            icon={<CheckCircle className="w-3.5 h-3.5" />}
          />
          <ScoreBar 
            label="Confidence & Delivery"
            score={analysis.scores.confidence}
            icon={<Award className="w-3.5 h-3.5" />}
          />
        </div>
      </div>

      {/* Compact Time Management */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
          <Clock className="w-4 h-4 mr-1.5" />
          Time Management
        </h3>
        <div className="bg-gray-50 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-600">Duration: </span>
              <span className="font-semibold text-gray-900">{formatDuration(analysis.timeManagement.duration)}</span>
            </div>
            <div>
              <span className="text-gray-600">Efficiency: </span>
              <span className={`font-semibold capitalize ${
                analysis.timeManagement.efficiency === 'excellent' ? 'text-green-600' :
                analysis.timeManagement.efficiency === 'good' ? 'text-blue-600' :
                analysis.timeManagement.efficiency === 'average' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {analysis.timeManagement.efficiency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Key Points Analysis */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
          <Target className="w-4 h-4 mr-1.5" />
          Key Points Analysis
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {/* Covered Points - Expandable */}
          <div className="bg-green-50 rounded-lg p-2">
            <h4 className="text-xs font-semibold text-green-800 mb-1.5 flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              Covered ({analysis.keyPoints.covered.length})
            </h4>
            {analysis.keyPoints.covered.length > 0 ? (
              <ul className="space-y-1">
                {analysis.keyPoints.covered.slice(0, expandedSections.covered ? undefined : 1).map((point, index) => (
                  <li key={index} className="text-xs text-green-700 flex items-start leading-tight">
                    <span className="mr-1">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
                {analysis.keyPoints.covered.length > 1 && (
                  <button
                    onClick={() => toggleSection('covered')}
                    className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center"
                  >
                    {expandedSections.covered ? (
                      <>
                        <ChevronUp className="w-3 h-3 mr-0.5" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3 mr-0.5" />
                        +{analysis.keyPoints.covered.length - 1} more
                      </>
                    )}
                  </button>
                )}
              </ul>
            ) : (
              <p className="text-xs text-green-600 italic">None identified</p>
            )}
          </div>

          {/* Missed Points - Expandable */}
          <div className="bg-red-50 rounded-lg p-2">
            <h4 className="text-xs font-semibold text-red-800 mb-1.5 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              Missed ({analysis.keyPoints.missed.length})
            </h4>
            {analysis.keyPoints.missed.length > 0 ? (
              <ul className="space-y-1">
                {analysis.keyPoints.missed.slice(0, expandedSections.missed ? undefined : 1).map((point, index) => (
                  <li key={index} className="text-xs text-red-700 flex items-start leading-tight">
                    <span className="mr-1">✗</span>
                    <span>{point}</span>
                  </li>
                ))}
                {analysis.keyPoints.missed.length > 1 && (
                  <button
                    onClick={() => toggleSection('missed')}
                    className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center"
                  >
                    {expandedSections.missed ? (
                      <>
                        <ChevronUp className="w-3 h-3 mr-0.5" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3 mr-0.5" />
                        +{analysis.keyPoints.missed.length - 1} more
                      </>
                    )}
                  </button>
                )}
              </ul>
            ) : (
              <p className="text-xs text-red-600 italic">All covered!</p>
            )}
          </div>
        </div>
      </div>

      {/* Compact Strengths and Weaknesses */}
      <div className="mb-3">
        <div className="grid grid-cols-2 gap-2">
          {/* Strengths - Expandable */}
          <div className="bg-green-50 rounded-lg p-2">
            <h4 className="text-xs font-semibold text-gray-900 mb-1.5 flex items-center">
              <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
              Strengths
            </h4>
            {analysis.feedback.strengths.length > 0 ? (
              <ul className="space-y-1">
                {analysis.feedback.strengths.slice(0, expandedSections.strengths ? undefined : 1).map((strength, index) => (
                  <li key={index} className="text-xs text-gray-700 flex items-start leading-tight">
                    <span className="text-green-500 mr-1">●</span>
                    <span>{strength}</span>
                  </li>
                ))}
                {analysis.feedback.strengths.length > 1 && (
                  <button
                    onClick={() => toggleSection('strengths')}
                    className="text-xs text-gray-600 hover:text-gray-700 font-medium flex items-center"
                  >
                    {expandedSections.strengths ? (
                      <>
                        <ChevronUp className="w-3 h-3 mr-0.5" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3 mr-0.5" />
                        +{analysis.feedback.strengths.length - 1} more
                      </>
                    )}
                  </button>
                )}
              </ul>
            ) : (
              <p className="text-xs text-gray-500 italic">None noted</p>
            )}
          </div>

          {/* Areas for Improvement - Expandable */}
          <div className="bg-orange-50 rounded-lg p-2">
            <h4 className="text-xs font-semibold text-gray-900 mb-1.5 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1 text-orange-600" />
              To Improve
            </h4>
            {analysis.feedback.weaknesses.length > 0 ? (
              <ul className="space-y-1">
                {analysis.feedback.weaknesses.slice(0, expandedSections.weaknesses ? undefined : 1).map((weakness, index) => (
                  <li key={index} className="text-xs text-gray-700 flex items-start leading-tight">
                    <span className="text-orange-500 mr-1">●</span>
                    <span>{weakness}</span>
                  </li>
                ))}
                {analysis.feedback.weaknesses.length > 1 && (
                  <button
                    onClick={() => toggleSection('weaknesses')}
                    className="text-xs text-gray-600 hover:text-gray-700 font-medium flex items-center"
                  >
                    {expandedSections.weaknesses ? (
                      <>
                        <ChevronUp className="w-3 h-3 mr-0.5" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3 mr-0.5" />
                        +{analysis.feedback.weaknesses.length - 1} more
                      </>
                    )}
                  </button>
                )}
              </ul>
            ) : (
              <p className="text-xs text-gray-500 italic">None noted</p>
            )}
          </div>
        </div>
      </div>

      {/* Compact Actionable Suggestions - Expandable */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold text-gray-900 mb-1.5 flex items-center">
          <Lightbulb className="w-3 h-3 mr-1 text-yellow-600" />
          Actionable Suggestions
        </h4>
        {analysis.feedback.suggestions.length > 0 ? (
          <div className="space-y-1">
            {analysis.feedback.suggestions.slice(0, expandedSections.suggestions ? undefined : 3).map((suggestion, index) => (
              <div key={index} className="bg-yellow-50 border-l-2 border-yellow-400 px-2 py-1 rounded-r text-xs text-gray-700 leading-tight">
                {suggestion}
              </div>
            ))}
            {analysis.feedback.suggestions.length > 3 && (
              <button
                onClick={() => toggleSection('suggestions')}
                className="text-xs text-gray-600 hover:text-gray-700 font-medium flex items-center px-2"
              >
                {expandedSections.suggestions ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-0.5" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-0.5" />
                    +{analysis.feedback.suggestions.length - 3} more suggestions
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic px-2">No specific suggestions</p>
        )}
      </div>

      {/* Detailed Feedback Section - Always Visible at Bottom */}
      {analysis.feedback.detailedFeedback && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center">
            <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
            Detailed Feedback
          </h4>
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
              {analysis.feedback.detailedFeedback}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalysisResults