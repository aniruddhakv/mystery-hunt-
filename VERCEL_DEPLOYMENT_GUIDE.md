# 🚀 Vercel Deployment Guide - Step by Step

**Repository:** https://github.com/aniruddhakv/mystery-hunt-.git  
**Status:** ✅ Ready for Vercel Deployment  
**Time Required:** 10-15 minutes

---

## 📁 Project Structure for Vercel

Your project is now structured for Vercel serverless deployment:

```
Tresure_hunt/
├── api/
│   └── index.js          ← Backend API (Serverless Function)
├── public/
│   ├── index.html        ← Frontend
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── models/
│   └── User.js           ← MongoDB Models
├── middleware/
│   └── auth.js           ← Authentication
├── config/
│   └── clues.js          ← Game Clues
├── vercel.json           ← Vercel Configuration
└── package.json
```

**Key Points:**
- ✅ **`api/index.js`** - All backend routes in one serverless function
- ✅ **`public/`** - Static frontend files
- ✅ **`vercel.json`** - Routes configuration
- ✅ MongoDB connection with caching for serverless

---

## 🎯 Step-by-Step Vercel Deployment

### **STEP 1: Create Vercel Account (2 minutes)**

1. **Go to:** https://vercel.com/signup
2. **Click:** "Continue with GitHub"
3. **Authorize** Vercel to access your GitHub account
4. **Complete** the signup process

✅ **Done!** You now have a Vercel account.

---

### **STEP 2: Import Your Project (3 minutes)**

#### 2.1 Import from GitHub

1. **Go to:** https://vercel.com/new
2. **Click:** "Import Git Repository"
3. **Find:** `aniruddhakv/mystery-hunt-`
4. **Click:** "Import"

#### 2.2 Configure Project

On the import screen:

```
Framework Preset: Other
Root Directory: ./
Build Command: (leave empty)
Output Directory: (leave empty)
Install Command: npm install
```

**⚠️ IMPORTANT:** Don't click "Deploy" yet! We need to add environment variables first.

---

### **STEP 3: Add Environment Variables (5 minutes)**

#### 3.1 Open Environment Variables Section

1. **Scroll down** to "Environment Variables" section
2. **Click** to expand it

#### 3.2 Add Variables One by One

Add these variables (click "Add" after each one):

**Variable 1:**
```
Name: NODE_ENV
Value: production
```

**Variable 2:**
```
Name: MONGODB_URI
Value: mongodb+srv://treasurehunt:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/treasure-hunt?retryWrites=true&w=majority
```
⚠️ Replace with your actual MongoDB Atlas connection string from earlier!

**Variable 3:**
```
Name: JWT_SECRET
Value: 7k9mP2qR5tY8wE3xC6vB9nM4jH7gF0dS1aZ2xC3vB4nM
```
⚠️ Change this to a random 32+ character string!

**Variable 4:**
```
Name: ADMIN_USERNAME
Value: admin
```

**Variable 5:**
```
Name: ADMIN_PASSWORD
Value: TreasureAdmin@2025
```
⚠️ Change this to your own strong password!

#### 3.3 Verify All Variables

Make sure you have all 5 variables:
- ✅ NODE_ENV
- ✅ MONGODB_URI
- ✅ JWT_SECRET
- ✅ ADMIN_USERNAME
- ✅ ADMIN_PASSWORD

---

### **STEP 4: Deploy! (2 minutes)**

1. **Click:** "Deploy" button
2. **Wait** for deployment (1-2 minutes)
3. **Watch** the build logs

You'll see:
```
Building...
Installing dependencies...
Creating serverless functions...
Deploying...
✅ Deployment Complete!
```

---

### **STEP 5: Get Your URL (1 minute)**

After successful deployment:

1. **Click:** "Visit" button or "Go to Dashboard"
2. **Copy** your Vercel URL:
   ```
   https://mystery-hunt-xxxxx.vercel.app
   ```
3. **Save** this URL - this is your live website!

---

## 🧪 Test Your Deployment

### Test 1: Open Website

1. **Open:** `https://your-app.vercel.app`
2. **Check:** Login page loads
3. **Verify:** No errors in browser console (F12)

### Test 2: Admin Login

1. **Username:** admin
2. **Password:** (your ADMIN_PASSWORD)
3. **Click:** Login
4. **Verify:** Admin dashboard loads

### Test 3: Create User

1. **Click:** "➕ Create New User"
2. **Username:** testplayer
3. **Password:** test123
4. **Click:** "Create User"
5. **Verify:** User appears in table

### Test 4: Player Login

1. **Logout** from admin
2. **Login** as testplayer / test123
3. **Verify:** First clue appears
4. **Verify:** Timer starts
5. **Click:** "📷 Scan QR Code"
6. **Try manual entry:** TREASURE_HUNT_QR_2
7. **Verify:** Advances to level 2

✅ **If all tests pass, your deployment is successful!**

---

## 🔧 How Vercel Deployment Works

### Backend API Structure

All your API routes are in `api/index.js`:

```
/api/auth/login          → Login endpoint
/api/auth/me             → Get current user
/api/game/clue           → Get current clue
/api/game/verify-qr      → Verify QR code
/api/admin/users         → Admin: Get all users
/api/admin/users         → Admin: Create user
/api/admin/users/:id/reset → Admin: Reset progress
/api/admin/users/:id     → Admin: Delete user
/api/admin/users/:id/toggle → Admin: Enable/disable
```

### Frontend Files

Static files served from `public/`:

```
/                        → public/index.html
/css/style.css          → public/css/style.css
/js/app.js              → public/js/app.js
```

### Serverless Architecture

```
┌─────────────────────────────────────┐
│  User Request                       │
│  https://your-app.vercel.app/api/.. │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Vercel Edge Network                │
│  (Global CDN)                       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Serverless Function                │
│  api/index.js                       │
│  (Runs on-demand)                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  MongoDB Atlas                      │
│  (Your Database)                    │
└─────────────────────────────────────┘
```

**Benefits:**
- ✅ Auto-scaling (handles traffic spikes)
- ✅ Global CDN (fast worldwide)
- ✅ HTTPS by default
- ✅ Zero server management
- ✅ Free tier (generous limits)

---

## 📱 Custom Domain (Optional)

### Add Your Own Domain

1. **Go to:** Project Settings → Domains
2. **Click:** "Add Domain"
3. **Enter:** your-domain.com
4. **Follow** DNS configuration instructions
5. **Wait** for DNS propagation (5-60 minutes)

Example: `treasurehunt.yourdomain.com`

---

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push

# Vercel automatically:
# 1. Detects the push
# 2. Builds your project
# 3. Deploys to production
# 4. Updates your URL
```

**Preview Deployments:**
- Every push to a branch creates a preview URL
- Test changes before merging to main
- Each PR gets its own preview URL

---

## 🔍 Monitoring & Logs

### View Deployment Logs

1. **Go to:** Vercel Dashboard
2. **Click:** Your project
3. **Click:** "Deployments" tab
4. **Click:** Any deployment
5. **View:** Build logs and runtime logs

### View Function Logs

1. **Go to:** Project → Functions
2. **Click:** "Logs" tab
3. **See:** Real-time API logs
4. **Filter:** By function, time, status

### Monitor Performance

1. **Go to:** Project → Analytics
2. **View:** Request count, response times
3. **Check:** Error rates
4. **Monitor:** Bandwidth usage

---

## ⚙️ Environment Variables Management

### Update Variables After Deployment

1. **Go to:** Project Settings → Environment Variables
2. **Find** the variable to update
3. **Click:** "Edit"
4. **Update** the value
5. **Click:** "Save"
6. **Redeploy** for changes to take effect

### Redeploy After Variable Changes

1. **Go to:** Deployments tab
2. **Click:** "..." on latest deployment
3. **Click:** "Redeploy"
4. **Confirm:** Redeploy

---

## 🆘 Troubleshooting

### Issue: "Build Failed"

**Check:**
1. View build logs in Vercel dashboard
2. Verify all dependencies in package.json
3. Check for syntax errors in code
4. Ensure Node.js version compatibility

**Solution:**
```bash
# Test build locally first
npm install
node api/index.js
```

### Issue: "Cannot connect to database"

**Check:**
1. MongoDB Atlas connection string is correct
2. Password in MONGODB_URI has no special characters (or URL-encoded)
3. IP whitelist includes 0.0.0.0/0
4. Database name is in connection string

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Update MONGODB_URI
3. Redeploy

### Issue: "Admin login not working"

**Check:**
1. ADMIN_USERNAME is set
2. ADMIN_PASSWORD is set
3. Check function logs for errors

**Solution:**
1. Verify environment variables
2. Check logs: Vercel Dashboard → Functions → Logs
3. Look for "Admin user created" message

### Issue: "API routes return 404"

**Check:**
1. vercel.json routes configuration
2. api/index.js file exists
3. Routes start with /api/

**Solution:**
- Routes are configured correctly in vercel.json
- All API calls should use `/api/` prefix

### Issue: "Function timeout"

**Cause:** Serverless functions have 10-second timeout on free tier

**Solution:**
1. Optimize database queries
2. Add indexes to MongoDB collections
3. Use connection caching (already implemented)
4. Upgrade to Pro plan for 60-second timeout

---

## 💰 Vercel Pricing

### Free Tier (Hobby)

**Includes:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Serverless function execution
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments
- ✅ Perfect for your treasure hunt!

**Limits:**
- 10-second function timeout
- 100 GB bandwidth
- 6,000 build minutes/month

**Cost:** $0/month

### Pro Tier (If Needed)

**Includes:**
- ✅ Everything in Free
- ✅ 60-second function timeout
- ✅ 1 TB bandwidth
- ✅ Advanced analytics
- ✅ Team collaboration

**Cost:** $20/month per user

**For your event:** Free tier is more than enough!

---

## 📊 Vercel vs Railway Comparison

| Feature | Vercel | Railway |
|---------|--------|---------|
| **Architecture** | Serverless | Traditional Server |
| **Scaling** | Automatic | Manual/Auto |
| **Cold Starts** | Yes (1-2s) | No |
| **Setup** | Easy | Easy |
| **Free Tier** | 100 GB bandwidth | 500 hours/month |
| **Best For** | Static + API | Full backend apps |
| **Database** | External (Atlas) | Can host MongoDB |

**Recommendation:**
- **Use Railway** if you want traditional server (already set up)
- **Use Vercel** if you want serverless + global CDN
- **Both work great** for your treasure hunt!

---

## 🎯 Quick Deployment Checklist

### Pre-Deployment:
- [x] MongoDB Atlas configured
- [x] Connection string ready
- [x] Code pushed to GitHub
- [x] api/index.js created
- [x] vercel.json configured

### Deployment:
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Environment variables added:
  - [ ] NODE_ENV
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] ADMIN_USERNAME
  - [ ] ADMIN_PASSWORD
- [ ] Deployed successfully
- [ ] URL copied

### Testing:
- [ ] Website loads
- [ ] Admin login works
- [ ] Can create users
- [ ] Player login works
- [ ] QR scanning works
- [ ] Database saves data
- [ ] Timer works
- [ ] Completion works

### Event Prep:
- [ ] All player accounts created
- [ ] QR codes printed
- [ ] QR codes placed
- [ ] Participants briefed
- [ ] Backup plan ready

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Your Project** | (After deployment) |
| **GitHub Repo** | https://github.com/aniruddhakv/mystery-hunt-.git |
| **MongoDB Atlas** | https://cloud.mongodb.com/ |
| **Vercel Docs** | https://vercel.com/docs |

---

## 📞 Support

### Vercel Support:
- **Docs:** https://vercel.com/docs
- **Community:** https://github.com/vercel/vercel/discussions
- **Status:** https://www.vercel-status.com/

### Your Project:
- **GitHub Issues:** https://github.com/aniruddhakv/mystery-hunt-/issues
- **Deployment Logs:** Vercel Dashboard → Your Project → Logs

---

## 🎉 Summary

### What You'll Do:

1. **Create Vercel account** (2 min)
2. **Import GitHub repo** (3 min)
3. **Add environment variables** (5 min)
4. **Deploy** (2 min)
5. **Test** (3 min)

**Total Time:** ~15 minutes

### What You'll Get:

✅ Live website with custom URL  
✅ Automatic HTTPS  
✅ Global CDN (fast worldwide)  
✅ Auto-deploy on git push  
✅ Serverless backend  
✅ Free hosting  
✅ Production-ready app  

---

## 🚀 Ready to Deploy?

**Follow these steps:**

1. ✅ Make sure MongoDB Atlas is set up
2. ✅ Have your connection string ready
3. ✅ Go to https://vercel.com/signup
4. ✅ Follow STEP 1-5 above
5. ✅ Test your deployment
6. ✅ Create player accounts
7. ✅ Print QR codes
8. 🎉 Launch your event!

---

**Good luck with your Vercel deployment! 🎉**

**Your treasure hunt will be live in 15 minutes!** 🗺️✨

