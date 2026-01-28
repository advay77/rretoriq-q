import { allQuestions } from '../data/allQuestions'
import type { Question, QuestionFilters, QuestionStats } from '../types/questions'

export class QuestionBankService {
  // Initialize question bank with data from allQuestions.ts
  static async initializeQuestionBank(): Promise<void> {
    try {
      // No initialization needed as we're using static data
      console.log('✅ Question bank loaded from static data')
      console.log(`📊 Total questions available: ${allQuestions.length}`)
      
      // Log breakdown by type and difficulty
      const breakdown = this.getQuestionBreakdown()
      console.log('📋 Question breakdown:', breakdown)
    } catch (error) {
      console.error('❌ Error loading question bank:', error)
      throw error
    }
  }

  // Get question breakdown for logging
  static getQuestionBreakdown(): Record<string, Record<string, number>> {
    const breakdown: Record<string, Record<string, number>> = {}
    
    allQuestions.forEach(question => {
      if (!breakdown[question.type]) {
        breakdown[question.type] = {}
      }
      if (!breakdown[question.type][question.difficulty]) {
        breakdown[question.type][question.difficulty] = 0
      }
      breakdown[question.type][question.difficulty]++
    })
    
    return breakdown
  }

  // Get questions with filters from static data
  static async getQuestions(filters: QuestionFilters = {}): Promise<Question[]> {
    try {
      let filteredQuestions = [...allQuestions]
      
      if (filters.type) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.type.toLowerCase() === filters.type?.toLowerCase()
        )
      }
      
      if (filters.difficulty) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.difficulty.toLowerCase() === filters.difficulty?.toLowerCase()
        )
      }
      
      if (filters.subject) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.subject?.toLowerCase() === filters.subject?.toLowerCase()
        )
      }
      
      if (filters.category) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.metadata?.industry?.toLowerCase() === filters.category?.toLowerCase()
        )
      }

      console.log(`📋 Retrieved ${filteredQuestions.length} questions with filters:`, filters)
      return filteredQuestions
    } catch (error) {
      console.error('Error fetching questions:', error)
      throw error
    }
  }

  // Store questions method (now a no-op since we use static data)
  static async storeQuestions(_questions: Question[]): Promise<void> {
    console.log('📝 Store operation skipped - using static question data')
    return Promise.resolve()
  }

  // Get shuffled questions (ALWAYS SHUFFLED)
  static async getShuffledQuestions(
    count: number,
    filters: QuestionFilters = {}
  ): Promise<Question[]> {
    try {
      const allMatchingQuestions = await this.getQuestions(filters)
      
      if (allMatchingQuestions.length === 0) {
        console.warn(`⚠️ No questions found matching filters:`, filters)
        return []
      }
      
      // Fisher-Yates shuffle algorithm for better randomization
      const shuffled = [...allMatchingQuestions]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      
      const result = shuffled.slice(0, Math.min(count, shuffled.length))
      console.log(`🎯 Retrieved ${result.length} shuffled questions out of ${allMatchingQuestions.length} available`)
      return result
    } catch (error) {
      console.error('Error fetching shuffled questions:', error)
      throw error
    }
  }

  // Get questions for practice session (always different order)
  static async getPracticeQuestions(
    type: 'Aptitude' | 'Technical' | 'HR',
    difficulty: 'Easy' | 'Medium' | 'Hard',
    count: number = 10
  ): Promise<Question[]> {
    try {
      console.log(`Fetching ${count} shuffled ${difficulty} ${type} questions...`)
      
      const questions = await this.getShuffledQuestions(count, { type, difficulty })
      
      console.log(`✅ Retrieved ${questions.length} shuffled questions`)
      return questions
    } catch (error) {
      console.error('Error fetching practice questions:', error)
      throw error
    }
  }

  // Get question statistics
  static async getQuestionStats(): Promise<QuestionStats> {
    try {
      const stats: QuestionStats = {
        total: allQuestions.length,
        byType: {},
        byDifficulty: {}
      }
      
      allQuestions.forEach(question => {
        // Count by type
        stats.byType[question.type] = (stats.byType[question.type] || 0) + 1
        
        // Count by difficulty
        stats.byDifficulty[question.difficulty] = (stats.byDifficulty[question.difficulty] || 0) + 1
      })
      
      return stats
    } catch (error) {
      console.error('Error fetching question stats:', error)
      throw error
    }
  }

  // Ensure questions are always returned in random order
  static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
}