# 🎯 Admin Portal Setup - Quick Reference Guide

**Status**: ✅ Backend Deployed | ✅ Frontend UI Built | ✅ Firestore Rules Deployed | ⚠️ Configuration Needed

---

## 📋 What You Need to Do Now

### **STEP 1: Add Environment Variables to Vercel** ⚠️ CRITICAL

1. Go to: **https://vercel.com/prakhar0804/rretoriq-backend-api/settings/environment-variables**

2. Click "Add New" and add these **3 variables**:

| Variable Name | Value (from your JSON file) |
|--------------|----------------------------|
| `FIREBASE_PROJECT_ID` | `rretoriq25` |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@rretoriq25.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | Copy the **entire** `private_key` value from your JSON file |

**For FIREBASE_PRIVATE_KEY:**
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCy+fzN30gaf+F3\n8Hr7w+3HInUnSPP9p/Gb1oSNUpTLTVfWcvRmN/GRu9QirhjQGG69NjoT+gcy/CX+\n... (rest of your key) ...\n-----END PRIVATE KEY-----\n
```

⚠️ **Important:** Keep the `\n` characters - they represent newlines!

3. After adding all 3 variables, Vercel will automatically redeploy your backend

---

### **STEP 2: Create Your First Admin User**

Run this command to set yourself as an admin:

```powershell
node scripts/setAdminClaim.js set YOUR_EMAIL@example.com
```

**Example:**
```powershell
node scripts/setAdminClaim.js set admin@university.edu
```

**Expected Output:**
```
🔍 Looking up user: admin@university.edu...
✅ User found: abc123xyz...
📧 Email: admin@university.edu
👤 Display Name: John Doe

🎉 SUCCESS! Admin claim set for admin@university.edu

⚠️  IMPORTANT: User must log out and log back in for changes to take effect.

🔍 Verification - Custom Claims: { admin: true }
```

---

### **STEP 3: Test the Admin Portal**

1. **Log out** of your account (if currently logged in)

2. **Log back in** to refresh your authentication token

3. Go to: **https://rretoriq25.web.app/admin/dashboard**

4. You should see the **Institution Setup** page

5. Fill in:
   - **Institution Name**: e.g., "Harvard University"
   - **Number of Seats**: e.g., 50

6. Click **"Create Institution"**

7. You should now see the **Admin Dashboard** with:
   - Total Seats, Seats Used, Seats Available
   - Add Student form
   - Empty student list

---

### **STEP 4: Add Students**

1. In the **"Add New Student"** form, enter a student's email (username)

2. Click **"Add Student"**

3. The student will appear in the student list below

4. The student's profile will now have `institutionId` set to your institution

---

## 🧪 Testing with curl (Optional)

### Test 1: Create Institution
```bash
curl -X POST https://rretoriq-backend-api.vercel.app/api/admin/create-institution \
  -H "Content-Type: application/json" \
  -d "{\"institutionName\":\"Test University\",\"seatsPurchased\":100,\"adminUserId\":\"YOUR_FIREBASE_UID\"}"
```

### Test 2: Add Student
```bash
curl -X POST https://rretoriq-backend-api.vercel.app/api/admin/add-student \
  -H "Content-Type: application/json" \
  -d "{\"institutionId\":\"INSTITUTION_ID\",\"username\":\"student@example.com\"}"
```

### Test 3: Get Institution
```bash
curl "https://rretoriq-backend-api.vercel.app/api/admin/get-institution?institutionId=INSTITUTION_ID"
```

---

## 🛠️ Utility Commands

### List all admin users:
```powershell
node scripts/setAdminClaim.js list
```

### Remove admin claim from a user:
```powershell
node scripts/setAdminClaim.js remove user@example.com
```

---

## 📊 What's Already Done

| Component | Status |
|-----------|--------|
| ✅ Backend API endpoints | Deployed to Vercel |
| ✅ Frontend UI components | Built and deployed |
| ✅ Firestore security rules | Deployed to Firebase |
| ✅ Admin route guard | Implemented |
| ✅ Auth store updated | With admin custom claim |
| ✅ Service account JSON | Available locally |
| ⚠️ Vercel env variables | **YOU NEED TO SET THESE** |
| ⚠️ Admin user | **YOU NEED TO CREATE THIS** |

---

## 🚨 Troubleshooting

### Problem: "Admin claim not working"
**Solution:** Log out and log back in. Custom claims are cached in the authentication token.

### Problem: "Institution not found"
**Solution:** The API might not have Firestore access. Check Vercel environment variables.

### Problem: "Student not found"
**Solution:** Make sure the student has a Firebase Auth account with the email you're trying to add.

### Problem: "Seats full"
**Solution:** Edit your institution to increase `seatsPurchased` or remove students.

---

## 📁 Important Files Created

| File | Purpose |
|------|---------|
| `firestore.rules` | Firestore security rules with admin access |
| `scripts/setAdminClaim.js` | Script to set admin custom claims |
| `src/components/AdminRoute.tsx` | Protected route guard for admin pages |
| `src/pages/admin/InstitutionAdminDashboard.tsx` | Main admin dashboard UI |
| `src/services/adminService.ts` | API client for admin endpoints |
| `vercel-api/api/admin/create-institution.js` | Backend API to create institution |
| `vercel-api/api/admin/add-student.js` | Backend API to add student |
| `vercel-api/api/admin/remove-student.js` | Backend API to remove student |
| `vercel-api/api/admin/get-institution.js` | Backend API to get institution data |

---

## 🔗 Quick Links

- **Frontend**: https://rretoriq25.web.app
- **Admin Dashboard**: https://rretoriq25.web.app/admin/dashboard
- **Backend API**: https://rretoriq-backend-api.vercel.app/api/admin/
- **Vercel Dashboard**: https://vercel.com/prakhar0804/rretoriq-backend-api
- **Firebase Console**: https://console.firebase.google.com/project/rretoriq25

---

## 🎓 Next Steps After Setup

1. **Test the workflow end-to-end**
2. **Create additional admin users** if needed
3. **Add students** to your institution
4. **Monitor seat usage** in the dashboard
5. **Customize seat limits** based on your plan

---

**Last Updated**: October 11, 2025  
**Setup Time**: ~10 minutes (after Vercel variables are set)
