import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Question } from '../types/questions';
import type { AnswerAnalysis } from './openAIAnalysisService';

export interface StoredAnswer {
  id?: string;
  sessionId: string;
  userId: string;
  questionId: string;
  question: Question;
  audioBlob?: Blob;
  audioUrl?: string;
  transcript: string;
  transcriptionConfidence?: number;
  aiEvaluation?: AnswerAnalysis;
  duration: number; // recording duration in seconds
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface InterviewSession {
  id?: string;
  userId: string;
  sessionName: string;
  sessionType: 'HR' | 'Technical' | 'Aptitude' | 'Mixed';
  totalQuestions: number;
  completedQuestions: number;
  status: 'in_progress' | 'completed' | 'paused' | 'abandoned';
  startedAt: Timestamp;
  completedAt?: Timestamp;
  averageScore?: number;
  totalDuration?: number; // total session time in seconds
  answers: StoredAnswer[];
  metadata?: {
    difficulty?: string;
    tags?: string[];
    notes?: string;
  };
}

export interface UserProgress {
  userId: string;
  totalSessions: number;
  totalQuestions: number;
  averageScore: number;
  strengthAreas: string[];
  improvementAreas: string[];
  lastSessionDate: Timestamp;
  streakDays: number;
  skillProgression: Record<string, {
    totalAttempts: number;
    averageScore: number;
    trend: 'improving' | 'stable' | 'declining';
    lastScore: number;
  }>;
}

export class AnswerStorageService {
  private readonly COLLECTIONS = {
    SESSIONS: 'interview_sessions',
    ANSWERS: 'interview_answers',
    PROGRESS: 'user_progress'
  };

  // ==================== SESSION MANAGEMENT ====================

  async createSession(
    userId: string, 
    sessionName: string, 
    sessionType: InterviewSession['sessionType'],
    totalQuestions: number,
    metadata?: InterviewSession['metadata']
  ): Promise<string> {
    try {
      const sessionData: Omit<InterviewSession, 'id'> = {
        userId,
        sessionName,
        sessionType,
        totalQuestions,
        completedQuestions: 0,
        status: 'in_progress',
        startedAt: Timestamp.now(),
        answers: [],
        metadata
      };

      const docRef = await addDoc(collection(db, this.COLLECTIONS.SESSIONS), sessionData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error('Failed to create interview session');
    }
  }

  async getSession(sessionId: string): Promise<InterviewSession | null> {
    try {
      const docRef = doc(db, this.COLLECTIONS.SESSIONS, sessionId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as InterviewSession;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting session:', error);
      throw new Error('Failed to retrieve session');
    }
  }

  async updateSessionStatus(
    sessionId: string, 
    status: InterviewSession['status'],
    additionalUpdates?: Partial<InterviewSession>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTIONS.SESSIONS, sessionId);
      const updateData: any = {
        status,
        updatedAt: Timestamp.now(),
        ...additionalUpdates
      };

      if (status === 'completed') {
        updateData.completedAt = Timestamp.now();
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating session status:', error);
      throw new Error('Failed to update session status');
    }
  }

  async getUserSessions(
    userId: string, 
    limitCount: number = 20
  ): Promise<InterviewSession[]> {
    try {
      const q = query(
        collection(db, this.COLLECTIONS.SESSIONS),
        where('userId', '==', userId),
        orderBy('startedAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as InterviewSession[];
    } catch (error) {
      console.error('Error getting user sessions:', error);
      throw new Error('Failed to retrieve user sessions');
    }
  }

  // ==================== ANSWER MANAGEMENT ====================

  async storeAnswer(answerData: Omit<StoredAnswer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const timestamp = Timestamp.now();
      const fullAnswerData: Omit<StoredAnswer, 'id'> = {
        ...answerData,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      // Store in answers collection
      const docRef = await addDoc(collection(db, this.COLLECTIONS.ANSWERS), fullAnswerData);
      
      // Update session with new answer
      await this.updateSessionWithAnswer(answerData.sessionId, {
        ...fullAnswerData,
        id: docRef.id
      });

      return docRef.id;
    } catch (error) {
      console.error('Error storing answer:', error);
      throw new Error('Failed to store answer');
    }
  }

  async updateAnswerEvaluation(answerId: string, aiEvaluation: AnswerAnalysis): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTIONS.ANSWERS, answerId);
      await updateDoc(docRef, {
        aiEvaluation,
        updatedAt: Timestamp.now()
      });

      // Update session statistics
      const answer = await this.getAnswer(answerId);
      if (answer) {
        await this.updateSessionStats(answer.sessionId);
      }
    } catch (error) {
      console.error('Error updating answer evaluation:', error);
      throw new Error('Failed to update answer evaluation');
    }
  }

  async getAnswer(answerId: string): Promise<StoredAnswer | null> {
    try {
      const docRef = doc(db, this.COLLECTIONS.ANSWERS, answerId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as StoredAnswer;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting answer:', error);
      throw new Error('Failed to retrieve answer');
    }
  }

  async getSessionAnswers(sessionId: string): Promise<StoredAnswer[]> {
    try {
      const q = query(
        collection(db, this.COLLECTIONS.ANSWERS),
        where('sessionId', '==', sessionId),
        orderBy('createdAt', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StoredAnswer[];
    } catch (error) {
      console.error('Error getting session answers:', error);
      throw new Error('Failed to retrieve session answers');
    }
  }

  // ==================== PROGRESS TRACKING ====================

  async updateUserProgress(userId: string): Promise<void> {
    try {
      const sessions = await this.getUserSessions(userId, 100); // Get more for accurate stats
      const allAnswers = await this.getUserAnswers(userId, 500);

      const completedSessions = sessions.filter(s => s.status === 'completed');
      const evaluatedAnswers = allAnswers.filter(a => a.aiEvaluation);

      if (evaluatedAnswers.length === 0) return;

      const averageScore = evaluatedAnswers.reduce((sum, answer) => 
        sum + (answer.aiEvaluation?.overallScore || 0), 0
      ) / evaluatedAnswers.length;

      // Calculate skill progression
      const skillProgression: Record<string, any> = {};
      evaluatedAnswers.forEach(answer => {
        answer.question.skillsEvaluated.forEach(skill => {
          if (!skillProgression[skill]) {
            skillProgression[skill] = {
              totalAttempts: 0,
              scores: [],
              averageScore: 0
            };
          }
          skillProgression[skill].totalAttempts++;
          skillProgression[skill].scores.push(answer.aiEvaluation!.overallScore);
        });
      });

      // Calculate trends and final skill data
      Object.keys(skillProgression).forEach(skill => {
        const data = skillProgression[skill];
        data.averageScore = data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.scores.length;
        data.lastScore = data.scores[data.scores.length - 1];
        
        // Simple trend calculation
        if (data.scores.length >= 3) {
          const recent = data.scores.slice(-3);
          const older = data.scores.slice(0, -3);
          const recentAvg = recent.reduce((sum: number, score: number) => sum + score, 0) / recent.length;
          const olderAvg = older.length > 0 ? older.reduce((sum: number, score: number) => sum + score, 0) / older.length : recentAvg;
          
          if (recentAvg > olderAvg + 5) data.trend = 'improving';
          else if (recentAvg < olderAvg - 5) data.trend = 'declining';
          else data.trend = 'stable';
        } else {
          data.trend = 'stable';
        }
        
        delete data.scores; // Remove raw scores from final data
      });

      // Calculate streak days (simplified)
      const lastSessionDate = completedSessions.length > 0 ? completedSessions[0].startedAt : Timestamp.now();
      
      const progressData: UserProgress = {
        userId,
        totalSessions: completedSessions.length,
        totalQuestions: evaluatedAnswers.length,
        averageScore,
        strengthAreas: this.getTopSkills(skillProgression, 'high'),
        improvementAreas: this.getTopSkills(skillProgression, 'low'),
        lastSessionDate,
        streakDays: this.calculateStreak(completedSessions),
        skillProgression
      };

      const docRef = doc(db, this.COLLECTIONS.PROGRESS, userId);
      await updateDoc(docRef, progressData as any).catch(async () => {
        // Document doesn't exist, create it
        await addDoc(collection(db, this.COLLECTIONS.PROGRESS), progressData);
      });

    } catch (error) {
      console.error('Error updating user progress:', error);
      throw new Error('Failed to update user progress');
    }
  }

  async getUserProgress(userId: string): Promise<UserProgress | null> {
    try {
      const docRef = doc(db, this.COLLECTIONS.PROGRESS, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProgress;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw new Error('Failed to retrieve user progress');
    }
  }

  // ==================== UTILITY METHODS ====================

  private async updateSessionWithAnswer(sessionId: string, answer: StoredAnswer): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) return;

    const updatedAnswers = [...(session.answers || []), answer];
    await updateDoc(doc(db, this.COLLECTIONS.SESSIONS, sessionId), {
      answers: updatedAnswers,
      completedQuestions: updatedAnswers.length,
      updatedAt: Timestamp.now()
    });
  }

  private async updateSessionStats(sessionId: string): Promise<void> {
    const answers = await this.getSessionAnswers(sessionId);
    const evaluatedAnswers = answers.filter(a => a.aiEvaluation);
    
    if (evaluatedAnswers.length > 0) {
      const averageScore = evaluatedAnswers.reduce((sum, answer) => 
        sum + (answer.aiEvaluation?.overallScore || 0), 0
      ) / evaluatedAnswers.length;

      const totalDuration = answers.reduce((sum, answer) => sum + answer.duration, 0);

      await updateDoc(doc(db, this.COLLECTIONS.SESSIONS, sessionId), {
        averageScore,
        totalDuration,
        updatedAt: Timestamp.now()
      });
    }
  }

  private async getUserAnswers(userId: string, limitCount: number): Promise<StoredAnswer[]> {
    try {
      const q = query(
        collection(db, this.COLLECTIONS.ANSWERS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StoredAnswer[];
    } catch (error) {
      console.error('Error getting user answers:', error);
      return [];
    }
  }

  private getTopSkills(skillProgression: Record<string, any>, type: 'high' | 'low'): string[] {
    const skills = Object.entries(skillProgression)
      .sort(([, a], [, b]) => type === 'high' ? b.averageScore - a.averageScore : a.averageScore - b.averageScore)
      .slice(0, 5)
      .map(([skill]) => skill);
    
    return skills;
  }

  private calculateStreak(sessions: InterviewSession[]): number {
    // Simplified streak calculation
    // In a real implementation, you'd check consecutive days
    if (sessions.length === 0) return 0;
    
    const today = new Date();
    const lastSession = sessions[0].startedAt.toDate();
    const daysDiff = Math.floor((today.getTime() - lastSession.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDiff <= 1 ? Math.min(sessions.length, 30) : 0; // Cap at 30 days
  }

  // ==================== CLEANUP METHODS ====================

  async deleteSession(sessionId: string): Promise<void> {
    try {
      // Delete all answers for the session
      const answers = await this.getSessionAnswers(sessionId);
      const deletePromises = answers.map(answer => 
        deleteDoc(doc(db, this.COLLECTIONS.ANSWERS, answer.id!))
      );
      await Promise.all(deletePromises);

      // Delete the session
      await deleteDoc(doc(db, this.COLLECTIONS.SESSIONS, sessionId));
    } catch (error) {
      console.error('Error deleting session:', error);
      throw new Error('Failed to delete session');
    }
  }

  async deleteAnswer(answerId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTIONS.ANSWERS, answerId));
    } catch (error) {
      console.error('Error deleting answer:', error);
      throw new Error('Failed to delete answer');
    }
  }
}