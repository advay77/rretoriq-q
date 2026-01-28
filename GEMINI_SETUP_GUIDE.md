# 🚀 Google Gemini AI Setup Guide

## Why Gemini Instead of OpenAI GPT-4?

### 💰 **Cost Comparison**

| Service | Cost per Analysis | Cost for 1000 Analyses |
|---------|------------------|------------------------|
| **OpenAI GPT-4** | ~$0.05 | ~$50.00 |
| **Gemini 1.5 Pro** | ~$0.001 | ~$1.00 ✅ |
| **Gemini 1.5 Flash** | ~$0.0001 | ~$0.10 ✅ |

**Savings: 98-99.8% cheaper!** 🎉

### ⚡ **Quality Comparison**

- **Gemini 1.5 Flash**: Faster, 99% cheaper, good quality
- **Gemini 1.5 Pro**: Comparable to GPT-4, 98% cheaper
- **Recommended**: Start with Flash, upgrade to Pro if needed

---

## 🔑 Step 1: Get Your FREE Gemini API Key

### **Option A: Google AI Studio (Easiest - FREE Tier Available)**

1. **Go to Google AI Studio:**
   https://aistudio.google.com/app/apikey

2. **Sign in with your Google account**

3. **Click "Get API Key"** or "Create API Key"

4. **Select or create a Google Cloud project:**
   - If you don't have one, click "Create API key in new project"
   - If you have one, select it and click "Create API key"

5. **Copy your API key** (looks like: `AIzaSy...`)

6. **Important:** Keep this key secret!

### **Option B: Google Cloud Console (Advanced)**

1. Go to: https://console.cloud.google.com/
2. Create new project or select existing one
3. Enable **Generative Language API**
4. Go to **Credentials** > **Create Credentials** > **API Key**
5. Copy the API key

---

## 📝 Step 2: Add API Key to Your Project

### **Edit `.env` file:**

```bash
# Speech-to-Text (Still uses OpenAI Whisper - very cheap)
VITE_OPENAI_API_KEY=sk-your-openai-key-here

# AI Analysis (NOW using Gemini - 99% cheaper!)
VITE_GEMINI_API_KEY=AIzaSy-your-gemini-key-here
VITE_GEMINI_MODEL=gemini-1.5-flash
VITE_AI_ANALYSIS_PROVIDER=gemini

# Firebase (same as before)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
# ... rest of Firebase config
```

### **Model Options:**

```bash
# Option 1: Flash (RECOMMENDED for most use cases)
VITE_GEMINI_MODEL=gemini-1.5-flash
# - Fastest
# - Cheapest (~99.8% cheaper than GPT-4)
# - Great quality for interviews

# Option 2: Pro (Better quality, still 98% cheaper than GPT-4)
VITE_GEMINI_MODEL=gemini-1.5-pro
# - Higher quality
# - Slower
# - Still very cheap
```

---

## 🎯 Step 3: Restart Development Server

```bash
npm run dev
```

That's it! Your app now uses Gemini AI for analysis! 🚀

---

## 💵 Pricing Details

### **Free Tier (Google AI Studio)**

- **15 requests per minute** (RPM)
- **1 million tokens per day**
- **1,500 requests per day**

**This is MORE than enough for:**
- Development and testing
- Small production apps
- 100-500 users/day

### **Paid Tier (Pay-as-you-go)**

#### **Gemini 1.5 Flash:**
- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens
- **~$0.0001 per analysis**

#### **Gemini 1.5 Pro:**
- Input: $1.25 per 1M tokens
- Output: $5.00 per 1M tokens
- **~$0.001 per analysis**

### **Cost Examples:**

| Usage | Flash Cost | Pro Cost | GPT-4 Cost |
|-------|-----------|----------|------------|
| 100 analyses | **$0.01** | **$0.10** | $5.00 |
| 1,000 analyses | **$0.10** | **$1.00** | $50.00 |
| 10,000 analyses | **$1.00** | **$10.00** | $500.00 |
| 100,000 analyses | **$10.00** | **$100.00** | $5,000.00 |

---

## ✅ Verify It's Working

### **Test 1: Check Configuration**

Open browser console and run:
```javascript
console.log({
  geminiKey: !!import.meta.env.VITE_GEMINI_API_KEY,
  model: import.meta.env.VITE_GEMINI_MODEL,
  provider: import.meta.env.VITE_AI_ANALYSIS_PROVIDER
})
```

Should show:
```javascript
{
  geminiKey: true,
  model: "gemini-1.5-flash",
  provider: "gemini"
}
```

### **Test 2: Try an Analysis**

1. Go to **AI Interview Practice**
2. Record an answer
3. Check browser console for:
   ```
   🤖 Starting Gemini AI analysis...
   ✅ Gemini analysis completed
   ```

---

## 🔄 Switching Between OpenAI and Gemini

### **Use Gemini (Recommended - 99% cheaper):**
```bash
VITE_AI_ANALYSIS_PROVIDER=gemini
VITE_GEMINI_API_KEY=your-key
```

### **Use OpenAI (If you prefer):**
```bash
VITE_AI_ANALYSIS_PROVIDER=openai
VITE_OPENAI_API_KEY=your-key
```

The app automatically uses the provider you specify!

---

## 🆚 Complete Cost Breakdown

### **Setup 1: Gemini Flash + Whisper (CHEAPEST)**

| Component | Cost | Details |
|-----------|------|---------|
| Speech-to-Text (Whisper) | $0.06 | 10 min audio |
| AI Analysis (Gemini Flash) | $0.0001 | 1 analysis |
| **Total per session** | **~$0.06** | **95% cheaper than OpenAI!** |

### **Setup 2: Gemini Pro + Whisper (BALANCED)**

| Component | Cost | Details |
|-----------|------|---------|
| Speech-to-Text (Whisper) | $0.06 | 10 min audio |
| AI Analysis (Gemini Pro) | $0.001 | 1 analysis |
| **Total per session** | **~$0.065** | **80% cheaper than OpenAI** |

### **Setup 3: OpenAI Only (EXPENSIVE)**

| Component | Cost | Details |
|-----------|------|---------|
| Speech-to-Text (Whisper) | $0.06 | 10 min audio |
| AI Analysis (GPT-4) | $0.05 | 1 analysis |
| **Total per session** | **~$0.31** | Original cost |

---

## 🎁 Free Tier Benefits

With Google AI Studio free tier:

- ✅ **15 RPM** (requests per minute)
- ✅ **1,500 requests per day**
- ✅ **No credit card required**
- ✅ Perfect for development
- ✅ Supports small production apps

**This means:**
- 300-500 users/day for FREE
- Unlimited development/testing
- No upfront costs

---

## 🐛 Troubleshooting

### **Error: "Gemini API key not configured"**

**Solution:**
```bash
# Check .env file exists
ls -la .env

# Check for VITE_GEMINI_API_KEY
cat .env | grep GEMINI

# Restart dev server
npm run dev
```

### **Error: 403 Forbidden**

**Cause:** API key invalid or API not enabled

**Solution:**
1. Verify API key at https://aistudio.google.com/app/apikey
2. Enable "Generative Language API" in Google Cloud
3. Regenerate key if needed

### **Error: 429 Rate Limit**

**Cause:** Exceeded free tier limits (15 RPM)

**Solution:**
- Wait 1 minute
- Upgrade to paid tier if needed
- Built-in rate limiting should prevent this

### **Error: Invalid JSON response**

**Cause:** Gemini sometimes returns markdown-wrapped JSON

**Solution:**
- Already handled in code (strips markdown)
- If persists, check console logs
- May need to adjust prompt

---

## 📊 Monitoring Usage

### **Google AI Studio Dashboard:**
https://aistudio.google.com/

- View API calls
- Check quota usage
- Monitor costs (if on paid tier)

### **Google Cloud Console:**
https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas

- Detailed usage metrics
- Set quota limits
- Billing information

---

## 🚀 Recommended Starting Setup

```bash
# .env file
VITE_OPENAI_API_KEY=sk-your-key-here        # For Whisper STT
VITE_GEMINI_API_KEY=AIzaSy-your-key-here    # For analysis
VITE_GEMINI_MODEL=gemini-1.5-flash          # Cheapest + fast
VITE_AI_ANALYSIS_PROVIDER=gemini            # Use Gemini

# Firebase config...
VITE_FIREBASE_API_KEY=...
# etc.
```

### **Budget:**
- **OpenAI:** $5 (for Whisper)
- **Gemini:** FREE tier (no cost!)
- **Total:** $5 for extensive testing

---

## 📈 When to Upgrade

### **Stick with Free Tier if:**
- ✅ < 500 users/day
- ✅ Development/testing
- ✅ MVP/prototype

### **Upgrade to Paid if:**
- 🔹 > 1,500 requests/day
- 🔹 Production app with 1000+ users
- 🔹 Need higher rate limits

**Even paid tier is super cheap:**
- 10,000 analyses/month = **$1 (Flash)** or **$10 (Pro)**

---

## ✨ Summary

**What you get with Gemini:**

✅ **99% cost reduction** vs OpenAI GPT-4
✅ **FREE tier** for development & small apps  
✅ **Great quality** analysis
✅ **Fast response** times
✅ **Easy setup** (5 minutes)
✅ **No credit card** needed (free tier)

**Total monthly cost for 1000 users:**
- Whisper (1000 sessions): ~$60
- Gemini Flash (5000 analyses): ~$0.50
- **Total: ~$60.50/month** (vs $580 with GPT-4!)

---

**🎉 Congratulations! You're now using Google Gemini AI and saving 99% on AI costs!**

Need help? Check the troubleshooting section or the main API_SETUP_GUIDE.md file.
