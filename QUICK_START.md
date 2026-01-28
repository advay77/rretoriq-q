# 🚀 Quick Start Guide - Get Running in 5 Minutes

## Step 1: Get OpenAI API Key (2 minutes)

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)
5. **Save it somewhere safe!**

## Step 2: Get Firebase Credentials (2 minutes)

1. Go to https://console.firebase.google.com/
2. Click "Add Project" → Enter name → Create
3. Click web icon (</>) → Register app → Copy config
4. Go to **Authentication** → Get Started → Enable "Email/Password"
5. Go to **Firestore Database** → Create Database → Production mode

## Step 3: Configure Environment (30 seconds)

```bash
# Copy example file
cp .env.example .env

# Edit .env file
nano .env  # or use any text editor
```

**Paste your API keys:**
```bash
VITE_OPENAI_API_KEY=sk-your-key-here

VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Step 4: Start the App (30 seconds)

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Open http://localhost:5174 in your browser!

## Step 5: Test It Out

1. **Sign up** for an account
2. Go to **Dashboard**
3. Click **Interview Practice**
4. Choose interview type (HR/Technical/Aptitude)
5. **Record your answer** to a question
6. Wait for **AI analysis** (~10 seconds)
7. View your **detailed feedback**!

---

## ✅ What's Working

- ✅ Speech-to-Text (OpenAI Whisper)
- ✅ AI Analysis (GPT-4)
- ✅ Firebase Storage
- ✅ Progress Tracking
- ✅ Session Management

## 📝 Important Notes

- **Internet required** (for API calls)
- **Microphone permission** needed
- **Chrome/Firefox recommended** (best WebRTC support)
- **HTTPS required in production** (for microphone access)

## 💸 Cost per Test

- ~$0.30 per 5-question session
- OpenAI charges usage-based
- Monitor usage at https://platform.openai.com/usage

## 🐛 Issues?

Check these:

1. **"API key not configured"**
   - Verify `.env` file exists
   - Check keys are correct
   - Restart dev server: `npm run dev`

2. **"Microphone not working"**
   - Allow microphone permission in browser
   - Use HTTPS in production
   - Try Chrome or Firefox

3. **"Transcription failed"**
   - Check OpenAI account has credits
   - Verify API key is valid
   - Check browser console for errors

## 📚 More Help

- **Full Setup Guide:** `API_SETUP_GUIDE.md`
- **Implementation Details:** `BACKEND_INTEGRATION_SUMMARY.md`
- **Firebase Setup:** See "Firebase Configuration" in API_SETUP_GUIDE.md
- **Deployment:** See "Deployment" section in API_SETUP_GUIDE.md

---

**That's it! You're ready to use the AI-powered interview practice platform! 🎉**
