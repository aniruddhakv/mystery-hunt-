# 🧪 Testing Guide

Complete testing checklist for the Treasure Hunt application.

## 🚀 Pre-Testing Setup

### 1. Install and Start

```bash
npm install
npm run generate-qr
npm start
```

### 2. Verify Server Running

- Server should start on http://localhost:3000
- Console should show: "✅ Connected to MongoDB"
- Console should show: "✅ Admin user created" (first time only)

---

## ✅ Test Checklist

### Authentication Tests

#### Test 1: Admin Login
- [ ] Navigate to http://localhost:3000
- [ ] Enter username: `admin`
- [ ] Enter password: `admin123`
- [ ] Click "Login"
- [ ] **Expected:** Redirected to Admin Panel

#### Test 2: Invalid Login
- [ ] Try login with wrong credentials
- [ ] **Expected:** Error message "Invalid credentials"

#### Test 3: Empty Fields
- [ ] Try login with empty username/password
- [ ] **Expected:** Error message

---

### Admin Panel Tests

#### Test 4: Create User
- [ ] Login as admin
- [ ] Enter new username: `player1`
- [ ] Enter password: `test123`
- [ ] Click "Create User"
- [ ] **Expected:** Success message, user appears in table

#### Test 5: Duplicate Username
- [ ] Try creating user with existing username
- [ ] **Expected:** Error message "Username already exists"

#### Test 6: View Users List
- [ ] Check users table displays:
  - [ ] Username
  - [ ] Current level (1/12)
  - [ ] Status (Not Started)
  - [ ] Time (-)
  - [ ] Active toggle (ON)
  - [ ] Reset and Delete buttons

#### Test 7: Toggle User Active/Inactive
- [ ] Click toggle switch for a user
- [ ] **Expected:** Toggle changes, success message
- [ ] Try logging in as that user when inactive
- [ ] **Expected:** Error "Account is disabled"
- [ ] Toggle back to active
- [ ] **Expected:** User can login again

#### Test 8: Refresh Users
- [ ] Click "🔄 Refresh" button
- [ ] **Expected:** Users list reloads

#### Test 9: Admin Logout
- [ ] Click "Logout" button
- [ ] **Expected:** Redirected to login screen

---

### Player Game Tests

#### Test 10: Player Login
- [ ] Login with created player credentials
- [ ] **Expected:** Game screen appears
- [ ] **Expected:** First clue is displayed
- [ ] **Expected:** Timer starts (00:00:00)
- [ ] **Expected:** Level shows "1/12"
- [ ] **Expected:** Progress bar at 0%

#### Test 11: First Clue Display
- [ ] Verify clue text is displayed:
  > "News for many, secrets for few, I stand silent, showing what's new..."
- [ ] Verify hint is shown
- [ ] Verify location shows "Notice Board"

#### Test 12: Levels Grid
- [ ] Check levels grid (1-12)
- [ ] Level 1 should be highlighted (current)
- [ ] Levels 2-12 should show lock icons 🔒

#### Test 13: Timer Functionality
- [ ] Wait 10 seconds
- [ ] **Expected:** Timer updates every second
- [ ] **Expected:** Format: HH:MM:SS

#### Test 14: Open QR Scanner
- [ ] Click "📷 Scan QR Code" button
- [ ] **Expected:** Scanner screen opens
- [ ] **Expected:** Camera permission requested (if available)

#### Test 15: Manual QR Input - Correct Code
- [ ] In scanner, enter: `TREASURE_HUNT_QR_2`
- [ ] Click "Submit"
- [ ] **Expected:** Success message
- [ ] **Expected:** Return to game screen
- [ ] **Expected:** Level updates to 2/12
- [ ] **Expected:** New clue appears (Library)
- [ ] **Expected:** Progress bar updates to ~8%
- [ ] **Expected:** Level 1 shows ✓ in grid
- [ ] **Expected:** Level 2 is highlighted

#### Test 16: Manual QR Input - Wrong Code
- [ ] Click scan button
- [ ] Enter: `TREASURE_HUNT_QR_5` (skipping levels)
- [ ] Click "Submit"
- [ ] **Expected:** Error message "Wrong QR code! You are in the wrong spot..."
- [ ] **Expected:** Stay on same level
- [ ] **Expected:** No progress made

#### Test 17: Manual QR Input - Invalid Code
- [ ] Click scan button
- [ ] Enter: `INVALID_CODE`
- [ ] Click "Submit"
- [ ] **Expected:** Error message about wrong spot

#### Test 18: Progress Through All Levels
- [ ] Scan QR codes in order (2-12):
  - `TREASURE_HUNT_QR_3`
  - `TREASURE_HUNT_QR_4`
  - `TREASURE_HUNT_QR_5`
  - `TREASURE_HUNT_QR_6`
  - `TREASURE_HUNT_QR_7`
  - `TREASURE_HUNT_QR_8`
  - `TREASURE_HUNT_QR_9`
  - `TREASURE_HUNT_QR_10`
  - `TREASURE_HUNT_QR_11`
  - `TREASURE_HUNT_QR_12`
- [ ] **Expected:** Each scan advances to next level
- [ ] **Expected:** Progress bar increases
- [ ] **Expected:** Completed levels show ✓

#### Test 19: Game Completion
- [ ] After scanning final QR (level 12)
- [ ] **Expected:** Timer stops
- [ ] **Expected:** Completion screen appears
- [ ] **Expected:** Trophy animation 🏆
- [ ] **Expected:** Final time displayed
- [ ] **Expected:** "Congratulations!" message

#### Test 20: Completed Game - Re-login
- [ ] Logout from completion screen
- [ ] Login again with same player
- [ ] **Expected:** Completion screen appears immediately
- [ ] **Expected:** Same final time shown
- [ ] **Expected:** Cannot play again

#### Test 21: Player Logout
- [ ] Click logout button (🚪)
- [ ] **Expected:** Return to login screen
- [ ] **Expected:** Timer stops

---

### Admin Management Tests

#### Test 22: View Player Progress
- [ ] Login as admin
- [ ] Check player1 in users table
- [ ] **Expected:** Shows "Completed" status
- [ ] **Expected:** Shows final time
- [ ] **Expected:** Shows 12/12 level

#### Test 23: Reset Player Progress
- [ ] Click "Reset" button for player1
- [ ] Confirm reset
- [ ] **Expected:** Success message
- [ ] **Expected:** Player shows 1/12, "Not Started"
- [ ] Logout and login as player1
- [ ] **Expected:** Game starts fresh from level 1

#### Test 24: Delete User
- [ ] Login as admin
- [ ] Create test user: `deletetest`
- [ ] Click "Delete" button for deletetest
- [ ] Confirm deletion
- [ ] **Expected:** Success message
- [ ] **Expected:** User removed from table
- [ ] Try logging in as deletetest
- [ ] **Expected:** "Invalid credentials"

---

### Mobile Responsive Tests

#### Test 25: Mobile View - Login
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (mobile view)
- [ ] Test login screen
- [ ] **Expected:** Responsive layout, readable text

#### Test 26: Mobile View - Game Screen
- [ ] Login as player
- [ ] Check game screen on mobile view
- [ ] **Expected:** All elements visible and usable
- [ ] **Expected:** Scan button easily tappable

#### Test 27: Mobile View - Admin Panel
- [ ] Login as admin on mobile view
- [ ] **Expected:** Table scrolls horizontally if needed
- [ ] **Expected:** All buttons accessible

---

### QR Code Tests

#### Test 28: QR Code Generation
- [ ] Run: `npm run generate-qr`
- [ ] **Expected:** `qr-codes/` folder created
- [ ] **Expected:** 12 PNG files created
- [ ] **Expected:** `QR_Codes_Print_Sheet.html` created

#### Test 29: QR Code Print Sheet
- [ ] Open `qr-codes/QR_Codes_Print_Sheet.html`
- [ ] **Expected:** All 12 QR codes displayed
- [ ] **Expected:** Each shows level, location, and code
- [ ] **Expected:** Print button works

#### Test 30: Physical QR Scanning (if camera available)
- [ ] Print one QR code
- [ ] Open scanner on mobile device
- [ ] Scan printed QR code
- [ ] **Expected:** Code detected and submitted
- [ ] **Expected:** Progress advances

---

### Error Handling Tests

#### Test 31: Network Error Simulation
- [ ] Stop the server
- [ ] Try any action in the app
- [ ] **Expected:** Error message displayed
- [ ] Restart server
- [ ] **Expected:** App recovers

#### Test 32: Invalid Token
- [ ] Login successfully
- [ ] Open DevTools → Application → Local Storage
- [ ] Modify or delete token
- [ ] Refresh page
- [ ] **Expected:** Redirected to login

#### Test 33: Concurrent Users
- [ ] Open app in 2 different browsers
- [ ] Login as different users in each
- [ ] Play simultaneously
- [ ] **Expected:** Both work independently
- [ ] **Expected:** Admin sees both progressing

---

### Performance Tests

#### Test 34: Load Time
- [ ] Clear cache
- [ ] Load application
- [ ] **Expected:** Loads in < 3 seconds

#### Test 35: Timer Accuracy
- [ ] Start game
- [ ] Wait exactly 60 seconds (use stopwatch)
- [ ] **Expected:** Timer shows 00:01:00 (±1 second)

#### Test 36: Multiple API Calls
- [ ] Rapidly click scan button and close
- [ ] **Expected:** No crashes or errors
- [ ] **Expected:** Smooth operation

---

### Security Tests

#### Test 37: Protected Routes
- [ ] Without logging in, try accessing:
  - `http://localhost:3000/api/game/clue`
  - `http://localhost:3000/api/admin/users`
- [ ] **Expected:** 401 Unauthorized error

#### Test 38: Admin-Only Routes
- [ ] Login as regular player
- [ ] Try accessing admin endpoints (via DevTools/Postman)
- [ ] **Expected:** 403 Forbidden error

#### Test 39: Password Security
- [ ] Create user with password
- [ ] Check database (if accessible)
- [ ] **Expected:** Password is hashed, not plain text

---

## 🎯 Acceptance Criteria

All tests must pass before deployment:

- [ ] All authentication tests pass
- [ ] All admin panel tests pass
- [ ] All player game tests pass
- [ ] All mobile responsive tests pass
- [ ] All QR code tests pass
- [ ] All error handling tests pass
- [ ] All security tests pass

---

## 🐛 Bug Reporting Template

If you find a bug:

```
**Bug Description:**
[Clear description of the issue]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- Browser: 
- Device: 
- OS: 

**Screenshots:**
[If applicable]
```

---

## ✅ Test Results Log

Date: ___________
Tester: ___________

| Test # | Test Name | Pass/Fail | Notes |
|--------|-----------|-----------|-------|
| 1 | Admin Login | ☐ | |
| 2 | Invalid Login | ☐ | |
| ... | ... | ☐ | |

---

**Happy Testing! 🧪✨**

