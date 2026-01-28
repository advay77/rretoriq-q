import React from 'react';
import { CheckCircle2, XCircle, TrendingUp, Award, Lightbulb, FileText, RotateCcw, ArrowLeft } from 'lucide-react';
import type { EmailAnalysisResult } from '../services/geminiEmailAnalysisService';
import { getPerformanceLevel } from '../services/geminiEmailAnalysisService';
import type { EmailQuestion } from '../data/emailQuestions';

interface WritingResultsProps {
  result: EmailAnalysisResult;
  question: EmailQuestion;
  userEmail: string;
  onTryAgain: () => void;
  onFinish: () => void;
}

const WritingResults: React.FC<WritingResultsProps> = ({
  result,
  userEmail,
  onTryAgain,
  onFinish
}) => {
  const performance = getPerformanceLevel(result.overallScore);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Overall Score Card */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 border-4 border-emerald-200 mb-4">
            <span className="text-4xl font-bold text-emerald-700">{result.overallScore}</span>
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${performance.color}`}>
            {performance.level}
          </h2>
          <p className="text-gray-700 text-lg">
            {performance.message}
          </p>
        </div>
      </div>

      {/* Detailed Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(result.detailedFeedback).map(([category, data]) => (
          <div key={category} className="bg-white rounded-xl p-4 border border-gray-200 shadow-md">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{data.score}</div>
              <div className="text-xs text-gray-600 capitalize mb-2">{category}</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    data.score >= 80 ? 'bg-green-500' :
                    data.score >= 60 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${data.score}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Strengths Section */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 shadow-md">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-bold text-green-700">Strengths</h3>
        </div>
        <ul className="space-y-2">
          {result.strengths.map((strength, idx) => (
            <li key={idx} className="flex items-start space-x-3">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-gray-700">{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Areas for Improvement Section */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 shadow-md">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-6 h-6 text-orange-600" />
          <h3 className="text-xl font-bold text-orange-700">Areas for Improvement</h3>
        </div>
        <ul className="space-y-2">
          {result.areasForImprovement.map((area, idx) => (
            <li key={idx} className="flex items-start space-x-3">
              <span className="text-orange-600 mt-1">→</span>
              <span className="text-gray-700">{area}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Detailed Feedback Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(result.detailedFeedback).map(([category, data]) => (
          <div key={category} className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-900 capitalize">{category}</h4>
              <span className={`text-2xl font-bold ${
                data.score >= 80 ? 'text-green-600' :
                data.score >= 60 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {data.score}
              </span>
            </div>
            <p className="text-sm text-gray-600">{data.comment}</p>
          </div>
        ))}
      </div>

      {/* Key Points Coverage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Covered Points */}
        {result.keyPointsCovered.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h4 className="text-lg font-semibold text-gray-900">Key Points Covered</h4>
            </div>
            <ul className="space-y-2">
              {result.keyPointsCovered.map((point, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <span className="text-green-600 text-sm mt-0.5">✓</span>
                  <span className="text-sm text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Missed Points */}
        {result.keyPointsMissed.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <XCircle className="w-5 h-5 text-red-600" />
              <h4 className="text-lg font-semibold text-gray-900">Key Points Missed</h4>
            </div>
            <ul className="space-y-2">
              {result.keyPointsMissed.map((point, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <span className="text-red-600 text-sm mt-0.5">✗</span>
                  <span className="text-sm text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Grammar and Style */}
      {result.grammarAndStyle.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-900">Grammar & Style Notes</h4>
          </div>
          <ul className="space-y-2">
            {result.grammarAndStyle.map((note, idx) => (
              <li key={idx} className="flex items-start space-x-3">
                <span className="text-blue-600 text-sm mt-0.5">•</span>
                <span className="text-sm text-gray-700">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-md">
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="w-6 h-6 text-emerald-600" />
          <h3 className="text-xl font-bold text-emerald-700">Recommendations</h3>
        </div>
        <ul className="space-y-3">
          {result.recommendations.map((recommendation, idx) => (
            <li key={idx} className="flex items-start space-x-3">
              <span className="text-emerald-600 font-bold mt-0.5">{idx + 1}.</span>
              <span className="text-gray-700">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sample Improvement (if provided) */}
      {result.sampleImprovement && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-blue-700">Sample Improvement</h3>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {result.sampleImprovement}
          </p>
        </div>
      )}

      {/* Your Email (Collapsible) */}
      <details className="bg-white rounded-xl border border-gray-200 shadow-md">
        <summary className="p-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-xl">
          <span className="text-lg font-semibold text-gray-900">View Your Email</span>
        </summary>
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {userEmail}
            </pre>
          </div>
        </div>
      </details>

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-4 pt-4">
        <button
          onClick={onTryAgain}
          className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl text-white font-semibold transition-all duration-300 flex items-center space-x-2 hover:scale-[1.02] hover:shadow-xl"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Try Another Question</span>
        </button>
        <button
          onClick={onFinish}
          className="px-8 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl text-gray-700 font-semibold transition-all duration-300 flex items-center space-x-2 hover:scale-[1.02]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Selection</span>
        </button>
      </div>
    </div>
  );
};

export default WritingResults;
