# 🔧 Troubleshooting Guide

Common issues and their solutions for the Treasure Hunt application.

---

## 🚨 Installation Issues

### Issue: `npm install` fails

**Symptoms:**
- Error messages during installation
- Missing dependencies

**Solutions:**

1. **Check Node.js version:**
   ```bash
   node --version
   ```
   Need Node.js 18 or higher. Update if needed.

2. **Clear npm cache:**
   ```bash
   npm cache clean --force
   npm install
   ```

3. **Delete node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Use different registry (if in restricted network):**
   ```bash
   npm config set registry https://registry.npmjs.org/
   npm install
   ```

---

## 🗄️ Database Issues

### Issue: "Cannot connect to MongoDB"

**Symptoms:**
- Server fails to start
- Error: "MongooseServerSelectionError"

**Solutions:**

#### For Local MongoDB:

1. **Check if MongoDB is running:**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl status mongod
   ```

2. **Start MongoDB:**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

3. **Install MongoDB if not installed:**
   - Download from: https://www.mongodb.com/try/download/community

#### For MongoDB Atlas:

1. **Check connection string in `.env`:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/treasure-hunt
   ```

2. **Verify credentials:**
   - Username and password are correct
   - Password doesn't contain special characters (or URL encode them)

3. **Check IP whitelist:**
   - MongoDB Atlas → Network Access
   - Add IP: 0.0.0.0/0 (allow all)

4. **Check database user permissions:**
   - MongoDB Atlas → Database Access
   - User should have "Read and write to any database"

---

## 🔐 Authentication Issues

### Issue: "Invalid authentication token"

**Symptoms:**
- Logged in but getting auth errors
- API calls failing

**Solutions:**

1. **Clear browser storage:**
   - Open DevTools (F12)
   - Application → Local Storage
   - Delete all items
   - Refresh page

2. **Check JWT_SECRET:**
   - Ensure `.env` has JWT_SECRET set
   - Should be at least 32 characters
   - Restart server after changing

3. **Token expired:**
   - Tokens expire after 24 hours
   - Just login again

### Issue: "Invalid credentials"

**Symptoms:**
- Cannot login with correct password

**Solutions:**

1. **Check username/password:**
   - No extra spaces
   - Correct case (usernames are case-sensitive)

2. **Reset admin password:**
   - Stop server
   - Delete database or user collection
   - Update `.env` with new password
   - Restart server (admin will be recreated)

3. **Check if user is active:**
   - Admin may have disabled the account
   - Ask admin to reactivate

---

## 📷 QR Scanner Issues

### Issue: Camera not working

**Symptoms:**
- Black screen in scanner
- "Camera access denied"
- Scanner doesn't open

**Solutions:**

1. **Check HTTPS:**
   - Camera requires HTTPS
   - Use deployed version (has HTTPS)
   - Or use manual QR input

2. **Grant camera permissions:**
   - Browser will ask for permission
   - Click "Allow"
   - If denied, go to browser settings:
     - Chrome: Settings → Privacy → Site Settings → Camera
     - Safari: Preferences → Websites → Camera

3. **Check if camera is in use:**
   - Close other apps using camera
   - Restart browser

4. **Try different browser:**
   - Chrome works best
   - Safari on iOS works well
   - Firefox also supported

5. **Use manual input:**
   - Scroll down in scanner
   - Enter QR code manually
   - Click Submit

### Issue: QR codes not scanning

**Symptoms:**
- Scanner open but not detecting QR
- Wrong codes detected

**Solutions:**

1. **Improve lighting:**
   - Ensure good lighting on QR code
   - Avoid glare and shadows

2. **Hold steady:**
   - Keep phone steady
   - Position QR code in center box
   - Keep appropriate distance (15-30cm)

3. **Check QR code quality:**
   - Print should be clear
   - No smudges or damage
   - Adequate size (at least 5x5cm)

4. **Regenerate QR codes:**
   ```bash
   npm run generate-qr
   ```
   Print fresh copies

5. **Use manual input:**
   - Type the code shown below QR
   - Example: `TREASURE_HUNT_QR_2`

---

## ⏱️ Timer Issues

### Issue: Timer not starting

**Symptoms:**
- Timer shows 00:00:00 and doesn't move

**Solutions:**

1. **Refresh page:**
   - Timer starts when first clue loads
   - Refresh to restart

2. **Check JavaScript errors:**
   - Open DevTools (F12) → Console
   - Look for errors
   - Report if found

3. **Clear cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Issue: Timer not stopping

**Symptoms:**
- Completed game but timer still running

**Solutions:**

1. **Check completion:**
   - Ensure all 12 QR codes scanned
   - Check admin panel for status

2. **Logout and login:**
   - Should show completion screen
   - Timer should be stopped

---

## 🎮 Game Flow Issues

### Issue: "Wrong QR code" error for correct code

**Symptoms:**
- Scanning correct QR but getting error
- Cannot progress

**Solutions:**

1. **Check current level:**
   - You must scan QR codes in order
   - Level 1 → scan QR 2
   - Level 2 → scan QR 3
   - Cannot skip levels

2. **Verify QR code:**
   - Check the code text below QR image
   - Should match: `TREASURE_HUNT_QR_X`
   - X should be your current level + 1

3. **Reset progress (admin):**
   - Admin can reset your progress
   - Start fresh from level 1

### Issue: Stuck on a level

**Symptoms:**
- Cannot find location
- QR code missing

**Solutions:**

1. **Read clue carefully:**
   - Clue describes the location
   - Hint gives additional info

2. **Check hint:**
   - Scroll down to see hint
   - Provides direction to next location

3. **Ask organizer:**
   - QR code may be misplaced
   - Organizer can help

4. **Use manual input:**
   - If you find the location but QR is damaged
   - Ask organizer for the code
   - Enter manually

---

## 👨‍💼 Admin Panel Issues

### Issue: Cannot create users

**Symptoms:**
- "Username already exists" error
- Create button not working

**Solutions:**

1. **Check username uniqueness:**
   - Each username must be unique
   - Try different username

2. **Check for spaces:**
   - No spaces in username
   - Use underscores: `player_1`

3. **Refresh users list:**
   - Click refresh button
   - Check if user was actually created

### Issue: Cannot see user progress

**Symptoms:**
- Users table empty
- Progress not updating

**Solutions:**

1. **Click refresh:**
   - Click "🔄 Refresh" button
   - Data updates in real-time

2. **Check database connection:**
   - Ensure MongoDB is connected
   - Check server logs

3. **Verify users exist:**
   - Create test user
   - Should appear immediately

---

## 🌐 Deployment Issues

### Issue: Vercel deployment fails

**Symptoms:**
- Build errors
- Deployment fails

**Solutions:**

1. **Check environment variables:**
   - All required vars set in Vercel dashboard
   - No typos in variable names

2. **Check vercel.json:**
   - Should be in root directory
   - Proper JSON format

3. **Check logs:**
   - Vercel dashboard → Deployments → View logs
   - Look for specific errors

4. **Redeploy:**
   - Sometimes just redeploy works
   - Vercel dashboard → Redeploy

### Issue: Railway deployment fails

**Symptoms:**
- App crashes on Railway
- Cannot access backend

**Solutions:**

1. **Check environment variables:**
   - All vars set in Railway
   - MONGODB_URI is correct

2. **Check logs:**
   - Railway dashboard → Logs
   - Look for connection errors

3. **Check PORT:**
   - Railway assigns PORT automatically
   - Don't hardcode port in code

4. **Restart deployment:**
   - Railway dashboard → Restart

### Issue: MongoDB Atlas connection fails in production

**Symptoms:**
- Works locally but not in production
- Connection timeout

**Solutions:**

1. **Check IP whitelist:**
   - MongoDB Atlas → Network Access
   - Add 0.0.0.0/0 (allow all IPs)

2. **Check connection string:**
   - Should use `mongodb+srv://`
   - Include database name
   - Password URL encoded

3. **Check database user:**
   - User exists
   - Has correct permissions
   - Password is correct

---

## 📱 Mobile Issues

### Issue: Layout broken on mobile

**Symptoms:**
- Elements overlapping
- Text too small
- Buttons not clickable

**Solutions:**

1. **Clear cache:**
   - Mobile browser settings
   - Clear cache and data
   - Reload page

2. **Try different browser:**
   - Chrome mobile
   - Safari (iOS)
   - Firefox mobile

3. **Check viewport:**
   - Zoom level at 100%
   - Rotate device if needed

### Issue: App slow on mobile

**Symptoms:**
- Slow loading
- Laggy animations

**Solutions:**

1. **Check internet connection:**
   - Use WiFi if possible
   - 4G/5G should work

2. **Close other apps:**
   - Free up memory
   - Close background apps

3. **Clear browser cache:**
   - Settings → Clear cache
   - Reload app

---

## 🔍 Debugging Tips

### Enable Debug Mode

1. **Open browser DevTools:**
   - Press F12 (Windows/Linux)
   - Cmd+Option+I (Mac)

2. **Check Console tab:**
   - Look for red errors
   - Note error messages

3. **Check Network tab:**
   - See API calls
   - Check for failed requests
   - View response data

### Server Logs

1. **View server console:**
   - Terminal where server is running
   - Look for error messages

2. **Enable verbose logging:**
   - Add console.log statements
   - Check request/response data

### Database Inspection

1. **MongoDB Compass:**
   - Download: https://www.mongodb.com/products/compass
   - Connect to your database
   - View collections and documents

2. **MongoDB Atlas UI:**
   - Browse Collections
   - View user data
   - Check game progress

---

## 🆘 Getting Help

### Before Asking for Help

1. **Check this guide** - Most issues covered here
2. **Check documentation** - README.md, QUICKSTART.md
3. **Run verification** - `npm run verify`
4. **Check logs** - Browser console and server logs
5. **Try basic fixes** - Restart, clear cache, refresh

### When Asking for Help

Include:
- **What you're trying to do**
- **What's happening** (error messages)
- **What you've tried**
- **Environment** (browser, OS, Node version)
- **Screenshots** (if applicable)
- **Console errors** (from DevTools)

### Resources

- **Documentation:** README.md
- **Quick Start:** QUICKSTART.md
- **Deployment:** DEPLOYMENT.md
- **Testing:** TESTING.md
- **Project Info:** PROJECT_SUMMARY.md

---

## ✅ Quick Fixes Checklist

Try these in order:

- [ ] Restart server
- [ ] Clear browser cache
- [ ] Logout and login again
- [ ] Check internet connection
- [ ] Verify environment variables
- [ ] Check MongoDB connection
- [ ] Run `npm run verify`
- [ ] Check browser console for errors
- [ ] Try different browser
- [ ] Restart computer/device

---

## 🎯 Prevention Tips

### For Smooth Operation

1. **Test before event:**
   - Full test run
   - All QR codes
   - Multiple devices

2. **Have backups:**
   - Printed QR codes (extras)
   - Manual QR codes list
   - Backup admin access

3. **Monitor during event:**
   - Keep admin panel open
   - Watch for issues
   - Be ready to help

4. **Prepare participants:**
   - Brief on how to use
   - Show QR scanning
   - Explain manual input option

---

**Still having issues? Check the documentation or create a GitHub issue with details!**

