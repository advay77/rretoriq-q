import { QuestionBankService } from '../services/QuestionBankService'
import { allQuestions } from './allQuestions'
import type { Question } from '../types/questions'

// Filter questions by type
const hrQuestions = allQuestions.filter(q => q.type === 'HR')
const technicalQuestions = allQuestions.filter(q => q.type === 'Technical')
const aptitudeQuestions = allQuestions.filter(q => q.type === 'Aptitude')

/**
 * Initialize HR Questions in Firestore
 */
export const initializeHRQuestions = async (): Promise<void> => {
  try {
    console.log('🚀 Starting HR questions initialization...')
    
    await QuestionBankService.storeQuestions(hrQuestions)
    
    console.log('✅ HR questions initialized successfully!')
    console.log(`📊 Total HR questions stored: ${hrQuestions.length}`)
    
    // Log breakdown by difficulty
    const breakdown = hrQuestions.reduce((acc, q) => {
      acc[q.difficulty] = (acc[q.difficulty] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    console.log('📈 HR Questions breakdown:')
    console.log(`   Easy: ${breakdown.Easy || 0}`)
    console.log(`   Medium: ${breakdown.Medium || 0}`)
    console.log(`   Hard: ${breakdown.Hard || 0}`)
    
    // Test shuffling for HR questions
    const shuffledTest = await QuestionBankService.getShuffledQuestions(5, { 
      type: 'HR', 
      difficulty: 'Easy' 
    })
    console.log('🔀 Sample shuffled HR questions:', shuffledTest.map(q => q.id))
    
  } catch (error) {
    console.error('❌ Failed to initialize HR questions:', error)
    throw error
  }
}

/**
 * Initialize Technical Questions in Firestore
 */
export const initializeTechnicalQuestions = async (): Promise<void> => {
  try {
    console.log('🚀 Starting Technical questions initialization...')
    
    await QuestionBankService.storeQuestions(technicalQuestions)
    
    console.log('✅ Technical questions initialized successfully!')
    console.log(`📊 Total Technical questions stored: ${technicalQuestions.length}`)
    
    // Log breakdown by difficulty
    const breakdown = technicalQuestions.reduce((acc, q) => {
      acc[q.difficulty] = (acc[q.difficulty] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    console.log('📈 Technical Questions breakdown:')
    console.log(`   Easy: ${breakdown.Easy || 0}`)
    console.log(`   Medium: ${breakdown.Medium || 0}`)
    console.log(`   Hard: ${breakdown.Hard || 0}`)
    
    // Test shuffling for Technical questions
    const shuffledTest = await QuestionBankService.getShuffledQuestions(5, { 
      type: 'Technical', 
      difficulty: 'Easy' 
    })
    console.log('🔀 Sample shuffled Technical questions:', shuffledTest.map(q => q.id))
    
  } catch (error) {
    console.error('❌ Failed to initialize Technical questions:', error)
    throw error
  }
}

/**
 * Initialize Aptitude Questions in Firestore
 */
export const initializeAptitudeQuestions = async (): Promise<void> => {
  try {
    console.log('🚀 Starting Aptitude questions initialization...')
    
    await QuestionBankService.storeQuestions(aptitudeQuestions)
    
    console.log('✅ Aptitude questions initialized successfully!')
    console.log(`📊 Total Aptitude questions stored: ${aptitudeQuestions.length}`)
    
    // Log breakdown by difficulty
    const breakdown = aptitudeQuestions.reduce((acc, q) => {
      acc[q.difficulty] = (acc[q.difficulty] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    console.log('📈 Aptitude Questions breakdown:')
    console.log(`   Easy: ${breakdown.Easy || 0}`)
    console.log(`   Medium: ${breakdown.Medium || 0}`)
    console.log(`   Hard: ${breakdown.Hard || 0}`)
    
    // Test shuffling for Aptitude questions
    const shuffledTest = await QuestionBankService.getShuffledQuestions(5, { 
      type: 'Aptitude', 
      difficulty: 'Easy' 
    })
    console.log('🔀 Sample shuffled Aptitude questions:', shuffledTest.map(q => q.id))
    
  } catch (error) {
    console.error('❌ Failed to initialize Aptitude questions:', error)
    throw error
  }
}

/**
 * Initialize ALL Questions in Firestore (HR + Technical + Aptitude)
 */
export const initializeAllQuestions = async (): Promise<void> => {
  try {
    console.log('🚀 Starting complete question bank initialization...')
    console.log(`📊 Total questions to initialize: ${allQuestions.length}`)
    
    // Initialize all questions at once
    await QuestionBankService.storeQuestions(allQuestions)
    
    // Get final statistics
    const stats = await QuestionBankService.getQuestionStats()
    
    console.log('✅ All questions initialized successfully!')
    console.log('📊 Final Question Bank Statistics:')
    console.log(`   Total Questions: ${stats.total}`)
    console.log('   By Type:', stats.byType)
    console.log('   By Difficulty:', stats.byDifficulty)
    
    // Test shuffling for different categories
    console.log('🔀 Testing shuffling across all categories...')
    
    const hrTest = await QuestionBankService.getShuffledQuestions(3, { type: 'HR' })
    const techTest = await QuestionBankService.getShuffledQuestions(3, { type: 'Technical' })
    const aptTest = await QuestionBankService.getShuffledQuestions(3, { type: 'Aptitude' })
    
    console.log('   HR Sample:', hrTest.map(q => q.id))
    console.log('   Technical Sample:', techTest.map(q => q.id))
    console.log('   Aptitude Sample:', aptTest.map(q => q.id))
    
  } catch (error) {
    console.error('❌ Failed to initialize complete question bank:', error)
    throw error
  }
}

/**
 * Get question bank summary for debugging
 */
export const getQuestionSummary = (): { hr: number; technical: number; aptitude: number; total: number } => {
  return {
    hr: hrQuestions.length,
    technical: technicalQuestions.length,
    aptitude: aptitudeQuestions.length,
    total: allQuestions.length
  }
}

/**
 * Utility function to get questions by type from local data
 */
export const getQuestionsByType = (type: 'HR' | 'Technical' | 'Aptitude'): Question[] => {
  switch (type) {
    case 'HR':
      return hrQuestions
    case 'Technical':
      return technicalQuestions
    case 'Aptitude':
      return aptitudeQuestions
    default:
      return []
  }
}