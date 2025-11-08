# 🚀 Deployment Guide

Complete step-by-step guide to deploy your Treasure Hunt application.

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas account created
- [ ] Railway account created (for backend)
- [ ] Vercel account created (for frontend)
- [ ] GitHub repository created (optional but recommended)
- [ ] QR codes generated and printed
- [ ] Environment variables prepared

---

## 🗄️ Step 1: MongoDB Atlas Setup

### 1.1 Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" and sign up
3. Verify your email

### 1.2 Create a Cluster

1. Click "Build a Database"
2. Choose "FREE" tier (M0 Sandbox)
3. Select a cloud provider and region (choose closest to your users)
4. Click "Create Cluster"
5. Wait 3-5 minutes for cluster creation

### 1.3 Create Database User

1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `treasurehunt`
5. Password: Generate a secure password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 1.4 Configure Network Access

1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

**Note:** For production, restrict to specific IPs for better security.

### 1.5 Get Connection String

1. Click "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string:
   ```
   mongodb+srv://treasurehunt:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your database user password
6. Add database name: `treasure-hunt`
   ```
   mongodb+srv://treasurehunt:yourpassword@cluster0.xxxxx.mongodb.net/treasure-hunt?retryWrites=true&w=majority
   ```

---

## 🚂 Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account

1. Go to [https://railway.app](https://railway.app)
2. Sign up with GitHub (recommended)

### 2.2 Create New Project

1. Click "New Project"
2. Choose "Deploy from GitHub repo" (if connected) OR "Empty Project"

### 2.3 Deploy from GitHub (Recommended)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/treasure-hunt.git
   git push -u origin main
   ```

2. In Railway, select your repository
3. Railway will auto-detect Node.js

### 2.4 Deploy Manually (Alternative)

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login:
   ```bash
   railway login
   ```

3. Initialize and deploy:
   ```bash
   railway init
   railway up
   ```

### 2.5 Configure Environment Variables

1. In Railway dashboard, click on your project
2. Go to "Variables" tab
3. Add these variables:

```env
MONGODB_URI=mongodb+srv://treasurehunt:yourpassword@cluster0.xxxxx.mongodb.net/treasure-hunt?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecureAdminPassword123!
NODE_ENV=production
PORT=3000
```

### 2.6 Get Railway URL

1. Railway will provide a URL like: `https://treasure-hunt-production.up.railway.app`
2. Save this URL - you'll need it for frontend configuration

### 2.7 Test Backend

Visit: `https://your-railway-url.railway.app/api/auth/me`

You should see an authentication error (this is correct - it means the API is working).

---

## ▲ Step 3: Deploy Frontend to Vercel

### Option A: Deploy Full Stack to Vercel (Easiest)

Vercel can host both frontend and backend together.

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: `public`
6. Add Environment Variables:
   ```
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-secret-key
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-password
   NODE_ENV=production
   ```
7. Click "Deploy"
8. Wait 2-3 minutes
9. Your app will be live at: `https://your-app.vercel.app`

### Option B: Frontend Only on Vercel (Backend on Railway)

If you deployed backend to Railway separately:

1. Update `public/js/app.js`:
   ```javascript
   const API_URL = 'https://your-railway-backend.railway.app/api';
   ```

2. Deploy to Vercel:
   - Framework Preset: **Other**
   - Build Command: (leave empty)
   - Output Directory: `public`

3. No environment variables needed for frontend-only deployment

---

## 🔧 Step 4: Post-Deployment Configuration

### 4.1 Test the Application

1. Visit your Vercel URL
2. Try logging in with admin credentials
3. Create a test user
4. Test QR scanning with manual input

### 4.2 Generate QR Codes

On your local machine:
```bash
npm run generate-qr
```

This creates:
- `qr-codes/` folder with PNG images
- `QR_Codes_Print_Sheet.html` for printing

### 4.3 Print and Place QR Codes

1. Open `qr-codes/QR_Codes_Print_Sheet.html`
2. Print or save as PDF
3. Cut out each QR code
4. Place at designated locations
5. Test scanning each code

### 4.4 Create Game Users

1. Login as admin
2. Create users for all participants
3. Share credentials securely

---

## 🌐 Custom Domain (Optional)

### Vercel Custom Domain

1. Go to Vercel project settings
2. Click "Domains"
3. Add your domain (e.g., `treasurehunt.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

### Railway Custom Domain

1. Go to Railway project settings
2. Click "Settings" → "Domains"
3. Add custom domain
4. Configure DNS CNAME record
5. Wait for SSL certificate generation

---

## 🔒 Security Hardening

### Production Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Restrict MongoDB IP whitelist (if possible)
- [ ] Enable MongoDB authentication
- [ ] Set secure CORS origins
- [ ] Regular database backups

### Update CORS (if needed)

In `server.js`, update CORS configuration:

```javascript
app.use(cors({
  origin: ['https://your-frontend-domain.vercel.app'],
  credentials: true
}));
```

---

## 📊 Monitoring

### Railway Monitoring

1. View logs: Railway Dashboard → Logs
2. Monitor usage: Railway Dashboard → Metrics
3. Set up alerts for downtime

### Vercel Monitoring

1. View deployments: Vercel Dashboard
2. Check analytics: Vercel Analytics (optional)
3. Monitor performance: Vercel Speed Insights

### MongoDB Monitoring

1. MongoDB Atlas Dashboard → Metrics
2. Monitor connections, operations, storage
3. Set up alerts for high usage

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution:**
- Verify connection string is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions
- Check Railway/Vercel environment variables

### Issue: "Camera not working"

**Solution:**
- Ensure HTTPS is enabled (required for camera)
- Check browser permissions
- Use manual QR input as fallback

### Issue: "API calls failing"

**Solution:**
- Check Railway backend is running
- Verify API_URL in frontend code
- Check CORS configuration
- View Railway logs for errors

### Issue: "QR codes not scanning"

**Solution:**
- Ensure QR codes are printed clearly
- Good lighting required
- Hold phone steady
- Use manual input option

---

## 🔄 Updates and Maintenance

### Update Application

1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```
4. Vercel/Railway auto-deploys from GitHub

### Manual Deployment

**Railway:**
```bash
railway up
```

**Vercel:**
```bash
vercel --prod
```

### Database Backup

1. MongoDB Atlas Dashboard
2. Click "Backup" tab
3. Configure automated backups
4. Or manually export data

---

## 💰 Cost Estimation

### Free Tier Limits

**MongoDB Atlas (Free):**
- 512 MB storage
- Shared RAM
- ~100 concurrent users

**Railway (Free Trial):**
- $5 credit/month
- ~500 hours runtime
- After trial: ~$5-10/month

**Vercel (Free):**
- 100 GB bandwidth/month
- Unlimited deployments
- Perfect for this use case

### Scaling Costs

For 100+ concurrent users:
- MongoDB Atlas: ~$9/month (M2 tier)
- Railway: ~$10-20/month
- Vercel: Free tier sufficient

**Total: ~$20-30/month for 100+ users**

---

## ✅ Final Checklist

Before going live:

- [ ] MongoDB Atlas configured and tested
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Admin login working
- [ ] User creation working
- [ ] QR scanning tested
- [ ] Timer working correctly
- [ ] All 12 locations have QR codes
- [ ] QR codes tested and scanning correctly
- [ ] Admin panel accessible
- [ ] User progress tracking working
- [ ] Completion screen showing correct times
- [ ] Mobile responsive design verified
- [ ] HTTPS enabled
- [ ] Secure passwords set
- [ ] Backup plan in place

---

## 🎉 You're Ready!

Your treasure hunt game is now live and ready for players!

**Share the URL with participants and enjoy the hunt! 🏆**

---

## 📞 Support Resources

- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **Railway Docs:** https://docs.railway.app/
- **Vercel Docs:** https://vercel.com/docs
- **Node.js Docs:** https://nodejs.org/docs/

---

**Need help? Check the main README.md or create an issue on GitHub.**

