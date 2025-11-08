# ⚡ Railway Backend + Vercel Frontend - Quick Guide

**Architecture:** Railway (API) + Vercel (Frontend) + MongoDB Atlas (Database)

---

## 🎯 3-Part Setup (25 minutes)

### **PART 1: Railway Backend (10 min)**

```
1. Go to: https://railway.app/
2. Login with GitHub
3. New Project → Deploy from GitHub
4. Choose: aniruddhakv/mystery-hunt-
5. Add Variables:
   - NODE_ENV=production
   - MONGODB_URI=mongodb+srv://...
   - JWT_SECRET=random32chars
   - ADMIN_USERNAME=admin
   - ADMIN_PASSWORD=yourpassword
   - PORT=3000
6. Settings → Generate Domain
7. Copy URL: https://your-app.railway.app
```

✅ **Backend deployed!**

---

### **PART 2: Update & Push Code (5 min)**

#### **Update API URL:**

Edit `public/js/app.js` line 5:

```javascript
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://your-app.railway.app/api'; // Your Railway URL
```

#### **Update CORS:**

Edit `server.js` line 20:

```javascript
'https://your-app.vercel.app', // Your Vercel URL (get in next step)
```

#### **Commit:**

```bash
git add .
git commit -m "Configure Railway backend + Vercel frontend"
git push
```

✅ **Code updated!**

---

### **PART 3: Vercel Frontend (10 min)**

```
1. Go to: https://vercel.com/signup
2. Login with GitHub
3. Import Git Repository
4. Choose: aniruddhakv/mystery-hunt-
5. Configure:
   - Framework: Other
   - Build Command: (empty)
   - Output Directory: (empty)
6. Deploy (no env vars needed!)
7. Copy URL: https://your-app.vercel.app
```

#### **Update CORS (if needed):**

If you didn't update server.js earlier:

1. Edit `server.js` line 20 with your Vercel URL
2. `git push` (Railway auto-redeploys)

✅ **Frontend deployed!**

---

## 🧪 Test (5 min)

```
1. Open: https://your-app.vercel.app
2. Login: admin / yourpassword
3. Create test user
4. Test player login
5. Test QR scanning
```

✅ **All working!**

---

## 📊 What You Have

```
Frontend (Vercel):
https://your-app.vercel.app
↓ API calls
Backend (Railway):
https://your-app.railway.app/api
↓ Database queries
MongoDB Atlas:
Cloud database
```

---

## 🔧 Key Files Changed

### **public/js/app.js** (Line 5)
```javascript
const API_URL = 'https://your-railway-app.railway.app/api';
```

### **server.js** (Lines 16-24)
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true
}));
```

### **vercel.json** (Updated)
```json
{
  "version": 2,
  "builds": [{"src": "public/**", "use": "@vercel/static"}],
  "routes": [{"src": "/(.*)", "dest": "/public/$1"}]
}
```

---

## 🆘 Quick Troubleshooting

### **CORS Error:**
→ Update server.js with Vercel URL  
→ Push to GitHub (Railway auto-redeploys)

### **API Not Found:**
→ Check Railway URL in app.js  
→ Verify Railway backend is running

### **Login Fails:**
→ Check Railway environment variables  
→ View Railway logs for errors

---

## 💰 Cost

```
Railway:  $0/month (500 hours free)
Vercel:   $0/month (100 GB free)
MongoDB:  $0/month (512 MB free)
────────────────────────────────
Total:    $0/month
```

---

## 🔄 Update Workflow

### **Update Backend:**
```bash
# Edit server.js, models, etc.
git push
# Railway auto-deploys
```

### **Update Frontend:**
```bash
# Edit public/index.html, css, js
git push
# Vercel auto-deploys
```

---

## 🎯 URLs to Save

```
Frontend:  https://your-app.vercel.app
Backend:   https://your-app.railway.app
GitHub:    https://github.com/aniruddhakv/mystery-hunt-.git
Railway:   https://railway.app/dashboard
Vercel:    https://vercel.com/dashboard
MongoDB:   https://cloud.mongodb.com/
```

---

## ✅ Checklist

**Railway:**
- [ ] Account created
- [ ] Project deployed
- [ ] 6 environment variables added
- [ ] Domain generated
- [ ] URL copied

**Code:**
- [ ] app.js updated with Railway URL
- [ ] server.js updated with Vercel URL
- [ ] Changes pushed to GitHub

**Vercel:**
- [ ] Account created
- [ ] Project imported
- [ ] Deployed successfully
- [ ] URL copied

**Testing:**
- [ ] Frontend loads
- [ ] Admin login works
- [ ] Can create users
- [ ] Player login works
- [ ] QR scanning works

---

## 🎉 Done!

**Time:** 25 minutes  
**Cost:** $0  
**Result:** Production-ready treasure hunt!

**Full Guide:** See `RAILWAY_BACKEND_VERCEL_FRONTEND.md`

---

**Happy Treasure Hunting! 🗺️✨**

