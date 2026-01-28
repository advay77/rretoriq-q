# AI Mock Interview System - Environment Setup Instructions

## Required Environment Variables

Copy this file to `.env.local` and fill in your actual API keys and configuration:

```bash
# OpenAI Configuration (Required for AI evaluation)
VITE_OPENAI_API_KEY=sk-your-actual-openai-key-here

# Firebase Configuration (Should already be configured)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Speech Recognition Configuration (Optional)
VITE_PREFER_WHISPER=true
VITE_FALLBACK_TO_BROWSER=true
VITE_MAX_RECORDING_DURATION=180

# Session Configuration (Optional)
VITE_DEFAULT_QUESTIONS_PER_SESSION=5
VITE_ENABLE_SESSION_PERSISTENCE=true
VITE_AUTO_SAVE_INTERVAL=30000

# Development Configuration (Optional)
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=info
```

## Setup Instructions

### 1. OpenAI API Key (Required for AI features)
1. Go to https://platform.openai.com/account/api-keys
2. Create a new API key
3. Copy the key and paste it as `VITE_OPENAI_API_KEY`
4. Ensure your OpenAI account has credits

### 2. Firebase Configuration
Your Firebase configuration should already be set up. If not:
1. Go to Firebase Console
2. Select your project
3. Go to Project Settings > General > Your apps
4. Copy the config values

### 3. Test the Setup
1. Copy `.env.example` to `.env.local`
2. Fill in your actual API keys
3. Restart the development server: `npm run dev`
4. Go to Dashboard and test the AI Interview System

## Features Available

### With OpenAI API Key:
✅ Voice Recording
✅ Speech-to-Text (Whisper API)
✅ AI Evaluation (GPT-4)
✅ Detailed Feedback
✅ Progress Tracking
✅ Session Management

### Without OpenAI API Key:
✅ Voice Recording
✅ Basic Speech-to-Text (Browser API)
❌ AI Evaluation
❌ Detailed Feedback
✅ Progress Tracking
✅ Session Management

## Important Notes

1. **OpenAI Costs**: Each evaluation costs approximately $0.01-0.03
2. **Rate Limits**: OpenAI has rate limits - the system handles this gracefully
3. **Browser Support**: Voice recording requires HTTPS (works on localhost)
4. **Permissions**: Users need to grant microphone permissions

## Troubleshooting

### Error: "OpenAI API key is not configured"
- Check that `VITE_OPENAI_API_KEY` is set in `.env.local`
- Ensure the key starts with `sk-`
- Restart the development server after adding the key

### Error: "Failed to access microphone"
- Grant microphone permissions in browser
- Use HTTPS in production (localhost is fine for development)
- Check that microphone is not being used by another application

### Error: "No questions available"
- Go to Dashboard > Question Bank Management
- Initialize the question bank for the interview type you want to use
- Ensure Firebase is properly configured

### Error: "Speech recognition not supported"
- Use a modern browser (Chrome, Safari, Edge)
- Ensure HTTPS connection (required for speech recognition)
- This error is caught gracefully and falls back to manual transcription