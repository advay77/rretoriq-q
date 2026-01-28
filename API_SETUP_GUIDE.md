# 🚀 Rretoriq - Complete Setup & API Integration Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [API Setup](#api-setup)
4. [Environment Configuration](#environment-configuration)
5. [Backend Services](#backend-services)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd rretoriq-frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your API keys

# 4. Start development server
npm run dev
```

---

## Prerequisites

- **Node.js** v18+ and npm v9+
- **Firebase Project** (free tier is sufficient)
- **OpenAI API Account** (requires payment method for API access)
- **Modern browser** with WebRTC support (Chrome, Firefox, Edge, Safari)

---

## API Setup

### 1. OpenAI API (Required)

**Used for:** Speech-to-Text (Whisper) + AI Analysis (GPT-4)

**Setup Steps:**

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-...`)
6. Add to `.env`:
   ```bash
   VITE_OPENAI_API_KEY=sk-your-actual-key-here
   ```

**Pricing (as of 2025):**
- **Whisper API:** $0.006 per minute of audio
- **GPT-4 Turbo:** ~$0.01 per 1K tokens (~$0.05 per analysis)
- **Estimated cost per interview:** $0.10 - $0.30

**Limits:**
- Free tier: None
- Tier 1: 500 RPM (requests per minute)
- Tier 2+: Higher limits

**Important Notes:**
- ⚠️ **Never commit your API key to version control**
- 💡 Use OpenAI's usage dashboard to monitor costs
- 🔒 Set usage limits in OpenAI dashboard to prevent overspending

---

### 2. Firebase (Required)

**Used for:** User Authentication + Data Storage + Analytics

**Setup Steps:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Enter project name (e.g., "rretoriq-prod")
4. Enable Google Analytics (optional but recommended)
5. Click **"Create Project"**

**Configure Firebase:**

1. In Firebase Console, click the **web icon** (</>) to add a web app
2. Register app name: "Rretoriq Web"
3. Copy the Firebase configuration:

```javascript
// This is what you'll see:
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

4. Add each value to `.env`:

```bash
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**Enable Firebase Services:**

1. **Authentication:**
   - Go to **Authentication** > **Get Started**
   - Enable **Email/Password**
   - Enable **Google** (optional)

2. **Firestore Database:**
   - Go to **Firestore Database** > **Create Database**
   - Choose **Start in production mode**
   - Select location (choose closest to your users)
   
3. **Firestore Security Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only read/write their own data
       match /sessions/{sessionId} {
         allow read, write: if request.auth != null && 
           request.auth.uid == resource.data.userId;
       }
       
       match /userProgress/{userId} {
         allow read, write: if request.auth != null && 
           request.auth.uid == userId;
       }
       
       match /answers/{answerId} {
         allow read, write: if request.auth != null && 
           request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

4. **Storage (Optional - for audio files):**
   - Go to **Storage** > **Get Started**
   - Use default security rules or customize

**Pricing:**
- Free tier includes:
  - 50K document reads/day
  - 20K document writes/day
  - 1 GB storage
  - 10 GB/month transfer
- Sufficient for development and small-scale production

---

## Environment Configuration

### Complete `.env` File Template

```bash
# ==========================================
# OpenAI Configuration (REQUIRED)
# ==========================================
VITE_OPENAI_API_KEY=sk-your-openai-key-here

# ==========================================
# Firebase Configuration (REQUIRED)
# ==========================================
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# ==========================================
# Optional Configuration
# ==========================================
VITE_ENABLE_AI_ANALYSIS=true
VITE_ENABLE_SPEECH_TO_TEXT=true
VITE_DEV_MODE=true
VITE_MAX_AUDIO_DURATION=300
```

### Verifying Configuration

Run this check after setting up `.env`:

```bash
# Check if environment variables are loaded
npm run dev

# Open browser console and type:
console.log({
  hasOpenAI: !!import.meta.env.VITE_OPENAI_API_KEY,
  hasFirebase: !!import.meta.env.VITE_FIREBASE_API_KEY
})
```

---

## Backend Services

### Service Architecture

```
User Interaction
     ↓
AudioRecorder Component
     ↓
speechToTextService.ts (OpenAI Whisper)
     ↓
openAIAnalysisService.ts (GPT-4)
     ↓
firebaseSessionService.ts (Firestore)
     ↓
User Dashboard/Progress

```

### Key Services

#### 1. **speechToTextService.ts**
- Converts audio to text using OpenAI Whisper
- Supports multiple formats (webm, mp3, wav)
- Includes retry logic and error handling
- 25MB file size limit

#### 2. **openAIAnalysisService.ts**
- Analyzes transcribed answers using GPT-4
- Returns detailed scores and feedback
- JSON-formatted responses
- Optimized prompts for interview/IELTS scenarios

#### 3. **firebaseSessionService.ts**
- Stores session data in Firestore
- Tracks user progress and analytics
- Implements CRUD operations
- Updates user statistics automatically

#### 4. **apiUtils.ts**
- Centralized error handling
- Rate limiting
- Retry logic with exponential backoff
- Request timeout management

---

## Testing

### Manual Testing Checklist

**1. Speech-to-Text:**
```bash
# Test in browser console
import { speechToTextService } from './services/speechToTextService'

// Record audio and test transcription
const blob = new Blob([audioData], { type: 'audio/webm' })
const result = await speechToTextService.transcribeAudio(blob)
console.log(result)
```

**2. AI Analysis:**
```bash
# Test analysis service
import { openAIAnalysisService } from './services/openAIAnalysisService'

const analysis = await openAIAnalysisService.analyzeAnswer({
  transcript: "Test answer",
  question: {...},
  audioDuration: 60,
  transcriptionConfidence: 0.95
})
console.log(analysis)
```

**3. Firebase Connection:**
```bash
# Test Firebase write
import { firebaseSessionService } from './services/firebaseSessionService'

const sessionId = await firebaseSessionService.createSession(
  'test-user-id',
  'interview',
  'hr'
)
console.log('Session created:', sessionId)
```

### Automated Tests

```bash
# Run unit tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run
```

---

## Deployment

### Vercel (Recommended)

**Prerequisites:**
- Vercel account (free tier available)
- Git repository

**Steps:**

1. **Push code to GitHub/GitLab/Bitbucket**

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Add Environment Variables:**
   - Go to **Settings** > **Environment Variables**
   - Add all variables from `.env`:
     - `VITE_OPENAI_API_KEY`
     - `VITE_FIREBASE_API_KEY`
     - etc.
   - Save and redeploy

4. **Configure Domain:**
   - Go to **Settings** > **Domains**
   - Add custom domain or use Vercel subdomain

5. **Deploy:**
   ```bash
   # Auto-deploys on git push
   git push origin main
   ```

### Firebase Hosting (Alternative)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy --only hosting
```

---

## Troubleshooting

### Common Issues

#### 1. **"OpenAI API key not configured"**

**Cause:** Missing or incorrect `VITE_OPENAI_API_KEY`

**Solution:**
```bash
# Verify .env file exists
ls -la .env

# Check content
cat .env | grep OPENAI

# Restart dev server
npm run dev
```

#### 2. **"Speech-to-text failed: 401"**

**Cause:** Invalid API key

**Solution:**
- Verify API key in [OpenAI Dashboard](https://platform.openai.com/api-keys)
- Regenerate key if necessary
- Update `.env` and restart server

#### 3. **"Firebase: Permission denied"**

**Cause:** Firestore security rules blocking access

**Solution:**
```javascript
// Temporarily use test mode rules (DEVELOPMENT ONLY)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

#### 4. **"Rate limit exceeded"**

**Cause:** Too many API requests

**Solution:**
- Rate limiters are built-in (`apiUtils.ts`)
- Wait 60 seconds between requests
- Check OpenAI usage dashboard

#### 5. **"Audio recording not working"**

**Cause:** Missing browser permissions

**Solution:**
- Check browser microphone permissions
- Use HTTPS in production (required for getUserMedia)
- Test in Chrome/Firefox (best support)

### Debug Mode

Enable detailed logging:

```bash
# In .env
VITE_DEV_MODE=true

# Check browser console for:
# 🎤 Speech transcription logs
# 🤖 AI analysis logs
# 💾 Firebase save logs
# ❌ Error details
```

### Get Help

- **GitHub Issues:** Report bugs
- **Documentation:** Check README.md
- **OpenAI Support:** [help.openai.com](https://help.openai.com)
- **Firebase Support:** [firebase.google.com/support](https://firebase.google.com/support)

---

## Cost Estimation

### Monthly Operating Costs (1000 users)

| Service | Usage | Cost |
|---------|-------|------|
| OpenAI Whisper | 5000 min audio | ~$30 |
| OpenAI GPT-4 | 10K analyses | ~$500 |
| Firebase | 500K reads/writes | Free tier |
| Vercel Hosting | Bandwidth | Free tier |
| **Total** | | **~$530/month** |

### Cost Optimization Tips

1. **Cache transcriptions** to avoid re-processing
2. **Use GPT-3.5** instead of GPT-4 for cheaper analysis (~10x cheaper)
3. **Implement usage limits** per user
4. **Compress audio** before sending to API
5. **Use Firebase Functions** for server-side processing (avoid exposing API keys)

---

## Next Steps

✅ API keys configured
✅ Services integrated
✅ Firebase connected

**Now you can:**
1. Test the complete flow
2. Customize UI/prompts
3. Add more features
4. Deploy to production

**Happy coding! 🚀**
