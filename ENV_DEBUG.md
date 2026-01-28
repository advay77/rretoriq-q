# 🔍 Debugging Environment Variables

## Current Status

✅ **Environment variables are set in Vercel** (added 44 minutes ago)  
✅ **Health check endpoint created** (deploying now)  
🔄 **Vercel is deploying** the latest changes

---

## 🧪 Test Health Check (In 2 Minutes)

After Vercel finishes deploying, open this URL in your browser:

**https://rretoriq-backend-api.vercel.app/api/admin/health**

### Expected Good Response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-11T...",
  "environment": {
    "FIREBASE_PROJECT_ID": "Set ✅",
    "FIREBASE_CLIENT_EMAIL": "Set ✅",
    "FIREBASE_PRIVATE_KEY": "Set ✅"
  },
  "firebaseConfig": {
    "projectId": "rretoriq25",
    "clientEmail": "firebase-adminsdk-...",
    "privateKeyLength": 1700
  }
}
```

### If You See "Missing ❌":
The environment variables aren't being loaded properly. This could mean:
1. Vercel cached the old deployment
2. Variables are set in wrong environment (Production vs Preview)
3. Vercel needs a manual redeploy

---

## 🐛 Common Issue: Environment Variable Scope

Check if your variables are set for:
- ✅ **Production** (required)
- ✅ **Preview** (optional but recommended)
- ✅ **Development** (optional)

Go to: https://vercel.com/prakhar0804/rretoriq-backend-api/settings/environment-variables

For each variable, make sure **"Production"** is checked!

---

## 🔧 If Health Check Fails

### Option 1: Force Redeploy in Vercel
1. Go to: https://vercel.com/prakhar0804/rretoriq-backend-api/deployments
2. Click on the latest deployment
3. Click the **"⋮" menu** → **"Redeploy"**
4. Choose **"Use existing Build Cache: No"**
5. Click **"Redeploy"**

### Option 2: Check Variable Values
The `FIREBASE_PRIVATE_KEY` must have `\n` characters, not actual newlines.

**Correct format:**
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBAAD...\n-----END PRIVATE KEY-----\n
```

**Wrong format:**
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBAAD...
-----END PRIVATE KEY-----
```

---

## ⏱️ Timeline

| Time | Action |
|------|--------|
| Now | Health check endpoint deploying |
| +2 min | Test health endpoint |
| +5 min | If healthy, test admin dashboard |
| +10 min | Create your first institution! |

---

## 🎯 Next Steps

1. **Wait 2 minutes** for Vercel to deploy
2. **Test health endpoint** (link above)
3. **If health check passes** → Test admin dashboard
4. **If health check fails** → Check environment variable scope

---

**Check deployment progress:**
https://vercel.com/prakhar0804/rretoriq-backend-api/deployments

Wait for: ✅ **"Add health check endpoint to verify environment variables"** → **Ready**
