# 🎓 Institutional Admin Portal - Deployment Summary

**Deployment Date**: October 11, 2025  
**Status**: ✅ Backend Deployed | ✅ Frontend Deployed | ⚠️ Configuration Needed

---

## 📦 What Was Deployed

### **Backend API Endpoints (Vercel)**
Deployed to: `https://rretoriq-backend-api.vercel.app/api/admin/`

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/admin/create-institution` | POST | Create new institution account | ✅ Deployed |
| `/api/admin/add-student` | POST | Add student by username | ✅ Deployed |
| `/api/admin/remove-student` | POST | Remove student from institution | ✅ Deployed |
| `/api/admin/get-institution` | GET | Fetch institution data | ✅ Deployed |
### **Frontend**
Deployed to: `https://rretoriq25.web.app`

| Component | Status |
|-----------|--------|
| Build | ✅ Successful (1,772 KB bundle) |
| Deployment | ✅ Live on Firebase Hosting |
| Admin UI | ⚠️ Needs to be created |

---

## 🔧 Configuration Required (Next Steps)

### **1. Set Vercel Environment Variables** ⚠️ CRITICAL

The admin API endpoints need Firebase Admin SDK access. You must set these in Vercel dashboard:

```bash
# Go to: https://vercel.com/prakhar0804/rretoriq-backend-api/settings/environment-variables

FIREBASE_PROJECT_ID=rretoriq25
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@rretoriq25.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----"
```

**How to get these values:**
1. Go to Firebase Console: https://console.firebase.google.com/project/rretoriq25/settings/serviceaccounts/adminsdk
2. Click "Generate new private key"
3. Download JSON file
4. Copy values to Vercel:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters)

---

### **2. Update Firestore Security Rules** ⚠️ REQUIRED

Add these rules to allow admin API access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // New: institutions collection (admin access)
    match /institutions/{institutionId} {
      // Allow server-side admin SDK (Vercel functions) to read/write
      allow read, write: if true; // Server-side only, no client access needed
    }
    
    // Updated: users collection (allow admin to update institutionId)
    match /users/{userId} {
      // Existing: users can read/write their own profile
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // New: Allow server-side admin SDK to update institutionId field
      allow update: if true; // Server-side only
    }
    
    // Existing rules for sessions, etc...
  }
}
```

**Apply rules:**
```bash
# In Firebase Console
# → Firestore Database → Rules → Paste above → Publish
```

---

### **3. Create Firestore Collections**

Run this script or manually create the collections:

```javascript
// Create a test institution (use Firebase Console or admin script)
// Collection: institutions
// Document ID: (auto-generated, e.g., inst_abc123)

{
  institutionName: "Test University",
  adminUserId: "your-admin-firebase-uid",
  adminEmail: "admin@test.edu",
  seatsPurchased: 50,
  students: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
```

---

### **4. Create Admin User with Custom Claims** ⚠️ REQUIRED

Admin users need a custom claim `admin: true` to access admin routes.

**Option A: Using Firebase CLI** (recommended)
```bash
# Install Firebase CLI if not installed
npm install -g firebase-tools

# Login
firebase login

# Set custom claim for admin user
firebase auth:import admin-user.json --project rretoriq25
```

**admin-user.json**:
```json
{
  "users": [{
    "localId": "admin-user-uid",
    "email": "admin@yourinstitution.edu",
    "emailVerified": true,
    "passwordHash": "...",
    "customAttributes": "{\"admin\":true}"
  }]
}
```

**Option B: Using Firebase Admin SDK Script**

Create `scripts/setAdminClaim.js`:
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./path-to-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setAdminClaim(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ Admin claim set for ${email}`);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Usage: node scripts/setAdminClaim.js
setAdminClaim('admin@yourinstitution.edu');
```

Run:
```bash
node scripts/setAdminClaim.js
```

**Option C: Using Firebase Extensions**

Install the "Manage User Roles" extension from Firebase Console.

---

### **5. Build Admin Dashboard UI** (Not Yet Created)

You still need to create the frontend admin pages:

#### Required Files:

**`src/pages/admin/InstitutionAdminDashboard.tsx`**
```typescript
// Main admin dashboard showing:
// - Institution info
// - Seat usage (progress bar)
// - Add student form
// - Student list with remove buttons
```

**`src/pages/admin/AdminLogin.tsx`**
```typescript
// Admin-specific login page
// - Email/password auth
// - Check for admin custom claim
// - Redirect to /admin/dashboard
```

**`src/components/AdminRoute.tsx`**
```typescript
// Protected route guard
// - Check if user.admin === true
// - Redirect non-admins to /login
```

**`src/types/institution.ts`**
```typescript
// TypeScript types for admin features
export interface Institution { ... }
export interface InstitutionalStudent { ... }
```

**`src/services/adminService.ts`**
```typescript
// API client for admin endpoints
// - getInstitution()
// - addStudent()
// - removeStudent()
```

#### Update `src/App.tsx` - Add Admin Route:
```typescript
import AdminRoute from './components/AdminRoute';
import InstitutionAdminDashboard from './pages/admin/InstitutionAdminDashboard';

// Inside <Routes>:
<Route element={<AdminRoute />}>
  <Route path="/admin/dashboard" element={<InstitutionAdminDashboard />} />
</Route>
```

---

## 🧪 Testing the Deployed Backend

### Test 1: Create Institution
```bash
curl -X POST https://rretoriq-backend-api.vercel.app/api/admin/create-institution \
  -H "Content-Type: application/json" \
  -d '{
    "institutionName": "Harvard University",
    "seatsPurchased": 100,
    "adminUserId": "your-firebase-uid-here"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "institutionId": "inst_abc123...",
  "institution": {
    "id": "inst_abc123",
    "institutionName": "Harvard University",
    "seatsPurchased": 100,
    "students": []
  }
}
```

### Test 2: Add Student
```bash
curl -X POST https://rretoriq-backend-api.vercel.app/api/admin/add-student \
  -H "Content-Type: application/json" \
  -d '{
    "institutionId": "inst_abc123",
    "username": "student@example.com"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Student student@example.com added successfully",
  "remainingSeats": 99
}
```

### Test 3: Get Institution Data
```bash
curl "https://rretoriq-backend-api.vercel.app/api/admin/get-institution?institutionId=inst_abc123"
```

**Expected Response:**
```json
{
  "institutionId": "inst_abc123",
  "institutionName": "Harvard University",
  "seatsPurchased": 100,
  "students": ["student@example.com"],
  "studentDetails": [
    {
      "username": "student@example.com",
      "email": "student@example.com",
      "displayName": "John Doe"
    }
  ]
}
```

---

## 📊 Current Status Summary

| Component | Status | Next Action |
|-----------|--------|-------------|
| Backend APIs | ✅ Deployed | Set Vercel env vars |
| Frontend Build | ✅ Deployed | Create admin UI pages |
| Firestore Schema | ⚠️ Pending | Create institutions collection |
| Security Rules | ⚠️ Pending | Update Firestore rules |
| Admin Users | ⚠️ Pending | Set custom claims |
| Admin Dashboard | ❌ Not Created | Build React components |

---

## 🚀 Quick Start (After Configuration)

1. **Set Vercel env vars** (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)
2. **Update Firestore rules** (allow admin API access)
3. **Create admin user** with `admin: true` custom claim
4. **Build admin UI** (dashboard, login, types, services)
5. **Test end-to-end**:
   - Admin logs in → Redirects to /admin/dashboard
   - Admin adds student by username
   - Student sees institutionId in their profile
   - Admin removes student → Seat freed

---

## 🔗 Important URLs

- **Backend API**: https://rretoriq-backend-api.vercel.app/api/admin/
- **Frontend**: https://rretoriq25.web.app
- **Vercel Dashboard**: https://vercel.com/prakhar0804/rretoriq-backend-api
- **Firebase Console**: https://console.firebase.google.com/project/rretoriq25
- **GitHub Repo**: https://github.com/Prakhar0804/rretoriq-backend-api

---

## 📝 Notes

- **Backend is live** but will return errors until Vercel env vars are set
- **Frontend is live** but admin UI needs to be built
- **Student username lookup** currently uses email field (can be changed to custom username field)
- **Seat limit enforcement** is implemented server-side
- **Duplicate prevention** is handled in add-student endpoint

---

**Last Updated**: October 11, 2025  
**Deployed By**: GitHub Copilot + User
