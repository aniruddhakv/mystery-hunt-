# 🚀 Complete Deployment Guide - Treasure Hunt Mystery Game

**Repository:** https://github.com/aniruddhakv/mystery-hunt-.git  
**Status:** ✅ Code Pushed to GitHub  
**Date:** 2025-11-08

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Railway Deployment](#railway-deployment)
4. [Vercel Deployment (Alternative)](#vercel-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Post-Deployment Setup](#post-deployment-setup)
7. [Testing Production](#testing-production)
8. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before deploying, make sure you have:

- ✅ GitHub account (already done)
- ✅ Code pushed to GitHub (already done)
- ✅ MongoDB Atlas account (free tier)
- ✅ Railway account (free tier) OR Vercel account
- ✅ QR codes printed and placed at locations

---

## 🗄️ MongoDB Atlas Setup (Cloud Database)

### Step 1: Create MongoDB Atlas Account

1. **Go to:** https://www.mongodb.com/cloud/atlas/register
2. **Sign up** with Google or Email
3. **Choose:** Free tier (M0 Sandbox)
4. **Select:** Cloud provider (AWS recommended)
5. **Choose:** Region closest to you
6. **Click:** "Create Cluster"

### Step 2: Create Database User

1. **Go to:** Database Access (left sidebar)
2. **Click:** "Add New Database User"
3. **Choose:** Password authentication
4. **Username:** `treasurehunt`
5. **Password:** Generate a strong password (save it!)
6. **Database User Privileges:** Read and write to any database
7. **Click:** "Add User"

### Step 3: Whitelist IP Addresses

1. **Go to:** Network Access (left sidebar)
2. **Click:** "Add IP Address"
3. **Choose:** "Allow Access from Anywhere" (0.0.0.0/0)
4. **Click:** "Confirm"

⚠️ **Note:** For production, restrict to specific IPs

### Step 4: Get Connection String

1. **Go to:** Database → Clusters
2. **Click:** "Connect" on your cluster
3. **Choose:** "Connect your application"
4. **Driver:** Node.js
5. **Version:** 4.1 or later
6. **Copy** the connection string:
   ```
   mongodb+srv://treasurehunt:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. **Replace** `<password>` with your actual password
8. **Add** database name: `/treasure-hunt` before the `?`
   ```
   mongodb+srv://treasurehunt:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/treasure-hunt?retryWrites=true&w=majority
   ```

**Save this connection string!** You'll need it for deployment.

---

## 🚂 Railway Deployment (Recommended)

Railway is perfect for Node.js apps with MongoDB.

### Step 1: Create Railway Account

1. **Go to:** https://railway.app/
2. **Click:** "Login" → "Login with GitHub"
3. **Authorize** Railway to access your GitHub

### Step 2: Create New Project

1. **Click:** "New Project"
2. **Choose:** "Deploy from GitHub repo"
3. **Select:** `aniruddhakv/mystery-hunt-`
4. **Click:** "Deploy Now"

### Step 3: Configure Environment Variables

1. **Go to:** Your project → Variables tab
2. **Add** the following variables:

```bash
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://treasurehunt:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/treasure-hunt?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourStrongAdminPassword123!
```

**Important:**
- Replace `MONGODB_URI` with your actual MongoDB Atlas connection string
- Change `JWT_SECRET` to a random 32+ character string
- Change `ADMIN_PASSWORD` to a strong password

### Step 4: Deploy

1. Railway will **automatically deploy** after adding variables
2. **Wait** 2-3 minutes for deployment
3. **Check** deployment logs for any errors
4. **Get** your app URL from Railway dashboard

### Step 5: Generate Domain

1. **Go to:** Settings tab
2. **Click:** "Generate Domain"
3. **Copy** your Railway domain (e.g., `mystery-hunt-production.up.railway.app`)

---

## ▲ Vercel Deployment (Alternative)

Vercel is great for frontend, but requires serverless setup for backend.

### Step 1: Create Vercel Account

1. **Go to:** https://vercel.com/signup
2. **Sign up** with GitHub
3. **Authorize** Vercel

### Step 2: Import Project

1. **Click:** "Add New" → "Project"
2. **Import** `aniruddhakv/mystery-hunt-`
3. **Framework Preset:** Other
4. **Root Directory:** ./
5. **Build Command:** `npm install`
6. **Output Directory:** Leave empty

### Step 3: Configure Environment Variables

Add these in Vercel project settings:

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://treasurehunt:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/treasure-hunt?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourStrongAdminPassword123!
```

### Step 4: Deploy

1. **Click:** "Deploy"
2. **Wait** for deployment to complete
3. **Get** your Vercel URL (e.g., `mystery-hunt.vercel.app`)

---

## 🔧 Environment Configuration

### Production Environment Variables

Create these in your deployment platform:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | Database connection | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing key | `random-32-char-string` |
| `ADMIN_USERNAME` | Admin username | `admin` |
| `ADMIN_PASSWORD` | Admin password | `SecurePass123!` |

### Generate Strong JWT Secret

Use this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use an online generator: https://www.grc.com/passwords.htm

---

## 🎯 Post-Deployment Setup

### Step 1: Verify Deployment

1. **Open** your deployed URL
2. **Check** if login page loads
3. **Try** admin login
4. **Verify** database connection

### Step 2: Create Player Accounts

1. **Login** as admin
2. **Click** "Create New User"
3. **Create** accounts for all participants
4. **Save** credentials in a secure document

### Step 3: Print QR Codes

1. **Download** QR codes from repository
2. **Or generate** new ones: `npm run generate-qr`
3. **Print** `qr-codes/QR_Codes_Print_Sheet.html`
4. **Cut** and laminate QR codes
5. **Place** at the 12 locations

### Step 4: Test Complete Flow

1. **Login** as a test player
2. **Scan** QR code 1 (or use manual entry)
3. **Verify** timer starts
4. **Scan** QR code 2
5. **Verify** progression works
6. **Complete** all 12 levels
7. **Check** completion screen
8. **Verify** time in admin panel

---

## 🧪 Testing Production

### Test Checklist

#### Admin Panel:
- [ ] Admin login works
- [ ] Can create users
- [ ] Statistics display correctly
- [ ] User table loads
- [ ] Can reset user progress
- [ ] Can delete users
- [ ] Can enable/disable users

#### Player Experience:
- [ ] Player login works
- [ ] First clue displays
- [ ] Timer starts automatically
- [ ] QR scanner opens
- [ ] Camera works (on mobile)
- [ ] Manual entry works
- [ ] Wrong QR shows error
- [ ] Correct QR advances level
- [ ] Progress updates
- [ ] Completion screen shows

#### Mobile Testing:
- [ ] Responsive design works
- [ ] Touch controls work
- [ ] Camera access works
- [ ] Modals fit screen
- [ ] Forms are usable

---

## 🔍 Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
1. Check MongoDB Atlas connection string
2. Verify database user password
3. Check IP whitelist (0.0.0.0/0)
4. Ensure database name is in connection string

### Issue: "Admin user not created"

**Solution:**
1. Check server logs
2. Verify ADMIN_USERNAME and ADMIN_PASSWORD are set
3. Restart the application
4. Check MongoDB Atlas for users collection

### Issue: "Camera not working"

**Solution:**
1. Ensure HTTPS is enabled (required for camera)
2. Railway provides HTTPS by default
3. Use manual QR entry as fallback
4. Check browser permissions

### Issue: "QR codes not scanning"

**Solution:**
1. Ensure QR codes are clear and well-lit
2. Try manual entry with QR code text
3. Check QR code format: `TREASURE_HUNT_QR_X`
4. Verify clues.js has correct QR codes

### Issue: "Environment variables not loading"

**Solution:**
1. Check variable names (case-sensitive)
2. Restart deployment after adding variables
3. Check deployment logs for errors
4. Verify no extra spaces in values

---

## 📱 Mobile App Setup (Optional)

For better mobile experience, users can:

1. **Open** your deployed URL in mobile browser
2. **Add to Home Screen:**
   - **iOS:** Safari → Share → Add to Home Screen
   - **Android:** Chrome → Menu → Add to Home Screen
3. **Icon** will appear on home screen
4. **Opens** like a native app

---

## 🔐 Security Checklist

Before going live:

- [ ] Changed default admin password
- [ ] Generated strong JWT secret
- [ ] MongoDB Atlas IP whitelist configured
- [ ] HTTPS enabled (automatic on Railway/Vercel)
- [ ] Environment variables secured
- [ ] No sensitive data in code
- [ ] `.env` file in `.gitignore`

---

## 📊 Monitoring

### Railway Monitoring:

1. **Go to:** Project → Metrics
2. **View:** CPU, Memory, Network usage
3. **Check:** Deployment logs
4. **Monitor:** Request count

### MongoDB Atlas Monitoring:

1. **Go to:** Clusters → Metrics
2. **View:** Connections, Operations
3. **Check:** Storage usage
4. **Monitor:** Query performance

---

## 🎉 Launch Checklist

Before your event:

- [ ] Deployment successful
- [ ] Database connected
- [ ] Admin account working
- [ ] All player accounts created
- [ ] QR codes printed and placed
- [ ] Complete flow tested
- [ ] Mobile testing done
- [ ] Backup plan ready
- [ ] Support contact shared
- [ ] Event rules explained

---

## 📞 Support

### If Issues Occur During Event:

1. **Check** deployment status on Railway/Vercel
2. **View** logs for errors
3. **Verify** MongoDB Atlas connection
4. **Test** with manual QR entry
5. **Have** backup QR codes ready

### Emergency Contacts:

- Railway Support: https://railway.app/help
- MongoDB Support: https://www.mongodb.com/support
- GitHub Issues: https://github.com/aniruddhakv/mystery-hunt-/issues

---

## 🎯 Quick Deployment Summary

### For Railway (Recommended):

```bash
1. Create MongoDB Atlas cluster
2. Get connection string
3. Login to Railway with GitHub
4. Deploy from GitHub repo
5. Add environment variables
6. Generate domain
7. Test deployment
8. Create player accounts
9. Print QR codes
10. Launch event!
```

### Estimated Time:
- MongoDB Atlas setup: 10 minutes
- Railway deployment: 5 minutes
- Testing: 10 minutes
- **Total: ~25 minutes**

---

## 🌐 Your Deployment URLs

After deployment, save these:

**Production URL:** `https://your-app.up.railway.app`  
**Admin Login:** `https://your-app.up.railway.app`  
**GitHub Repo:** https://github.com/aniruddhakv/mystery-hunt-.git  
**MongoDB Atlas:** https://cloud.mongodb.com/

---

## ✅ Deployment Status

- [x] Code pushed to GitHub
- [ ] MongoDB Atlas configured
- [ ] Railway/Vercel deployed
- [ ] Environment variables set
- [ ] Domain generated
- [ ] Admin account tested
- [ ] Player accounts created
- [ ] QR codes printed
- [ ] Complete flow tested
- [ ] Ready for event

---

**Next Steps:** Follow the MongoDB Atlas setup, then Railway deployment!

**Good luck with your Treasure Hunt event! 🎉🗺️**

