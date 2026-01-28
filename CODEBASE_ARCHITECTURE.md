# Complete Codebase Architecture & Logic Map

## 🎯 Project Overview
**rretoriq** is an AI-powered interview practice platform with:
- **Frontend**: React + Vite + TypeScript (hosted on Firebase)
- **Backend**: Vercel serverless functions (Node.js API proxies)
- **AI Services**: OpenAI (Whisper for transcription, GPT for chat), Google Gemini (for answer analysis)
- **Database**: Firebase Firestore (user data, sessions, progress)
- **Auth**: Firebase Authentication

---

## 📁 Directory Structure & File Responsibilities

### **Root Configuration Files**
| File | Purpose |
|------|---------|
| `package.json` | Frontend dependencies: React, Vite, Firebase, TailwindCSS, React Query, Zustand |
| `vite.config.ts` | Vite build config, dev server settings, path aliases |
| `tsconfig.json` | TypeScript compiler options for the entire project |
| `tailwind.config.js` | TailwindCSS theme, colors, fonts, animations |
| `vercel.json` | Vercel deployment config for frontend (static site + rewrites) |
| `firebase.json` | Firebase Hosting config, rewrites, headers |

---

## 🎨 Frontend Architecture (`src/`)

### **Entry Points**
```
src/main.tsx          → App entry point, renders <App /> with providers
src/App.tsx           → Root component with React Router routes & layout
src/index.css         → Global CSS, TailwindCSS imports, custom animations
```

#### **`src/App.tsx` - Routing Logic**
**PUBLIC ROUTES** (no login required):
- `/` → Home page
- `/login` → Login page
- `/register` → Registration page
- `/pricing` → Pricing plans
- `/faq` → FAQ (recently made public)
- `/help` → Help Center (recently made public)
- `/about` → About Us (recently made public)
- `/business` → Business solutions
- `/schools` → Schools solutions

**PROTECTED ROUTES** (require authentication):
- `/dashboard` → User dashboard (sessions, progress overview)
- `/profile` → User profile & settings
- `/progress` → Detailed progress tracking & analytics
- `/ai-interview` → AI-powered interview practice session
- `/ielts` → IELTS practice module
- `/demo` → Demo/trial session
- `/plan-upgrade` → Subscription upgrade page

---

### **Pages (`src/pages/`)**

#### **Public Pages**
| File | Logic |
|------|-------|
| `Home.tsx` | Landing page with hero, features, pricing preview, testimonials |
| `auth/Login.tsx` | Firebase email/password login, Google OAuth, redirects to dashboard |
| `auth/Register.tsx` | User registration, creates Firebase user + Firestore profile |
| `pricing/Pricing.tsx` | Displays pricing tiers (Free, Pro, Enterprise) |
| `FAQ.tsx` | Frequently asked questions with accordion UI |
| `Help.tsx` | Help center with support articles |
| `AboutUs.tsx` | Company info, mission, team |
| `Business.tsx` | B2B enterprise solutions landing |
| `Schools.tsx` | Educational institution offerings |

#### **Protected Pages**
| File | Logic |
|------|-------|
| `dashboard/Dashboardnew.tsx` | Main dashboard: recent sessions, quick stats, upcoming interviews |
| `profile/Profile.tsx` | User profile editor: name, email, avatar, preferences |
| `progress/Progress.tsx` | Analytics: charts, score trends, skill breakdowns |
| `ai-interview/AIInterviewPage.tsx` | **Interview session launcher**: select category (HR/Technical/Aptitude), difficulty, duration, AI evaluation toggle |
| `ielts/IELTSPractice.tsx` | IELTS-specific practice module |
| `Demo.tsx` | Demo session for trial users |
| `PlanUpgrade.tsx` | Subscription management & billing |

---

### **Components (`src/components/`)**

#### **Core Interview Components**
| File | Responsibility |
|------|----------------|
| `EnhancedInterviewSession.tsx` | **MAIN INTERVIEW ORCHESTRATOR**: Manages entire interview flow (question display → recording → transcription → analysis → results). Integrates `AudioRecorder`, `VoiceRecorder`, calls analysis services, saves to Firebase. |
| `AudioRecorder.tsx` | **Audio capture & upload**: Records user audio, sends to Whisper proxy for transcription, handles permissions, displays waveform. |
| `VoiceRecorder.tsx` | Simplified voice recorder (alternative to AudioRecorder). |
| `AnalysisResults.tsx` | Displays AI feedback: scores (clarity, relevance, structure), strengths, weaknesses, suggestions. |
| `SessionResults.tsx` | Final results summary after interview completion: overall score, question-by-question breakdown, export options. |

#### **Layout & Navigation**
| File | Responsibility |
|------|----------------|
| `Layout.tsx` | App shell: navbar, sidebar, footer, user menu. Wraps all pages. |
| `ProtectedRoute.tsx` | Route guard: checks Firebase auth state, redirects unauthenticated users to `/login`. |
| `Breadcrumbs.tsx` | Navigation breadcrumbs for nested pages. |
| `ScrollToTop.tsx` | Auto-scrolls to top on route change. |

#### **SEO & Error Handling**
| File | Responsibility |
|------|----------------|
| `SEO.tsx` | React Helmet wrapper: sets page title, meta description, Open Graph tags per route. |
| `ErrorBoundary.tsx` | React error boundary: catches JS errors, displays fallback UI. |
| `MainErrorBoundary.tsx` | Top-level error boundary wrapping entire app. |

#### **Marketing & Misc**
| File | Responsibility |
|------|----------------|
| `CTAComponents.tsx` | Call-to-action buttons & banners for conversions. |
| `FeatureComponents.tsx` | Feature showcase cards (AI analysis, voice recording, progress tracking). |
| `TestimonialComponents.tsx` | User testimonials carousel. |
| `NewsletterSubscription.tsx` | Email capture form for newsletter. |
| `ProfileCompletionWizard.tsx` | Onboarding wizard for new users to complete profile. |
| `ComingSoonPage.tsx` | Placeholder for unfinished features. |

---

### **Services (`src/services/`) - Business Logic Layer**

#### **Authentication**
```typescript
// src/services/auth.ts
- signUp(email, password) → Creates Firebase user
- signIn(email, password) → Authenticates user
- signOut() → Logs out user
- resetPassword(email) → Sends password reset email
- getCurrentUser() → Returns current Firebase user
```

#### **AI Analysis Services**

**Gemini Analysis (Primary)**
```typescript
// src/services/geminiAnalysisService.ts
- analyzeAnswer(request: AnalysisRequest) → Promise<AnswerAnalysis>
  INPUT: { transcript, question, audioDuration, transcriptionConfidence }
  PROCESS:
    1. Generate detailed prompt with question context
    2. POST to server proxy: ${VITE_API_PROXY_BASE}/gemini-proxy
    3. Body: { model: 'gemini-2.0-flash', input: <prompt> }
    4. Parse JSON response (scores, feedback, suggestions)
  OUTPUT: { overallScore, feedback, scores, keyPoints, timeManagement }
  
- generateQuickFeedback(transcript, duration) → Instant metrics (word count, WPM, estimated score)
- isConfigured() → Always returns true (server holds keys)
```

**OpenAI Analysis (Alternative/Fallback)**
```typescript
// src/services/openAIAnalysisService.ts
- analyzeAnswer(request) → Similar to Gemini but uses OpenAI GPT-4
  POST to: ${VITE_API_PROXY_BASE}/openai-proxy
  Body: { messages: [{ role: 'system', content: <prompt> }], model: 'gpt-4' }
```

**Speech-to-Text (Whisper)**
```typescript
// src/services/speechToTextService.ts
- transcribeAudio(audioBlob: Blob) → Promise<{ text, confidence }>
  PROCESS:
    1. Create FormData with audio file
    2. POST multipart to: ${VITE_API_PROXY_BASE}/whisper-proxy
    3. Receive { text, usage: { seconds } }
  USED BY: AudioRecorder component during interview
```

#### **Data Persistence**

**User Profile Service**
```typescript
// src/services/userProfileService.ts
- createUserProfile(userId, data) → Creates Firestore doc at users/{userId}
- getUserProfile(userId) → Fetches user profile
- updateUserProfile(userId, updates) → Patches profile fields
  FIELDS: { name, email, avatar, preferences, subscription, createdAt }
```

**Dashboard Service**
```typescript
// src/services/dashboardService.ts
- getDashboardData(userId) → Aggregates:
  - Recent sessions (last 10)
  - Overall stats (total sessions, avg score, time spent)
  - Upcoming scheduled interviews
  - Skill distribution chart data
```

**Progress Service**
```typescript
// src/services/progressService.ts
- getUserProgress(userId) → Fetches all session results
- getSkillBreakdown(userId) → Groups scores by skill category
- getScoreTrends(userId) → Time-series data for charts
  COLLECTIONS: users/{userId}/sessions/{sessionId}
```

**Question Bank Service**
```typescript
// src/services/QuestionBankService.ts
- loadQuestions(category, difficulty) → Fetches questions from data/allQuestions.ts
- getRandomQuestions(count, filters) → Selects random subset
  CATEGORIES: 'hr', 'technical', 'aptitude', 'behavioral', 'case-study'
  DIFFICULTY: 'easy', 'medium', 'hard'
```

**Firebase Session Service**
```typescript
// src/services/firebaseSessionService.ts
- createSession(userId, config) → Creates Firestore session doc
- updateSessionAnswer(sessionId, questionId, answer, analysis) → Saves answer + AI feedback
- completeSession(sessionId, results) → Finalizes session with overall score
  STRUCTURE:
    sessions/{sessionId}
      - userId, category, difficulty, createdAt, completedAt
      - answers: [{ questionId, transcript, audio, analysis, scores }]
      - overallScore, averageScore, totalTime
```

**Answer Storage Service**
```typescript
// src/services/answerStorageService.ts
- saveAnswer(sessionId, questionId, audioBlob, transcript, analysis)
  STORAGE PATH: audio/{userId}/{sessionId}/{questionId}.webm
  FIRESTORE PATH: sessions/{sessionId}/answers/{questionId}
```

---

### **State Management (`src/store/`)**

```typescript
// src/store/authStore.ts (Zustand)
STATE:
  - user: User | null           // Current Firebase user
  - profile: UserProfile | null // Firestore user profile
  - loading: boolean
  - error: string | null

ACTIONS:
  - setUser(user) → Updates user state
  - setProfile(profile) → Updates profile
  - logout() → Clears state, signs out
  - initialize() → Listens to Firebase auth changes, loads profile

USAGE: Used by ProtectedRoute, Layout, Profile page
```

---

### **Data Structures (`src/data/`)**

```typescript
// src/data/allQuestions.ts
EXPORT: allQuestions: InterviewQuestion[]
  - id: string
  - question: string
  - type: 'behavioral' | 'technical' | 'situational' | 'case-study'
  - difficulty: 'easy' | 'medium' | 'hard'
  - skills: string[]              // ['communication', 'leadership', ...]
  - expectedDuration: number      // in seconds
  - category: 'hr' | 'technical' | 'aptitude'
  - sampleAnswer?: string
  - evaluationCriteria?: string[]

// src/data/initializeQuestions.ts
- Initializes question bank on first load
- Validates question format
```

---

### **Hooks (`src/hooks/`)**

```typescript
// src/hooks/useGSAPAnimation.ts
- Custom hook for GSAP scroll animations
- Used in landing pages for reveal effects
```

---

### **Types (`src/types/`)**

```typescript
// src/types/interview.ts
export interface InterviewSession {
  id: string
  userId: string
  category: string
  difficulty: string
  questions: InterviewQuestion[]
  answers: AnswerRecord[]
  startedAt: Date
  completedAt?: Date
  overallScore?: number
}

export interface AnswerRecord {
  questionId: string
  transcript: string
  audioUrl?: string
  analysis?: AnswerAnalysis
  recordedAt: Date
}

// src/types/aiInterview.ts
export interface SessionConfig {
  category: 'hr' | 'technical' | 'aptitude'
  difficulty: 'easy' | 'medium' | 'hard'
  questionCount: number
  duration: number
  includeAIEvaluation: boolean
}

// src/types/questions.ts
export interface InterviewQuestion {
  // (see allQuestions.ts structure above)
}

// src/types/global.d.ts
- Vite env variable types (VITE_API_PROXY_BASE, etc.)
- Window object extensions
```

---

### **Utilities (`src/lib/`)**

```typescript
// src/lib/firebase.ts
EXPORTS:
  - app: FirebaseApp              // Initialized Firebase app
  - auth: Auth                    // Firebase Auth instance
  - db: Firestore                 // Firestore database
  - storage: FirebaseStorage      // Cloud Storage
CONFIG: Uses env vars VITE_FIREBASE_* for credentials

// src/lib/api.ts
- Axios instance configured for API calls
- Base URL: process.env.VITE_API_PROXY_BASE
- Request/response interceptors
- Error handling helpers

// src/lib/apiUtils.ts
- getApiProxyBase() → Returns correct API proxy URL (production vs dev)
- buildProxyUrl(endpoint) → Constructs full proxy URL

// src/lib/utils.ts
- cn(...classes) → Tailwind className merger (clsx + tailwind-merge)
- formatDate(date) → Date formatting utility
- calculateWPM(text, duration) → Words per minute calculator
- scoreToGrade(score) → Converts numeric score to letter grade
```

---

## 🖥️ Backend Architecture (`vercel-api/`)

### **Serverless API Proxies (Vercel Functions)**

All backend files are serverless functions deployed to Vercel. They act as **secure proxies** to prevent exposing API keys to the client.

#### **`api/whisper-proxy.js`**
**PURPOSE**: Transcribe audio using OpenAI Whisper API

**FLOW**:
```
1. Receive multipart/form-data upload from frontend (audio file)
2. Parse using 'multiparty' library
3. Buffer complete file in memory
4. Forward to OpenAI API: POST https://api.openai.com/v1/audio/transcriptions
   - Headers: { Authorization: `Bearer ${OPENAI_KEY}` }
   - Body: FormData with audio file + model: 'whisper-1'
5. Return transcription: { text, usage: { seconds } }
```

**ENV VARS REQUIRED**:
- `OPENAI_KEY` (server-side secret)

**CORS**: Allows requests from frontend origins

---

#### **`api/openai-proxy.js`**
**PURPOSE**: Forward chat/completion requests to OpenAI GPT models

**FLOW**:
```
1. Receive JSON: { messages, model, temperature, max_tokens }
2. Forward to OpenAI API: POST https://api.openai.com/v1/chat/completions
   - Headers: { Authorization: `Bearer ${OPENAI_KEY}`, Content-Type: 'application/json' }
   - Body: { messages, model, temperature, max_tokens }
3. Return completion: { choices: [{ message: { content } }], usage }
```

**ENV VARS REQUIRED**:
- `OPENAI_KEY`

**USED BY**: `src/services/openAIAnalysisService.ts` for AI answer analysis

---

#### **`api/gemini-proxy.js`**
**PURPOSE**: Forward generation requests to Google Gemini/Generative AI API

**FLOW**:
```
1. Receive JSON: { model, input }
2. AUTO-DETECT correct Google API endpoint:
   a. Try to fetch model metadata: GET /v1beta/models/{model}
   b. Extract supportedGenerationMethods (e.g., ['generateContent', 'countTokens'])
   c. Reorder candidate endpoints and body shapes based on metadata

3. Try multiple candidate endpoints (in order):
   - Project-scoped (if GEMINI_PROJECT_ID set):
     https://generativelanguage.googleapis.com/v1beta/projects/{PROJECT_ID}/locations/{LOCATION}/models/{model}
   - Global endpoints:
     https://generativelanguage.googleapis.com/v1beta/models/{model}
     https://generativelanguage.googleapis.com/v1beta2/models/{model}
     https://generativeai.googleapis.com/v1beta/models/{model}

4. For each endpoint, try multiple method suffixes:
   - :generateContent
   - :generate
   - :generateText
   - :predict
   - :responses
   - :countTokens
   - :batchGenerateContent
   - (and more based on metadata)

5. For each endpoint+suffix, try multiple body shapes:
   - { input }                                           // Frontend format
   - { prompt: { text: input } }                         // Legacy Google format
   - { prompt: input }
   - { text: input }
   - { instances: [{ input }] }                          // Vertex AI format
   - { messages: [{ role: 'user', content: [...] }] }   // Chat format

6. On 404: Try next endpoint
   On 400: Try next body shape
   On 403/401/500: Return error immediately
   On 200: Return successful response

7. If all attempts fail, return error with diagnostic 'tried' array
   (showing all attempted URLs + body shapes, with API keys masked)
```

**ENV VARS REQUIRED**:
- `GEMINI_KEY` (API key for Google Generative AI)
- `GEMINI_PROJECT_ID` (optional, for project-scoped endpoints)
- `GEMINI_PROJECT_LOCATION` (optional, default: 'global')

**USED BY**: `src/services/geminiAnalysisService.ts` for AI answer analysis

**CURRENT STATUS**: 
- ⚠️ **ISSUE**: All endpoint+suffix+body combinations are returning 404 from Google
- **WHY**: The exact endpoint URL and JSON schema expected by your specific Gemini API key access is not yet discovered
- **DIAGNOSTIC**: Returns 'tried' array showing all attempted combinations
- **NEXT**: Need to identify correct endpoint from Google documentation or use project-scoped credentials

---

### **Test Scripts (`vercel-api/`)**

```javascript
// test-post-whisper.js
- POSTs e2e-test.wav to deployed /api/whisper-proxy
- Validates transcription response
- STATUS: ✅ WORKING (returns transcription)

// e2e-test.wav
- 1-second audio file for testing
- Generated programmatically (16kHz sine wave)
```

---

## 🔐 Environment Variables

### **Frontend (Vite) - `rretoriq-frontend/.env`**
```bash
# Firebase Config (public, safe to expose)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# API Proxy Base URL (points to Vercel backend)
VITE_API_PROXY_BASE=https://rretoriq-backend-api.vercel.app/api

# Optional: Override model names
VITE_GEMINI_MODEL=gemini-2.0-flash-exp
VITE_OPENAI_MODEL=gpt-4

# ⚠️ NEVER SET THESE IN FRONTEND (moved to backend):
# VITE_GEMINI_API_KEY=  ← REMOVED (now server-side only)
# VITE_OPENAI_API_KEY=  ← REMOVED (now server-side only)
```

### **Backend (Vercel) - Set in Vercel Dashboard**
```bash
# OpenAI Credentials (server-side secrets)
OPENAI_KEY=sk-proj-...your_openai_secret_key

# Google Gemini Credentials (server-side secrets)
GEMINI_KEY=AIza...your_gemini_api_key
GEMINI_PROJECT_ID=your-gcp-project-id          # Optional
GEMINI_PROJECT_LOCATION=us-central1            # Optional, default: 'global'

# CORS (comma-separated allowed origins)
ALLOWED_ORIGINS=https://rretoriq25.web.app,http://localhost:5173
```

---

## 🔄 Data Flow Diagrams

### **Interview Session Flow**
```
USER ACTION → COMPONENT → SERVICE → API PROXY → EXTERNAL API → RESPONSE

1. User clicks "Start Interview"
   ↓
2. AIInterviewPage.tsx
   - Loads questions from QuestionBankService
   - Renders EnhancedInterviewSession component
   ↓
3. EnhancedInterviewSession.tsx (orchestrator)
   - Displays question #1
   - Renders AudioRecorder component
   ↓
4. User records answer (AudioRecorder.tsx)
   - Captures audio via MediaRecorder API
   - Displays waveform visualization
   - On stop: sends Blob to transcription
   ↓
5. speechToTextService.ts
   - Creates FormData with audio file
   - POST https://rretoriq-backend-api.vercel.app/api/whisper-proxy
   ↓
6. vercel-api/api/whisper-proxy.js
   - Parses multipart upload
   - Forwards to OpenAI Whisper API
   - Returns transcript: { text, usage }
   ↓
7. EnhancedInterviewSession receives transcript
   - Passes to geminiAnalysisService.ts
   ↓
8. geminiAnalysisService.ts
   - Generates analysis prompt
   - POST https://rretoriq-backend-api.vercel.app/api/gemini-proxy
   - Body: { model: 'gemini-2.0-flash', input: <prompt> }
   ↓
9. vercel-api/api/gemini-proxy.js
   - Tries multiple Google API endpoints/formats
   - (CURRENT ISSUE: all returning 404/400)
   - Should return: { candidates: [{ content: { parts: [{ text: <JSON> }] } }] }
   ↓
10. EnhancedInterviewSession receives analysis
    - Displays AnalysisResults component (scores, feedback)
    - Saves to Firebase via firebaseSessionService
    ↓
11. firebaseSessionService.ts
    - Creates/updates Firestore doc: sessions/{sessionId}
    - Uploads audio to Storage: audio/{userId}/{sessionId}/{questionId}.webm
    ↓
12. Repeat steps 3-11 for each question
    ↓
13. On final question completion:
    - EnhancedInterviewSession calls completeSession()
    - Renders SessionResults component (overall score, breakdown)
    - Redirects to /dashboard
```

---

### **Authentication Flow**
```
1. User visits /login
   ↓
2. auth/Login.tsx
   - Form submit → auth.ts.signIn(email, password)
   ↓
3. src/services/auth.ts
   - Firebase: signInWithEmailAndPassword(auth, email, password)
   - Returns Firebase User object
   ↓
4. authStore.ts (Zustand)
   - Listens to onAuthStateChanged
   - On user detected → userProfileService.getUserProfile(userId)
   - Sets: { user, profile, loading: false }
   ↓
5. ProtectedRoute.tsx
   - Checks authStore.user
   - If authenticated → render <Outlet /> (child route)
   - If not → <Navigate to="/login" />
```

---

## 🐛 Current Known Issues

### **1. Gemini Proxy 404/400 Error**
**SYMPTOM**: Frontend logs "❌ Gemini analysis failed: Error: Google Gemini API key not configured"

**ROOT CAUSE**: 
- Backend proxy `api/gemini-proxy.js` tries many endpoint combinations
- All return 404 (endpoint not found) or 400 (invalid payload schema)
- The exact Google Generative API endpoint + JSON schema expected by the GEMINI_KEY is not yet discovered

**WHY IT HAPPENS**:
- Google has multiple API surfaces: Vertex AI, Generative Language API, AI Platform
- Each uses different:
  - Host: `generativelanguage.googleapis.com` vs `generativeai.googleapis.com` vs project-scoped
  - Version: `/v1beta` vs `/v1beta2` vs `/v1`
  - Method suffix: `:generateContent` vs `:generate` vs `:generateText` vs `:predict`
  - Body shape: `{ input }` vs `{ prompt: { text } }` vs `{ instances }` vs `{ messages }`

**DIAGNOSTICS AVAILABLE**:
- POST to `/api/gemini-proxy` returns:
  ```json
  {
    "error": "<!DOCTYPE html>...404 Not Found...",
    "tried": [
      { "url": "https://generativelanguage.../models/gemini-2.0-flash:generateContent?key=[REDACTED]", "bodyShape": ["input"] },
      { "url": "https://generativelanguage.../models/gemini-2.0-flash:generate?key=[REDACTED]", "bodyShape": ["prompt"] },
      ...60+ more combinations
    ]
  }
  ```

**SOLUTIONS TO TRY**:
1. **Set project-scoped env vars in Vercel**:
   ```bash
   GEMINI_PROJECT_ID=your-gcp-project-id
   GEMINI_PROJECT_LOCATION=us-central1
   ```
   → This makes proxy try project-scoped endpoints first

2. **Get exact model metadata**:
   - Run: `curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash?key=YOUR_KEY"`
   - Look for `supportedGenerationMethods` array
   - Share with AI → it will adapt proxy to exact method

3. **Use correct API surface**:
   - If key is from Google AI Studio → use `generativelanguage.googleapis.com`
   - If key is from Vertex AI → need project-scoped + OAuth2 bearer token (not API key)

4. **Temporary workaround**:
   - Use OpenAI analysis instead of Gemini
   - Change `src/services/geminiAnalysisService.ts` to call `/openai-proxy`

---

### **2. Frontend Shows Wrong Error Message**
**SYMPTOM**: Console shows "Google Gemini API key not configured. Please add VITE_GEMINI_API_KEY"

**ROOT CAUSE**: 
- Old error handling code maps HTTP 403 → that message
- Actual error is 404/400 (not 403)
- Frontend should show: "Gemini service temporarily unavailable" instead

**FIX**: Update `src/services/geminiAnalysisService.ts` line 169:
```typescript
// BEFORE:
} else if (response.status === 403) {
  throw new Error('Invalid Gemini API key. Please check your VITE_GEMINI_API_KEY')
}

// AFTER:
} else if (response.status === 403) {
  throw new Error('Gemini authentication failed. Please contact support.')
}
```

---

## 📊 Firebase Firestore Schema

```
firestore/
├── users/
│   └── {userId}/                           # Document per user
│       ├── email: string
│       ├── name: string
│       ├── avatar: string
│       ├── createdAt: Timestamp
│       ├── subscription: { plan, status, expiresAt }
│       └── preferences: { notifications, theme, language }
│
└── sessions/
    └── {sessionId}/                        # Document per interview session
        ├── userId: string                  # Reference to user
        ├── category: 'hr' | 'technical' | 'aptitude'
        ├── difficulty: 'easy' | 'medium' | 'hard'
        ├── createdAt: Timestamp
        ├── completedAt: Timestamp
        ├── overallScore: number            # 0-100
        ├── averageScore: number
        ├── totalTime: number               # seconds
        ├── questions: InterviewQuestion[]
        └── answers: [                      # Array of answer objects
              {
                questionId: string,
                transcript: string,
                audioUrl: string,           # Storage URL
                recordedAt: Timestamp,
                analysis: {
                  overallScore: number,
                  scores: { clarity, relevance, structure, completeness, confidence },
                  feedback: { strengths, weaknesses, suggestions, detailedFeedback },
                  keyPoints: { covered, missed },
                  timeManagement: { duration, efficiency, pacing }
                }
              }
            ]
```

---

## 🎯 Key Integration Points

### **Where Frontend Calls Backend**
```typescript
// Speech-to-Text
src/services/speechToTextService.ts
→ POST ${VITE_API_PROXY_BASE}/whisper-proxy
→ Handled by: vercel-api/api/whisper-proxy.js

// AI Analysis (Gemini)
src/services/geminiAnalysisService.ts
→ POST ${VITE_API_PROXY_BASE}/gemini-proxy
→ Handled by: vercel-api/api/gemini-proxy.js

// AI Analysis (OpenAI alternative)
src/services/openAIAnalysisService.ts
→ POST ${VITE_API_PROXY_BASE}/openai-proxy
→ Handled by: vercel-api/api/openai-proxy.js
```

### **Where Services Save Data**
```typescript
// User profiles
src/services/userProfileService.ts
→ Firestore: users/{userId}

// Sessions & answers
src/services/firebaseSessionService.ts
→ Firestore: sessions/{sessionId}
→ Storage: audio/{userId}/{sessionId}/{questionId}.webm

// Analytics
src/services/progressService.ts
→ Reads from: sessions/{sessionId} (aggregates data)
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
│  https://rretoriq25.web.app (Firebase Hosting)         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ├──► Static Assets (HTML, CSS, JS)
                 │    Served from Firebase Hosting CDN
                 │
                 ├──► API Calls
                 │    ↓
                 │    https://rretoriq-backend-api.vercel.app/api/*
                 │    (Vercel Serverless Functions)
                 │    ├──► /whisper-proxy → OpenAI Whisper API
                 │    ├──► /openai-proxy → OpenAI GPT API
                 │    └──► /gemini-proxy → Google Gemini API
                 │
                 ├──► Authentication
                 │    ↓
                 │    Firebase Auth (Google Identity Platform)
                 │
                 └──► Database & Storage
                      ↓
                      Firebase Firestore + Cloud Storage
```

---

## 📝 How to Explain This to ChatGPT

**Copy/paste this template**:

```
I'm working on an interview practice platform called rretoriq. Here's the architecture:

FRONTEND (React + Vite + TypeScript):
- Entry: src/main.tsx → src/App.tsx (routing)
- Pages: src/pages/ (Home, Login, Dashboard, AIInterviewPage, etc.)
- Main interview logic: src/components/EnhancedInterviewSession.tsx (orchestrates recording → transcription → analysis)
- Audio recording: src/components/AudioRecorder.tsx (captures audio, sends to Whisper)
- Services:
  * src/services/speechToTextService.ts → Calls /api/whisper-proxy
  * src/services/geminiAnalysisService.ts → Calls /api/gemini-proxy (CURRENTLY BROKEN - returns 404)
  * src/services/firebaseSessionService.ts → Saves sessions to Firestore
- State: src/store/authStore.ts (Zustand for auth)
- Data: src/data/allQuestions.ts (question bank)

BACKEND (Vercel serverless functions in vercel-api/):
- api/whisper-proxy.js → Forwards audio to OpenAI Whisper (✅ WORKING)
- api/gemini-proxy.js → Tries to call Google Gemini API (❌ ALL ENDPOINTS RETURN 404)
  * Auto-detects model metadata
  * Tries 60+ endpoint+suffix+body combinations
  * Returns diagnostic 'tried' array
- api/openai-proxy.js → Forwards to OpenAI GPT

DATABASE:
- Firebase Firestore: users/{userId}, sessions/{sessionId}
- Firebase Storage: audio/{userId}/{sessionId}/{questionId}.webm

CURRENT ISSUE:
The Gemini proxy (api/gemini-proxy.js) cannot find the correct Google API endpoint.
All combinations of:
- Hosts: generativelanguage.googleapis.com, generativeai.googleapis.com
- Versions: /v1beta, /v1beta2
- Methods: :generateContent, :generate, :generateText, :predict
- Bodies: {input}, {prompt:{text}}, {instances}, {messages}
...return 404 from Google.

The frontend receives 404 → displays "Gemini API key not configured" error.
Whisper transcription works fine, but AI analysis fails.

QUESTION: [your question here]
```

---

## 🔧 Quick Reference Commands

```bash
# Frontend dev server
npm run dev

# Frontend build
npm run build

# Run tests
npm test

# Deploy frontend to Firebase
firebase deploy --only hosting

# Deploy backend to Vercel (auto-deploys on git push)
git push origin main

# Test Whisper proxy
node vercel-api/test-post-whisper.js

# Test Gemini proxy
node -e "const https=require('https');const data=JSON.stringify({input:'Test'});const options={hostname:'rretoriq-backend-api.vercel.app',path:'/api/gemini-proxy',method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}};const req=https.request(options,(res)=>{let body='';res.on('data',c=>body+=c);res.on('end',()=>{console.log('STATUS',res.statusCode);console.log('BODY',body)})});req.on('error',e=>console.error(e));req.write(data);req.end();"
```

---

## 📚 Related Documentation Files

- `README.md` → Project overview, setup instructions
- `SETUP_INSTRUCTIONS.md` → Detailed setup guide
- `API_SETUP_GUIDE.md` → API configuration guide
- `GEMINI_SETUP_GUIDE.md` → Gemini-specific setup
- `BACKEND_INTEGRATION_SUMMARY.md` → Backend integration overview
- `QUICK_START.md` → Quick start guide
- `IMPLEMENTATION_COMPARISON.md` → Architecture comparisons
- `VERCEL_DEPLOYMENT_GUIDE.md` → Vercel deployment steps

---

## 💡 Tips for AI Assistants

When helping with this codebase:

1. **For routing issues** → Check `src/App.tsx`
2. **For interview flow bugs** → Check `src/components/EnhancedInterviewSession.tsx`
3. **For audio/recording issues** → Check `src/components/AudioRecorder.tsx` + `src/services/speechToTextService.ts`
4. **For AI analysis issues** → Check `src/services/geminiAnalysisService.ts` + `vercel-api/api/gemini-proxy.js`
5. **For data persistence issues** → Check `src/services/firebaseSessionService.ts`
6. **For auth issues** → Check `src/services/auth.ts` + `src/store/authStore.ts`
7. **For API proxy issues** → Check `vercel-api/api/*.js`
8. **For question bank issues** → Check `src/data/allQuestions.ts` + `src/services/QuestionBankService.ts`

**Always check**:
- Environment variables (`.env` for frontend, Vercel dashboard for backend)
- Firebase console (Firestore rules, Storage rules, Auth settings)
- Vercel logs (for backend errors)
- Browser console (for frontend errors)

---

**End of Codebase Architecture Document**
