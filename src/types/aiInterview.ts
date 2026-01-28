import type { Question } from './questions';
import type { AnswerAnalysis } from '../services/openAIAnalysisService';

// AI Evaluation Types (using AnswerAnalysis from openAIAnalysisService)
// Note: AnswerAnalysis interface is imported from '../services/openAIAnalysisService'

// Speech Recognition Types
interface SpeechGrammarList {
  length: number;
  item(index: number): SpeechGrammar;
  addFromURI(src: string, weight?: number): void;
  addFromString(string: string, weight?: number): void;
}

interface SpeechGrammar {
  src: string;
  weight: number;
}



export interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message?: string;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  grammars: SpeechGrammarList;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  serviceURI: string;
  
  start(): void;
  stop(): void;
  abort(): void;
  
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
}

// AI Interview System Types
export interface AIInterviewConfig {
  openAiApiKey: string;
  preferWhisper: boolean;
  fallbackToBrowser: boolean;
  maxRecordingDuration: number;
  defaultQuestionsPerSession: number;
  enableSessionPersistence: boolean;
  autoSaveInterval: number;
  debugMode: boolean;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  error: string | null;
}

export interface TranscriptionState {
  transcript: string;
  confidence: number;
  isProcessing: boolean;
  error: string | null;
  service: 'whisper' | 'browser' | null;
}

export interface EvaluationState {
  feedback: AnswerAnalysis | null;
  isProcessing: boolean;
  error: string | null;
  processingTimeMs: number;
}

export interface SessionFlow {
  currentStep: 'recording' | 'transcribing' | 'evaluating' | 'reviewing' | 'complete';
  canProceed: boolean;
  canRetry: boolean;
  canSkip: boolean;
  error: string | null;
}

// Enhanced Question Types for AI System
export interface AIQuestionMetadata {
  expectedAnswerLength: number;
  keyPoints: string[];
  industry?: string;
  evaluationCriteria?: {
    weight_relevance?: number;
    weight_completeness?: number;
    weight_clarity?: number;
    weight_technical_accuracy?: number;
    weight_professionalism?: number;
  };
  followUpQuestions?: string[];
  commonMistakes?: string[];
  idealAnswerStructure?: string[];
}

export interface EnhancedQuestion extends Question {
  metadata: AIQuestionMetadata;
  aiPromptContext?: string;
  transcriptionHints?: string[]; // Words to help speech recognition
}

// Session Management Types
export interface SessionConfiguration {
  sessionType: 'HR' | 'Technical' | 'Aptitude' | 'Mixed';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  questionCount: number;
  timeLimit?: number; // in minutes
  enableAIEvaluation: boolean;
  enableRealTimeTranscription: boolean;
  allowSkipping: boolean;
  allowRetries: boolean;
}

export interface SessionProgress {
  currentQuestionIndex: number;
  totalQuestions: number;
  completedQuestions: number;
  skippedQuestions: number;
  retriedQuestions: number;
  totalTimeSpent: number; // in seconds
  averageTimePerQuestion: number;
  currentScore: number;
  scoreHistory: number[];
}

export interface SessionMetrics {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  configuration: SessionConfiguration;
  progress: SessionProgress;
  finalScore: number;
  completionRate: number; // percentage
  difficulty: string;
  sessionType: string;
}

// Analytics and Progress Types
export interface SkillAnalytics {
  skillName: string;
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  trend: 'improving' | 'stable' | 'declining';
  confidenceLevel: number;
  lastAttemptDate: Date;
  recommendedFocus: string[];
}

export interface UserPerformanceReport {
  userId: string;
  reportPeriod: {
    startDate: Date;
    endDate: Date;
  };
  overallStats: {
    totalSessions: number;
    totalQuestions: number;
    averageScore: number;
    timeSpent: number; // in hours
    streakDays: number;
  };
  skillBreakdown: SkillAnalytics[];
  sessionTypePerformance: Record<string, {
    averageScore: number;
    totalSessions: number;
    preferredDifficulty: string;
  }>;
  improvementSuggestions: string[];
  strengthAreas: string[];
  focusAreas: string[];
  nextRecommendedSessions: EnhancedQuestion[];
}

// Error Handling Types
export interface AIInterviewError {
  type: 'recording' | 'transcription' | 'evaluation' | 'storage' | 'session' | 'configuration';
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  sessionId?: string;
  questionId?: string;
  userId?: string;
  recoverable: boolean;
  retryable: boolean;
}

export interface ErrorRecoveryAction {
  type: 'retry' | 'skip' | 'fallback' | 'reset' | 'exit';
  label: string;
  description: string;
  action: () => void | Promise<void>;
}

// Service Response Types
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: AIInterviewError;
  metadata?: {
    processingTime: number;
    serviceUsed: string;
    cost?: number;
    rateLimitRemaining?: number;
  };
}

// Real-time Communication Types
export interface RealTimeEvent {
  type: 'session_update' | 'question_change' | 'evaluation_complete' | 'error_occurred';
  sessionId: string;
  timestamp: Date;
  data: any;
}

export interface SessionEventHandler {
  onSessionStart?: (sessionId: string) => void;
  onQuestionChange?: (questionIndex: number, question: EnhancedQuestion) => void;
  onRecordingStart?: () => void;
  onRecordingComplete?: (audioBlob: Blob, duration: number) => void;
  onTranscriptionComplete?: (transcript: string, confidence: number) => void;
  onEvaluationComplete?: (feedback: AnswerAnalysis) => void;
  onSessionComplete?: (metrics: SessionMetrics) => void;
  onError?: (error: AIInterviewError, recoveryActions: ErrorRecoveryAction[]) => void;
}

// Export all types for use in components
export * from './questions';
export * from '../services/openAIAnalysisService';