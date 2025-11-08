# 🚂 Railway Backend + ▲ Vercel Frontend Setup

**Perfect Architecture:** Railway for API backend + Vercel for static frontend!

**Benefits:**
- ✅ Railway handles backend API (traditional server, no cold starts)
- ✅ Vercel serves frontend (global CDN, super fast)
- ✅ Best of both worlds!
- ✅ Easy to scale and maintain

---

## 📁 Project Structure

```
Tresure_hunt/
├── Backend (Railway):
│   ├── server.js          ← Express API server
│   ├── models/            ← MongoDB models
│   ├── middleware/        ← Authentication
│   ├── config/            ← Game clues
│   └── package.json
│
└── Frontend (Vercel):
    ├── public/
    │   ├── index.html     ← Main app
    │   ├── css/style.css  ← Styles
    │   └── js/app.js      ← Frontend logic
    └── vercel.json        ← Vercel config
```

---

## 🎯 Step-by-Step Deployment

### **PART 1: Deploy Backend to Railway (10 minutes)**

#### **Step 1.1: Login to Railway**

1. **Go to:** https://railway.app/
2. **Click:** "Login with GitHub"
3. **Authorize** Railway

#### **Step 1.2: Create New Project**

1. **Click:** "New Project"
2. **Select:** "Deploy from GitHub repo"
3. **Choose:** `aniruddhakv/mystery-hunt-`
4. **Click:** "Deploy Now"

#### **Step 1.3: Add Environment Variables**

1. **Click:** Your project
2. **Click:** "Variables" tab
3. **Add these variables:**

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://treasurehunt:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/treasure-hunt?retryWrites=true&w=majority
JWT_SECRET=7k9mP2qR5tY8wE3xC6vB9nM4jH7gF0dS1aZ2xC3vB4nM
ADMIN_USERNAME=admin
ADMIN_PASSWORD=TreasureAdmin@2025
PORT=3000
```

⚠️ **Replace MONGODB_URI with your actual connection string!**

#### **Step 1.4: Get Railway URL**

1. **Click:** "Settings" tab
2. **Scroll to:** "Domains"
3. **Click:** "Generate Domain"
4. **Copy URL:** `https://your-app.railway.app`

**Save this URL! You'll need it for Vercel setup.**

Example: `https://mystery-hunt-production.up.railway.app`

#### **Step 1.5: Test Backend**

Test your Railway backend:

```bash
# Test login endpoint
curl -X POST https://your-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"TreasureAdmin@2025"}'

# Should return: {"token":"...", "user":{...}}
```

✅ **Backend deployed on Railway!**

---

### **PART 2: Deploy Frontend to Vercel (10 minutes)**

#### **Step 2.1: Update Frontend API URL**

1. **Open:** `public/js/app.js`
2. **Find line 5:** (already updated)
3. **Replace** `your-railway-app.railway.app` with your actual Railway URL

```javascript
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://mystery-hunt-production.up.railway.app/api'; // Your Railway URL
```

4. **Save the file**

#### **Step 2.2: Commit Changes**

```bash
git add public/js/app.js
git commit -m "Update API URL to Railway backend"
git push
```

#### **Step 2.3: Login to Vercel**

1. **Go to:** https://vercel.com/signup
2. **Click:** "Continue with GitHub"
3. **Authorize** Vercel

#### **Step 2.4: Import Project**

1. **Go to:** https://vercel.com/new
2. **Click:** "Import Git Repository"
3. **Find:** `aniruddhakv/mystery-hunt-`
4. **Click:** "Import"

#### **Step 2.5: Configure Project**

```
Framework Preset: Other
Root Directory: ./
Build Command: (leave empty)
Output Directory: (leave empty)
Install Command: (leave empty)
```

**No environment variables needed for frontend!**

#### **Step 2.6: Deploy**

1. **Click:** "Deploy"
2. **Wait** 1-2 minutes
3. **Get URL:** `https://your-app.vercel.app`

✅ **Frontend deployed on Vercel!**

---

### **PART 3: Connect Frontend to Backend (5 minutes)**

#### **Step 3.1: Update Railway CORS**

1. **Go to:** Railway dashboard
2. **Click:** Your project
3. **Click:** "Variables" tab
4. **Add new variable:**

```
VERCEL_URL=https://your-app.vercel.app
```

5. **Redeploy** (Railway will auto-redeploy)

#### **Step 3.2: Update server.js CORS (Already Done!)**

The `server.js` is already configured to accept requests from Vercel:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app', // Update this
    /\.vercel\.app$/ // Allows all Vercel preview URLs
  ],
  credentials: true
}));
```

**Update line 20** with your actual Vercel URL and push:

```bash
# Edit server.js line 20
git add server.js
git commit -m "Update CORS for Vercel frontend"
git push
```

Railway will auto-redeploy!

---

## 🧪 Test the Complete Setup

### **Test 1: Open Frontend**

1. **Open:** `https://your-app.vercel.app`
2. **Check:** Login page loads
3. **Open DevTools:** F12 → Console
4. **Verify:** No CORS errors

### **Test 2: Admin Login**

1. **Username:** admin
2. **Password:** TreasureAdmin@2025
3. **Click:** Login
4. **Verify:** Admin dashboard loads
5. **Check Network tab:** API calls go to Railway URL

### **Test 3: Create User**

1. **Click:** "➕ Create New User"
2. **Username:** testplayer
3. **Password:** test123
4. **Click:** "Create User"
5. **Verify:** User created successfully

### **Test 4: Player Flow**

1. **Logout** from admin
2. **Login:** testplayer / test123
3. **Verify:** First clue appears
4. **Check:** Timer starts
5. **Try:** Manual QR entry
6. **Verify:** Level advances

✅ **Everything working!**

---

## 🔧 How It Works

### **Architecture Diagram:**

```
┌─────────────────────────────────────────┐
│  User Browser                           │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Vercel (Frontend)                      │
│  https://your-app.vercel.app            │
│  - Serves HTML, CSS, JS                 │
│  - Global CDN (70+ locations)           │
│  - Super fast static files              │
└────────────┬────────────────────────────┘
             │
             │ API Calls
             ▼
┌─────────────────────────────────────────┐
│  Railway (Backend)                      │
│  https://your-app.railway.app/api       │
│  - Express.js API server                │
│  - Authentication & game logic          │
│  - Always running (no cold starts)      │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  MongoDB Atlas (Database)               │
│  - User data                            │
│  - Game progress                        │
│  - Admin accounts                       │
└─────────────────────────────────────────┘
```

### **Request Flow:**

1. **User opens** `https://your-app.vercel.app`
2. **Vercel serves** HTML, CSS, JS (from global CDN)
3. **User logs in** → JS makes API call to Railway
4. **Railway backend** validates credentials
5. **MongoDB Atlas** checks user data
6. **Railway returns** JWT token
7. **Frontend stores** token in localStorage
8. **All game actions** → API calls to Railway
9. **Railway processes** and updates MongoDB
10. **Frontend updates** UI based on responses

---

## 🎯 Benefits of This Architecture

### **Railway Backend:**
- ✅ Traditional server (always running)
- ✅ No cold starts (instant response)
- ✅ Better for API endpoints
- ✅ Easier to debug
- ✅ Real-time logs
- ✅ WebSocket support (if needed later)

### **Vercel Frontend:**
- ✅ Global CDN (fast worldwide)
- ✅ Automatic HTTPS
- ✅ Perfect for static files
- ✅ Preview deployments
- ✅ Automatic optimization
- ✅ Zero configuration

### **Combined:**
- ✅ Best performance
- ✅ Easy to scale
- ✅ Separation of concerns
- ✅ Independent deployments
- ✅ Cost-effective (both free tiers)

---

## 💰 Cost Breakdown

### **Railway (Backend):**
```
Free Tier: 500 hours/month + $5 credit
Cost: $0/month (for your event)
```

### **Vercel (Frontend):**
```
Free Tier: 100 GB bandwidth/month
Cost: $0/month (for your event)
```

### **MongoDB Atlas (Database):**
```
Free Tier: 512 MB storage
Cost: $0/month
```

**Total Cost: $0/month** 🎉

---

## 🔄 Deployment Workflow

### **Update Backend:**

```bash
# Make changes to server.js, models, etc.
git add .
git commit -m "Update backend"
git push

# Railway automatically:
# ✅ Detects push
# ✅ Builds backend
# ✅ Deploys to Railway
# ✅ Backend updated!
```

### **Update Frontend:**

```bash
# Make changes to public/index.html, css, js
git add .
git commit -m "Update frontend"
git push

# Vercel automatically:
# ✅ Detects push
# ✅ Builds frontend
# ✅ Deploys to Vercel
# ✅ Frontend updated!
```

**Both deploy independently!**

---

## 🆘 Troubleshooting

### **Issue: CORS Error**

**Error:** `Access to fetch at 'https://...' has been blocked by CORS policy`

**Solution:**
1. Check Railway environment variables
2. Verify CORS configuration in server.js
3. Make sure Vercel URL is in CORS origins
4. Redeploy Railway backend

### **Issue: API calls fail**

**Error:** `Failed to fetch` or `Network error`

**Solution:**
1. Check Railway backend is running
2. Verify Railway URL in `public/js/app.js`
3. Test Railway API directly with curl
4. Check Railway logs for errors

### **Issue: Frontend loads but no data**

**Solution:**
1. Open DevTools → Network tab
2. Check API calls are going to Railway URL
3. Verify JWT token in localStorage
4. Check Railway backend logs

### **Issue: Railway backend not responding**

**Solution:**
1. Check Railway dashboard for errors
2. Verify MongoDB connection string
3. Check environment variables
4. View Railway deployment logs

---

## 📊 Monitoring

### **Railway Backend:**
1. **Go to:** Railway Dashboard
2. **Click:** Your project
3. **View:** Metrics, logs, deployments
4. **Monitor:** CPU, memory, requests

### **Vercel Frontend:**
1. **Go to:** Vercel Dashboard
2. **Click:** Your project
3. **View:** Analytics, bandwidth, requests
4. **Monitor:** Performance, errors

### **MongoDB Atlas:**
1. **Go to:** MongoDB Atlas Dashboard
2. **Click:** Your cluster
3. **View:** Metrics, connections, storage
4. **Monitor:** Database performance

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | https://your-app.vercel.app | User-facing website |
| **Backend** | https://your-app.railway.app | API endpoints |
| **Database** | MongoDB Atlas | Data storage |
| **GitHub** | https://github.com/aniruddhakv/mystery-hunt-.git | Source code |

---

## ✅ Deployment Checklist

### **Backend (Railway):**
- [ ] Railway account created
- [ ] Project deployed from GitHub
- [ ] Environment variables added (5 vars)
- [ ] Domain generated
- [ ] Backend URL copied
- [ ] API endpoints tested
- [ ] MongoDB connected

### **Frontend (Vercel):**
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] API URL updated in app.js
- [ ] Changes committed and pushed
- [ ] Frontend deployed
- [ ] Frontend URL copied
- [ ] Website loads correctly

### **Integration:**
- [ ] CORS configured in server.js
- [ ] Vercel URL added to CORS origins
- [ ] Backend redeployed
- [ ] Frontend can call backend API
- [ ] Login works
- [ ] Admin panel works
- [ ] Game flow works

---

## 🎉 Summary

**What You Have:**
- ✅ Railway backend (API server)
- ✅ Vercel frontend (static website)
- ✅ MongoDB Atlas (database)
- ✅ Automatic deployments
- ✅ Global CDN
- ✅ Free hosting
- ✅ Production-ready!

**URLs:**
- 🌐 **Frontend:** https://your-app.vercel.app
- 🔌 **Backend:** https://your-app.railway.app/api
- 💾 **Database:** MongoDB Atlas

**Total Setup Time:** ~25 minutes  
**Total Cost:** $0/month  
**Performance:** Excellent!  

---

**Your treasure hunt is ready to launch! 🎉🗺️✨**

