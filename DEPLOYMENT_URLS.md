# 🚀 Deployment URLs - Treasure Hunt Mystery Game

## 🌐 Live Application URLs

### **Frontend (Vercel)**
```
https://mystery-hunt-two.vercel.app/
```
**Purpose:** User-facing website (HTML, CSS, JavaScript)  
**Hosted on:** Vercel (Global CDN)  
**Status:** ✅ Live

### **Backend (Railway)**
```
https://mystery-hunt-production.up.railway.app/api
```
**Purpose:** API server (Express.js + MongoDB)  
**Hosted on:** Railway  
**Status:** ✅ Live

### **Database (MongoDB Atlas)**
```
MongoDB Atlas Cloud Database
```
**Purpose:** Data storage (users, game progress)  
**Hosted on:** MongoDB Atlas  
**Status:** ✅ Connected

---

## 🔗 API Endpoints

All API endpoints are available at:
```
https://mystery-hunt-production.up.railway.app/api
```

### **Authentication:**
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### **Game:**
- `GET /api/game/clue` - Get current clue
- `POST /api/game/verify-qr` - Verify QR code

### **Admin:**
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `POST /api/admin/users/:id/reset` - Reset user progress
- `DELETE /api/admin/users/:id` - Delete user
- `PATCH /api/admin/users/:id/toggle` - Enable/disable user

---

## 🧪 Test Your Deployment

### **1. Test Frontend:**
```
Open: https://mystery-hunt-two.vercel.app/
Expected: Login page loads
```

### **2. Test Backend API:**
```bash
curl -X POST https://mystery-hunt-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"TreasureAdmin@2025"}'
```
**Expected:** Returns JWT token and user data

### **3. Test Admin Login:**
```
1. Go to: https://mystery-hunt-two.vercel.app/
2. Username: admin
3. Password: TreasureAdmin@2025
4. Expected: Admin dashboard loads
```

### **4. Test Player Flow:**
```
1. Create test user in admin panel
2. Logout and login as test user
3. Expected: First clue appears
4. Expected: Timer starts
```

---

## 📊 Architecture

```
User Browser
    ↓
https://mystery-hunt-two.vercel.app/
(Vercel - Frontend)
    ↓ API Calls
https://mystery-hunt-production.up.railway.app/api
(Railway - Backend)
    ↓ Database Queries
MongoDB Atlas
(Database)
```

---

## 🔧 Configuration

### **Frontend Configuration:**
- **File:** `public/js/app.js` (Line 5)
- **API URL:** `https://mystery-hunt-production.up.railway.app/api`

### **Backend Configuration:**
- **File:** `server.js` (Line 20)
- **CORS Origin:** `https://mystery-hunt-two.vercel.app`

---

## 🎯 Share with Players

**Website URL:**
```
https://mystery-hunt-two.vercel.app/
```

**Instructions for Players:**
1. Open the website on your mobile device
2. Login with credentials provided by admin
3. Read the first clue
4. Find the location and scan the QR code
5. Continue until all 12 levels are complete!

---

## 📱 QR Code for Easy Access

You can create a QR code pointing to:
```
https://mystery-hunt-two.vercel.app/
```

Players can scan this QR code to quickly access the game!

---

## 🔄 Update Workflow

### **Update Frontend:**
```bash
# Edit files in public/ folder
git add .
git commit -m "Update frontend"
git push
# Vercel auto-deploys in ~1 minute
```

### **Update Backend:**
```bash
# Edit server.js, models, etc.
git add .
git commit -m "Update backend"
git push
# Railway auto-deploys in ~2 minutes
```

---

## 📞 Dashboard Links

| Service | Dashboard URL |
|---------|---------------|
| **Vercel** | https://vercel.com/dashboard |
| **Railway** | https://railway.app/dashboard |
| **MongoDB Atlas** | https://cloud.mongodb.com/ |
| **GitHub** | https://github.com/aniruddhakv/mystery-hunt-.git |

---

## 🆘 Troubleshooting

### **Frontend not loading:**
1. Check Vercel dashboard for deployment status
2. View deployment logs in Vercel
3. Check browser console for errors (F12)

### **API calls failing:**
1. Check Railway dashboard for backend status
2. View Railway logs for errors
3. Verify CORS configuration in server.js
4. Test API directly with curl

### **CORS errors:**
1. Verify Vercel URL in server.js CORS config
2. Redeploy Railway backend
3. Clear browser cache

---

## ✅ Deployment Status

- ✅ **Frontend:** Deployed on Vercel
- ✅ **Backend:** Deployed on Railway
- ✅ **Database:** Connected to MongoDB Atlas
- ✅ **CORS:** Configured
- ✅ **API:** Connected
- ✅ **Ready:** For production use!

---

## 🎉 Your Treasure Hunt is Live!

**Frontend:** https://mystery-hunt-two.vercel.app/  
**Backend:** https://mystery-hunt-production.up.railway.app/api  
**Status:** ✅ Production Ready

**Happy Treasure Hunting! 🗺️✨**

