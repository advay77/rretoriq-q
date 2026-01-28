# 🔍 DEBUG VERSION DEPLOYED

## What I Did

Added detailed console logging to the Dashboard to help debug why the admin banner isn't showing.

---

## 🚀 TEST NOW:

1. **Hard refresh** (Ctrl + F5) on https://rretoriq25.web.app
2. **Open browser console** (F12 or Ctrl+Shift+I)
3. **Navigate to Dashboard**
4. **Check the console logs** - you should see:

```
🔍 Dashboard: Checking admin status
👑 User is admin, loading institution data... (if admin)
📡 Fetching institution for user ID: ...
📊 Institution data received: ...
✅ Institution found with students: ...
```

OR

```
🔍 Dashboard: Checking admin status
👤 Regular user, loading personal stats...
```

---

## What to Look For:

### Scenario 1: Admin Not Detected
If you see:
```
🔍 Dashboard: Checking admin status { userIsAdmin: false, ... }
👤 Regular user, loading personal stats...
```

**Problem:** The admin custom claim isn't being loaded from Firebase Auth.
**Solution:** Need to check auth store or force logout/login to refresh token.

### Scenario 2: Admin Detected, API Failing
If you see:
```
👑 User is admin, loading institution data...
❌ Error loading institution stats: ...
```

**Problem:** The API call to `/api/admin/get-institution` is failing.
**Solution:** Need to check Vercel backend logs or API response.

### Scenario 3: No Institution Found
If you see:
```
📊 Institution data received: { institution: null, ... }
⚠️ No institution or students found
```

**Problem:** Your admin account doesn't have an institution created yet.
**Solution:** Go to `/admin/dashboard` and create your institution first!

---

## 📝 IMPORTANT:

**You must create an institution first** before the dashboard can show aggregated stats!

Go to `/admin/dashboard` and:
1. Fill in Institution Name (e.g., "MUJ")
2. Set Seats Purchased (e.g., 100)
3. Click "Update Institution"

Then the regular `/dashboard` will show the institution banner and aggregated stats.

---

**Check the console logs and share what you see!** 🔍
