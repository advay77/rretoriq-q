# Technical Interview Questions - Subject-Based Classification

## Overview
The technical interview questions have been restructured from a difficulty-based system (Easy/Medium/Hard) to a **subject-based classification** with 2 levels per subject.

## New Structure

### Subjects
- **DBMS** (Database Management Systems)
- **C** (C Programming Language)
- **OOPs** (Object-Oriented Programming)
- **DS** (Data Structures)

### Difficulty Levels per Subject
- **Easy** - Beginner level questions
- **Advanced** - Expert level questions

### Question Count
- **80 total technical questions**
  - 4 subjects × 2 levels × 10 questions = 80 questions

## Files Modified

### 1. Question Type Definitions
**File:** `src/types/questions.ts`

Added:
```typescript
subject?: 'DBMS' | 'C' | 'OOPs' | 'DS'
```

Updated difficulty type:
```typescript
difficulty: 'Easy' | 'Medium' | 'Hard' | 'Advanced'
```

### 2. New Question Data File
**File:** `src/data/technicalQuestions.ts` (NEW)

Contains 80 structured technical questions organized by:
- Subject (DBMS, C, OOPs, DS)
- Difficulty (Easy, Advanced)

Each question includes:
- id (e.g., `tech-dbms-easy-001`)
- text (the question)
- type: 'Technical'
- difficulty: 'Easy' or 'Advanced'
- subject: 'DBMS', 'C', 'OOPs', or 'DS'
- skillsEvaluated: array of skills
- metadata: expectedAnswerLength, keyPoints

Example structure:
```typescript
{
  id: "tech-dbms-easy-001",
  text: "What does ACID stand for in databases?",
  type: "Technical",
  difficulty: "Easy",
  subject: "DBMS",
  skillsEvaluated: ["Database Fundamentals"],
  metadata: {
    expectedAnswerLength: 60,
    keyPoints: ["Atomicity", "Consistency", "Isolation", "Durability"]
  }
}
```

### 3. Master Question File
**File:** `src/data/allQuestions.ts`

Changes:
- Imported `technicalQuestionsSubjectBased` from `./technicalQuestions`
- Replaced old technical questions section (1330+ lines) with spread operator:
  ```typescript
  ...technicalQuestionsSubjectBased,
  ```
- File reduced from 3798 lines to 2459 lines

### 4. Interview Page UI
**File:** `src/pages/ai-interview/AIInterviewPage.tsx`

#### Added Subject Selection:
- New subject selector displayed only for Technical interviews
- 4 subject buttons: DBMS, C, OOPs, DS
- Each button shows full name and abbreviation

#### Updated Difficulty Selection:
- Technical interviews: 3 levels (Mixed, Easy, Advanced)
- HR/Aptitude interviews: 4 levels (Mixed, Easy, Medium, Hard)
- Dynamic grid layout (3 columns for Technical, 4 for others)

#### Updated Session Configuration:
```typescript
const [sessionConfig, setSessionConfig] = useState({
  questionCount: 5,
  difficulty: 'Mixed',
  subject: '', // New field for technical subject
  includeAIEvaluation: true,
  enableRealTimeTranscription: true
});
```

#### Updated Question Loading:
- Added subject filter for Technical interviews
- Filters passed to QuestionBankService:
  ```typescript
  if (questionType === 'Technical' && sessionConfig.subject) {
    filters.subject = sessionConfig.subject;
  }
  ```

#### Updated Session Summary:
- Displays selected subject for Technical interviews
- Shows "Subject: DBMS" (or C, OOPs, DS) in summary panel

### 5. Question Bank Service
**File:** `src/services/QuestionBankService.ts`

Added subject filtering support:
```typescript
if (filters.subject) {
  filteredQuestions = filteredQuestions.filter(q => 
    q.subject?.toLowerCase() === filters.subject?.toLowerCase()
  )
}
```

## Question Examples

### DBMS Easy
- What does ACID stand for in databases?
- Explain difference between DELETE and TRUNCATE
- What is a primary key?
- What are SQL joins?

### DBMS Advanced
- Explain MVCC in PostgreSQL
- How do database sharding strategies work?
- Explain optimistic vs pessimistic locking
- What are isolation levels in transactions?

### C Easy
- What is a pointer?
- Difference between array and pointer
- What are storage classes?
- Explain malloc and free

### C Advanced
- Explain volatile keyword and when to use it
- How does memory alignment work?
- Explain undefined behavior in C
- What is pointer arithmetic?

### OOPs Easy
- What are the 4 pillars of OOP?
- Difference between class and object
- What is encapsulation?
- Explain polymorphism

### OOPs Advanced
- Explain SOLID principles
- What is dependency injection?
- Difference between composition and inheritance
- Explain design patterns like Singleton, Factory

### DS Easy
- What is Big O notation?
- Difference between array and linked list
- What is a stack? LIFO example
- Explain queue (FIFO)

### DS Advanced
- Explain self-balancing BST (AVL, Red-Black)
- When to use Trie vs Hash Table?
- Explain graph traversal algorithms (DFS vs BFS)
- What are different tree traversal methods?

## User Experience Flow

1. **Select Interview Type:** Technical
2. **Choose Subject:** DBMS, C, OOPs, or DS
3. **Select Difficulty:** Mixed, Easy, or Advanced
4. **Set Question Count:** 3, 5, 7, or 10
5. **Start Session:** System loads filtered questions based on selections

### Example Session:
- Type: Technical
- Subject: DBMS
- Difficulty: Easy
- Questions: 5

Result: 5 random Easy-level DBMS questions from the pool of 10 Easy DBMS questions.

## Technical Benefits

1. **Better Organization:** Questions grouped logically by subject
2. **Targeted Practice:** Users can focus on specific technical areas
3. **Clearer Difficulty Progression:** 2 levels (Easy → Advanced) per subject
4. **Scalability:** Easy to add more subjects (e.g., Python, Java, Networks)
5. **Reduced File Size:** Removed redundant old questions (1330+ lines removed)

## Deployment Status

✅ **Build:** Successful (22.13s)
✅ **Deploy:** Complete (Firebase Hosting)
✅ **URL:** https://rretoriq25.web.app

## Testing Checklist

- [ ] Test HR interview (should show 4 difficulty levels)
- [ ] Test Aptitude interview (should show 4 difficulty levels)
- [ ] Test Technical interview - DBMS subject selection
- [ ] Test Technical interview - C subject selection
- [ ] Test Technical interview - OOPs subject selection
- [ ] Test Technical interview - DS subject selection
- [ ] Test Technical Easy questions load correctly
- [ ] Test Technical Advanced questions load correctly
- [ ] Test Mixed difficulty (all subjects mixed)
- [ ] Verify subject displayed in session summary
- [ ] Verify question filtering works correctly

## Future Enhancements

1. Add more subjects (Python, Java, Networking, OS)
2. Add Medium difficulty level for technical questions
3. Add subject-specific analytics
4. Create subject progress tracking
5. Add recommended subject based on user performance
