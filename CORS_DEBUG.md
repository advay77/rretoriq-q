# 🔍 Debugging CORS Issue

## The Problem

You're seeing a CORS error: "No 'Access-Control-Allow-Origin' header is present"

This happens when:
1. Vercel hasn't finished deploying yet (environment variables not loaded)
2. The API endpoint is crashing before it can send CORS headers
3. There's a network/firewall issue

---

## ✅ What I Just Fixed

I've updated the `get-institution.js` endpoint to:
- Set CORS headers earlier in the request
- Add better error logging
- Ensure CORS headers are sent even on errors

The code is now deploying to Vercel (commit: 0140d6e)

---

## ⏱️ WAIT FOR VERCEL DEPLOYMENT

**Check here:** https://vercel.com/prakhar0804/rretoriq-backend-api/deployments

Look for the deployment: **"Add better error handling and CORS headers to get-institution endpoint"**

Status should show: ✅ **Ready**

This usually takes **2-3 minutes**.

---

## 🧪 Manual Test (After Vercel Finishes)

### Test 1: Check if API is alive
Open this URL in your browser:
```
https://rretoriq-backend-api.vercel.app/api/admin/get-institution?adminUserId=NRQywtfXzohZEl6rvT5B2jFb8oz2
```

**Expected responses:**
- ✅ **404 with JSON**: `{"error":"No institution found for this admin","hasInstitution":false}`  
  → This is GOOD! It means the API is working but you haven't created an institution yet.

- ❌ **500 error**: The environment variables might not be set correctly

- ❌ **CORS error**: Vercel still deploying

### Test 2: Create Institution via Dashboard
After the API test works:
1. Go back to: https://rretoriq25.web.app/admin/dashboard
2. Refresh the page (Ctrl+F5)
3. Fill out the institution form
4. Click "Create Institution"

---

## 🐛 If Still Getting CORS Errors

### Option 1: Wait Longer
Vercel can take up to 5 minutes sometimes. Just wait and refresh.

### Option 2: Check Vercel Logs
Go to https://vercel.com/prakhar0804/rretoriq-backend-api/deployments
- Click on the latest deployment
- Check "Functions" tab
- Look for errors in logs

### Option 3: Verify Environment Variables
Go to https://vercel.com/prakhar0804/rretoriq-backend-api/settings/environment-variables

Make sure these 3 exist:
- ✅ FIREBASE_PROJECT_ID
- ✅ FIREBASE_CLIENT_EMAIL
- ✅ FIREBASE_PRIVATE_KEY

If any are missing, add them and redeploy.

---

## 📊 Current Timeline

| Time | Status |
|------|--------|
| Just now | Code pushed to GitHub |
| +1 min | Vercel picks up the push |
| +2-3 min | Vercel finishes deploying |
| +3-5 min | **Test the API again** |

---

## 🎯 Next Steps

1. **Wait 3-5 minutes** for Vercel to deploy
2. **Test the API URL** directly in browser
3. **Refresh the admin dashboard** 
4. **Create your institution**

---

**The fix is deploying now. Just wait a few minutes and try again!** 🚀
