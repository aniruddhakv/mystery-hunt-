# ⚡ Quick Deployment Guide - 15 Minutes

**GitHub Repository:** https://github.com/aniruddhakv/mystery-hunt-.git  
**Status:** ✅ Code is ready!

---

## 🚀 3-Step Deployment

### Step 1: MongoDB Atlas (5 minutes)

1. **Go to:** https://www.mongodb.com/cloud/atlas/register
2. **Sign up** → Choose Free Tier (M0)
3. **Create Cluster** → Wait 3 minutes
4. **Database Access** → Add User:
   - Username: `treasurehunt`
   - Password: (generate and save)
5. **Network Access** → Add IP: `0.0.0.0/0` (Allow all)
6. **Connect** → Get connection string:
   ```
   mongodb+srv://treasurehunt:PASSWORD@cluster0.xxxxx.mongodb.net/treasure-hunt?retryWrites=true&w=majority
   ```
   **Save this!**

---

### Step 2: Railway Deployment (5 minutes)

1. **Go to:** https://railway.app/
2. **Login with GitHub**
3. **New Project** → Deploy from GitHub
4. **Select:** `aniruddhakv/mystery-hunt-`
5. **Add Variables:**
   ```
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<generate-random-32-chars>
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=<your-strong-password>
   ```
6. **Settings** → Generate Domain
7. **Copy** your URL: `https://mystery-hunt-production.up.railway.app`

---

### Step 3: Setup & Test (5 minutes)

1. **Open** your Railway URL
2. **Login** as admin
3. **Create** player accounts
4. **Test** QR scanning
5. **Print** QR codes from `qr-codes/` folder
6. **Done!** 🎉

---

## 📋 Environment Variables Template

Copy and paste this into Railway Variables:

```bash
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://treasurehunt:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/treasure-hunt?retryWrites=true&w=majority
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123456
```

**⚠️ Remember to:**
- Replace `YOUR_PASSWORD` with your MongoDB password
- Change `JWT_SECRET` to a random string
- Change `ADMIN_PASSWORD` to a strong password

---

## 🎯 Generate JWT Secret

**Option 1:** Use this command in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2:** Use online generator:
https://www.grc.com/passwords.htm

**Option 3:** Random string (32+ characters):
```
7k9mP2qR5tY8wE3xC6vB9nM4jH7gF0dS
```

---

## ✅ Quick Checklist

### MongoDB Atlas:
- [ ] Account created
- [ ] Free cluster created
- [ ] Database user added
- [ ] IP whitelist set (0.0.0.0/0)
- [ ] Connection string copied

### Railway:
- [ ] Account created (GitHub login)
- [ ] Project deployed
- [ ] Environment variables added
- [ ] Domain generated
- [ ] Deployment successful

### Testing:
- [ ] URL opens
- [ ] Admin login works
- [ ] Can create users
- [ ] QR scanner works
- [ ] Database saves data

---

## 🔗 Important Links

| Service | URL | Purpose |
|---------|-----|---------|
| **GitHub Repo** | https://github.com/aniruddhakv/mystery-hunt-.git | Source code |
| **MongoDB Atlas** | https://cloud.mongodb.com/ | Database |
| **Railway** | https://railway.app/ | Hosting |
| **Your App** | (Generated after deploy) | Live app |

---

## 🆘 Quick Troubleshooting

### "Cannot connect to database"
→ Check MongoDB connection string in Railway variables

### "Admin login not working"
→ Check ADMIN_USERNAME and ADMIN_PASSWORD in Railway variables

### "Camera not working"
→ Use manual QR entry (works without camera)

### "Page not loading"
→ Check Railway deployment logs for errors

---

## 📱 Share with Players

After deployment, share this with players:

```
🎮 Treasure Hunt Mystery Game

🌐 URL: https://your-app.up.railway.app
👤 Username: [provided by admin]
🔑 Password: [provided by admin]

📱 For best experience:
- Use mobile browser
- Allow camera access
- Add to home screen

Good luck! 🏆
```

---

## 🎉 You're Done!

**Total Time:** ~15 minutes  
**Cost:** $0 (Free tier)  
**Status:** Production ready!

**Next:** Create player accounts and print QR codes!

---

## 📞 Need Help?

**Full Guide:** See `DEPLOYMENT_GUIDE.md`  
**Issues:** https://github.com/aniruddhakv/mystery-hunt-/issues  
**Railway Docs:** https://docs.railway.app/  
**MongoDB Docs:** https://www.mongodb.com/docs/atlas/

---

**Happy Treasure Hunting! 🗺️✨**

