/**
 * Word & Phrase of the Day Component
 * Displays daily vocabulary and phrase with examples
 */

import React, { useState, useEffect } from 'react'
import { BookOpen, MessageCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { getTodayContent } from '../data/dailyContent'
import type { DailyContent } from '../data/dailyContent'

interface WordPhraseCardProps {
  className?: string
  compact?: boolean
}

export const WordPhraseCard: React.FC<WordPhraseCardProps> = ({ 
  className = '',
  compact = false 
}) => {
  const [expandedWord, setExpandedWord] = useState(false)
  const [expandedPhrase, setExpandedPhrase] = useState(false)
  const [todayContent, setTodayContent] = useState<DailyContent>(getTodayContent())
  
  // Update content when the date changes
  useEffect(() => {
    const updateContent = () => {
      const newContent = getTodayContent()
      setTodayContent(newContent)
      // Store current date to check for changes
      localStorage.setItem('lastContentDate', new Date().toDateString())
    }
    
    // Check if date has changed since last visit
    const lastDate = localStorage.getItem('lastContentDate')
    const currentDate = new Date().toDateString()
    
    if (lastDate !== currentDate) {
      updateContent()
    }
    
    // Check for date change every minute
    const interval = setInterval(() => {
      const storedDate = localStorage.getItem('lastContentDate')
      const nowDate = new Date().toDateString()
      
      if (storedDate !== nowDate) {
        updateContent()
      }
    }, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [])

  if (compact) {
    return (
      <div className={`bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
            Daily Learning
          </h3>
          <span className="text-xs text-gray-500 bg-white px-2.5 py-1 rounded-full shadow-sm">Day {todayContent.day}/70</span>
        </div>

        {/* Compact Word */}
        <div className="bg-white rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-gray-900">{todayContent.word.word}</h4>
              </div>
              <p className="text-xs text-gray-600 line-clamp-1">{todayContent.word.meaning}</p>
            </div>
          </div>
        </div>

        {/* Compact Phrase */}
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <MessageCircle className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm font-bold text-gray-900">"{todayContent.phrase.phrase}"</h4>
              </div>
              <p className="text-xs text-gray-600 line-clamp-1">{todayContent.phrase.meaning}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-500 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-7 py-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2.5 animate-pulse" />
            Word & Phrase of the Day
          </h3>
          <span className="text-sm text-purple-100 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">Day {todayContent.day}/70</span>
        </div>
      </div>

      <div className="p-7 space-y-7">
        {/* Word Section */}
        <div className="bg-white rounded-2xl border border-indigo-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <div 
            className="p-5 cursor-pointer hover:bg-indigo-50/50 transition-all duration-200"
            onClick={() => setExpandedWord(!expandedWord)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-3">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-xl font-bold text-gray-900">{todayContent.word.word}</h4>
                </div>
                <p className="text-sm text-gray-700 italic mb-2">{todayContent.word.meaning}</p>
                
                {expandedWord && (
                  <div className="space-y-4 mt-5">
                    {/* Examples */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">📝 Examples:</p>
                      <ul className="space-y-2">
                        {todayContent.word.examples.map((example, idx) => (
                          <li key={idx} className="text-sm text-gray-600 pl-4 border-l-3 border-indigo-300 py-1 hover:bg-indigo-50/50 transition-colors duration-200">
                            "{example}"
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Why it matters */}
                    <div className="bg-indigo-50 rounded-xl p-4 shadow-sm">
                      <p className="text-xs font-semibold text-indigo-900 mb-2">💡 Why it matters:</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{todayContent.word.whyItMatters}</p>
                    </div>

                    {/* Etymology */}
                    <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                      <p className="text-xs font-semibold text-gray-700 mb-2">📚 Etymology:</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{todayContent.word.etymology}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <button className="ml-3 text-indigo-600 hover:text-indigo-800 transition-all duration-200 p-1 hover:bg-indigo-100 rounded-lg">
                {expandedWord ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Phrase Section */}
        <div className="bg-white rounded-2xl border border-purple-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <div 
            className="p-5 cursor-pointer hover:bg-purple-50/50 transition-all duration-200"
            onClick={() => setExpandedPhrase(!expandedPhrase)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-3">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  <h4 className="text-xl font-bold text-gray-900">"{todayContent.phrase.phrase}"</h4>
                </div>
                <p className="text-sm text-gray-700 italic mb-2">{todayContent.phrase.meaning}</p>
                
                {expandedPhrase && (
                  <div className="space-y-4 mt-5">
                    {/* Examples */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">📝 Examples:</p>
                      <ul className="space-y-2">
                        {todayContent.phrase.examples.map((example, idx) => (
                          <li key={idx} className="text-sm text-gray-600 pl-4 border-l-3 border-purple-300 py-1 hover:bg-purple-50/50 transition-colors duration-200">
                            "{example}"
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Why it sounds professional */}
                    <div className="bg-purple-50 rounded-xl p-4 shadow-sm">
                      <p className="text-xs font-semibold text-purple-900 mb-2">💼 Why it sounds professional:</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{todayContent.phrase.whyItSounds}</p>
                    </div>

                    {/* Origin */}
                    <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                      <p className="text-xs font-semibold text-gray-700 mb-2">🎯 Origin:</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{todayContent.phrase.origin}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <button className="ml-3 text-purple-600 hover:text-purple-800 transition-all duration-200 p-1 hover:bg-purple-100 rounded-lg">
                {expandedPhrase ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WordPhraseCard
