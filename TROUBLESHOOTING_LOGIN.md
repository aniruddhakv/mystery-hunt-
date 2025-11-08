# 🔧 Troubleshooting Login Issues

## 🎯 Your Current Setup

**Frontend:** https://mystery-hunt-two.vercel.app/  
**Backend:** https://mystery-hunt-production.up.railway.app/api  
**Credentials:** admin / admin123

---

## ❌ **Common Login Errors**

### **Error 1: "Invalid credentials"**
**Cause:** Admin user not created in database

### **Error 2: "Network error" or "Failed to fetch"**
**Cause:** Backend not responding or CORS issue

### **Error 3: "Cannot connect to database"**
**Cause:** MongoDB connection string issue

---

## 🔍 **Step-by-Step Diagnosis**

### **Step 1: Check Backend is Running**

Open this URL in your browser:
```
https://mystery-hunt-production.up.railway.app/api/auth/me
```

**Expected Response:**
```json
{"error": "Authentication required"}
```

**If you see this:** ✅ Backend is running  
**If you see error page:** ❌ Backend is down

---

### **Step 2: Test Login API Directly**

Open browser DevTools (F12) → Console, paste this:

```javascript
fetch('https://mystery-hunt-production.up.railway.app/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
})
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

**Expected Success:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "username": "admin",
    "isAdmin": true
  }
}
```

**Possible Errors:**

#### **Error: "Invalid credentials"**
```json
{"error": "Invalid credentials"}
```
**Solution:** Admin user not in database. Check Railway logs.

#### **Error: CORS**
```
Access to fetch has been blocked by CORS policy
```
**Solution:** CORS configuration issue. Check server.js.

#### **Error: Network Failed**
```
Failed to fetch
```
**Solution:** Backend not responding. Check Railway deployment.

---

### **Step 3: Check Railway Logs**

1. Go to: https://railway.app/dashboard
2. Click your project
3. Click "Deployments" tab
4. Click latest deployment
5. View logs

**Look for:**

✅ **Success Messages:**
```
✅ Connected to MongoDB
✅ Admin user created
🚀 Server running on port 3000
```

❌ **Error Messages:**
```
❌ MongoDB connection error
Error creating admin
```

---

### **Step 4: Check MongoDB Connection**

Your current MongoDB URI has an issue:
```
mongodb+srv://treasurehunt:treasurehunt@mysteryhunt.mi2tdjb.mongodb.net/?appName=MysteryHunt
```

**Problem:** Missing database name!

**Should be:**
```
mongodb+srv://treasurehunt:treasurehunt@mysteryhunt.mi2tdjb.mongodb.net/treasure-hunt?retryWrites=true&w=majority
```

**Fix in Railway:**
1. Go to Variables tab
2. Edit `MONGODB_URI`
3. Update to include `/treasure-hunt` before the `?`
4. Save (Railway will auto-redeploy)

---

### **Step 5: Check Frontend API URL**

Open browser DevTools (F12) → Network tab:
1. Try to login
2. Look for the login request
3. Check the URL it's calling

**Should be:**
```
https://mystery-hunt-production.up.railway.app/api/auth/login
```

**If different:** Frontend has wrong API URL

---

## 🛠️ **Quick Fixes**

### **Fix 1: Update MongoDB URI**

In Railway Variables, change:
```
FROM: mongodb+srv://treasurehunt:treasurehunt@mysteryhunt.mi2tdjb.mongodb.net/?appName=MysteryHunt

TO: mongodb+srv://treasurehunt:treasurehunt@mysteryhunt.mi2tdjb.mongodb.net/treasure-hunt?retryWrites=true&w=majority
```

### **Fix 2: Verify All Variables**

Make sure Railway has all 6 variables:
```
✅ NODE_ENV=production
✅ MONGODB_URI=mongodb+srv://...
✅ JWT_SECRET=your-random-32-character-secret-key
✅ ADMIN_USERNAME=admin
✅ ADMIN_PASSWORD=admin123
✅ PORT=3000
```

### **Fix 3: Redeploy Railway**

After fixing MongoDB URI:
1. Railway will auto-redeploy
2. Wait 2-3 minutes
3. Check logs for "✅ Connected to MongoDB"
4. Check logs for "✅ Admin user created"

### **Fix 4: Clear Browser Cache**

1. Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. Clear cache and cookies
3. Reload page (Ctrl+F5)
4. Try login again

---

## 🧪 **Test Checklist**

Run through these tests:

- [ ] Backend URL responds: https://mystery-hunt-production.up.railway.app/api/auth/me
- [ ] Railway logs show "Connected to MongoDB"
- [ ] Railway logs show "Admin user created"
- [ ] Railway logs show "Server running on port 3000"
- [ ] No CORS errors in browser console
- [ ] Login API returns token (test with fetch command above)
- [ ] Frontend loads without errors
- [ ] Can login with admin/admin123

---

## 🎯 **Most Likely Issue**

Based on your screenshot, the **MongoDB URI is missing the database name**.

**Current:**
```
mongodb+srv://treasurehunt:treasurehunt@mysteryhunt.mi2tdjb.mongodb.net/?appName=MysteryHunt
```

**Should be:**
```
mongodb+srv://treasurehunt:treasurehunt@mysteryhunt.mi2tdjb.mongodb.net/treasure-hunt?retryWrites=true&w=majority
```

**This causes:**
1. ❌ MongoDB connection fails
2. ❌ Admin user is never created
3. ❌ Login fails with "Invalid credentials"

---

## 📞 **Next Steps**

1. **Update MongoDB URI** in Railway (add `/treasure-hunt`)
2. **Wait for redeploy** (2-3 minutes)
3. **Check Railway logs** for success messages
4. **Try login again** with admin/admin123
5. **If still fails:** Share Railway logs with me

---

## 🔗 **Useful Links**

| Resource | URL |
|----------|-----|
| **Frontend** | https://mystery-hunt-two.vercel.app/ |
| **Backend Test** | https://mystery-hunt-production.up.railway.app/api/auth/me |
| **Railway Dashboard** | https://railway.app/dashboard |
| **MongoDB Atlas** | https://cloud.mongodb.com/ |

---

## 💡 **Quick Test Command**

Run this in browser console to test backend:

```javascript
// Test backend health
fetch('https://mystery-hunt-production.up.railway.app/api/auth/me')
  .then(r => r.json())
  .then(d => console.log('Backend status:', d))
  .catch(e => console.error('Backend error:', e));

// Test login
fetch('https://mystery-hunt-production.up.railway.app/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({username: 'admin', password: 'admin123'})
})
  .then(r => r.json())
  .then(d => console.log('Login result:', d))
  .catch(e => console.error('Login error:', e));
```

---

**After fixing MongoDB URI, your login should work! 🎉**

