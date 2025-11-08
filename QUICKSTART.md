# ⚡ Quick Start Guide

Get your treasure hunt running in 5 minutes!

## 🎯 For Local Testing

### Step 1: Install Dependencies (1 minute)

```bash
npm install
```

### Step 2: Setup Environment (30 seconds)

```bash
cp .env.example .env
```

The default `.env` works for local testing with MongoDB running locally.

**If you don't have MongoDB installed locally**, use MongoDB Atlas (free):
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### Step 3: Generate QR Codes (30 seconds)

```bash
npm run generate-qr
```

This creates:
- `qr-codes/` folder with all QR code images
- `QR_Codes_Print_Sheet.html` for easy printing

### Step 4: Start Server (10 seconds)

```bash
npm start
```

### Step 5: Open and Test (1 minute)

1. Open browser: http://localhost:3000
2. Login with: `admin` / `admin123`
3. Create a test user
4. Logout and login as test user
5. Test QR scanning with manual input

**Test QR Codes:**
- Level 2: `TREASURE_HUNT_QR_2`
- Level 3: `TREASURE_HUNT_QR_3`
- etc.

---

## 🌐 For Production Deployment

### Option 1: All-in-One Vercel (Easiest)

1. **Setup MongoDB Atlas** (5 minutes)
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string

2. **Deploy to Vercel** (3 minutes)
   - Push code to GitHub
   - Go to https://vercel.com
   - Import repository
   - Add environment variables:
     ```
     MONGODB_URI=your-connection-string
     JWT_SECRET=your-secret-key-min-32-chars
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD=your-secure-password
     ```
   - Deploy!

3. **Done!** Your app is live at `https://your-app.vercel.app`

### Option 2: Railway + Vercel (More Control)

See `DEPLOYMENT.md` for detailed instructions.

---

## 📱 Setting Up the Game

### 1. Print QR Codes

```bash
npm run generate-qr
```

Open `qr-codes/QR_Codes_Print_Sheet.html` and print.

### 2. Place QR Codes

Place at these locations:
1. Notice Board
2. Library
3. Computer Lab
4. Canteen
5. Playground
6. Staircase
7. Staff Room Door
8. Water Cooler
9. Auditorium
10. Parking Area
11. Garden / Tree
12. Final Treasure Point

### 3. Create Players

1. Login as admin
2. Click "Create New User"
3. Enter username and password
4. Share credentials with players

### 4. Start the Hunt!

Players:
1. Login with their credentials
2. Read first clue
3. Find location and scan QR
4. Continue until completion
5. See their final time!

---

## 🎮 Game Rules

1. **Login** - Players login to start
2. **First Clue** - Appears immediately after login
3. **Timer Starts** - Automatically when first clue is shown
4. **Scan QR** - Find location and scan correct QR code
5. **Wrong QR** - Shows error message, must find correct one
6. **Progress** - Track progress through 12 levels
7. **Completion** - Timer stops, final time displayed
8. **Leaderboard** - Admin can see all completion times

---

## 🔧 Common Commands

```bash
# Install dependencies
npm install

# Start server (production)
npm start

# Start with auto-reload (development)
npm run dev

# Generate QR codes
npm run generate-qr
```

---

## 🎨 Customization

### Change Clues

Edit `config/clues.js`:

```javascript
{
  level: 1,
  location: "Your Location",
  clue: "Your riddle here...",
  hint: "Your hint",
  qrCode: "TREASURE_HUNT_QR_1"
}
```

Then regenerate QR codes:
```bash
npm run generate-qr
```

### Change Admin Password

Edit `.env`:
```env
ADMIN_USERNAME=youradmin
ADMIN_PASSWORD=YourSecurePassword123!
```

Restart server.

---

## 📱 Mobile Testing

### Test on Your Phone

1. Find your computer's local IP:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`

2. Start server:
   ```bash
   npm start
   ```

3. On phone, visit:
   ```
   http://YOUR_IP:3000
   ```
   Example: `http://192.168.1.100:3000`

4. Test QR scanning with camera!

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"

**Local MongoDB not installed?**
Use MongoDB Atlas (free):
1. https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update `.env`

### "Camera not working"

- Use HTTPS (required for camera)
- Or use manual QR input
- Or test on deployed version (has HTTPS)

### "Port 3000 already in use"

Change port in `.env`:
```env
PORT=3001
```

---

## ✅ Pre-Game Checklist

Before starting the treasure hunt:

- [ ] Server running and accessible
- [ ] Admin login working
- [ ] All 12 QR codes printed
- [ ] QR codes placed at locations
- [ ] Test scan of each QR code
- [ ] All players created
- [ ] Credentials shared with players
- [ ] Backup plan if tech fails
- [ ] Someone monitoring admin panel

---

## 🎉 You're Ready!

**Everything is set up! Start the treasure hunt and have fun! 🏆**

---

## 📚 More Information

- Full documentation: `README.md`
- Deployment guide: `DEPLOYMENT.md`
- Need help? Create an issue on GitHub

---

**Happy Hunting! 🗺️✨**

