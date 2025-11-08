# 🏆 Treasure Hunt Game

A mobile-friendly treasure hunt game with QR code scanning, real-time timer, and admin panel for user management.

## ✨ Features

### For Players:
- 🔐 Secure login with username/password
- 🗺️ 12 levels with unique clues and riddles
- 📷 QR code scanner (camera + manual input)
- ⏱️ Real-time timer tracking
- 🎯 Progress tracking with visual indicators
- 🏆 Completion screen with final time
- ❌ Wrong QR detection and feedback

### For Admins:
- 👥 Create and manage users
- 📊 View all users' progress and completion times
- 🔄 Reset user progress
- 🔒 Enable/disable user accounts
- 🗑️ Delete users

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account

### Installation

1. **Clone the repository**
```bash
cd Tresure_hunt
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/treasure-hunt
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

4. **Generate QR Codes**
```bash
npm run generate-qr
```

This will create:
- QR code images in `qr-codes/` folder
- A printable HTML page with all QR codes

5. **Start the server**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

6. **Access the application**
- Open browser: `http://localhost:3000`
- Admin login: `admin` / `admin123`

## 📱 Usage

### Setting Up the Game

1. **Generate and Print QR Codes**
   - Run `npm run generate-qr`
   - Open `qr-codes/QR_Codes_Print_Sheet.html`
   - Print or save as PDF
   - Cut out and place QR codes at locations

2. **Create Players**
   - Login as admin
   - Create users with usernames and passwords
   - Share credentials with players

3. **Start the Hunt**
   - Players login with their credentials
   - First clue appears automatically
   - Timer starts when they see the first clue
   - Players scan QR codes to progress

### Game Flow

1. Player logs in → First clue appears
2. Timer starts automatically
3. Player finds location and scans QR code
4. Next clue appears
5. Repeat until all 12 QR codes are scanned
6. Timer stops, completion screen shows final time

## 🗺️ Treasure Hunt Locations

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

## 🌐 Deployment

### Deploy to Vercel + Railway + MongoDB Atlas

#### 1. MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user
4. Whitelist all IPs (0.0.0.0/0) for development
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/treasure-hunt
   ```

#### 2. Deploy Backend to Railway

1. Create account at [Railway.app](https://railway.app)
2. Create new project
3. Deploy from GitHub or upload files
4. Add environment variables:
   ```
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-secret-key
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-admin-password
   NODE_ENV=production
   ```
5. Railway will auto-deploy and provide a URL

#### 3. Deploy Frontend to Vercel

1. Create account at [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: public
4. Add environment variables:
   ```
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-secret-key
   ```
5. Deploy!

**Note:** Update `API_URL` in `public/js/app.js` if deploying frontend and backend separately:
```javascript
const API_URL = 'https://your-railway-backend.railway.app/api';
```

### Alternative: Deploy Everything to Vercel

Vercel can host both frontend and backend:

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The `vercel.json` configuration is already set up.

## 🔧 Configuration

### Customizing Clues

Edit `config/clues.js` to change:
- Clue text
- Hints
- Location names
- QR codes

After editing, regenerate QR codes:
```bash
npm run generate-qr
```

### Changing Admin Credentials

Update `.env` file:
```env
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-password
```

## 📁 Project Structure

```
treasure-hunt/
├── config/
│   └── clues.js              # Game clues and locations
├── models/
│   └── User.js               # User database model
├── middleware/
│   └── auth.js               # Authentication middleware
├── public/
│   ├── css/
│   │   └── style.css         # Styles (no Tailwind)
│   ├── js/
│   │   └── app.js            # Frontend JavaScript
│   └── index.html            # Main HTML file
├── scripts/
│   └── generateQR.js         # QR code generator
├── qr-codes/                 # Generated QR codes (created after running script)
├── server.js                 # Express server
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Game
- `GET /api/game/clue` - Get current clue
- `POST /api/game/scan` - Submit scanned QR code

### Admin
- `POST /api/admin/users` - Create user
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `POST /api/admin/users/:id/reset` - Reset user progress
- `DELETE /api/admin/users/:id` - Delete user

## 🎨 Design Features

- ✅ No Tailwind CSS (vanilla CSS only)
- ✅ Mobile-first responsive design
- ✅ Beautiful gradient backgrounds
- ✅ Smooth animations
- ✅ Glass-morphism effects
- ✅ Dark theme optimized for mobile

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Protected API routes
- Admin-only endpoints
- Input validation

## 🐛 Troubleshooting

### Camera not working
- Ensure HTTPS is enabled (required for camera access)
- Check browser permissions
- Use manual QR input as fallback

### MongoDB connection failed
- Check connection string
- Verify network access in MongoDB Atlas
- Ensure IP whitelist includes your server

### QR codes not scanning
- Ensure good lighting
- Hold phone steady
- Try manual input option
- Verify QR code is not damaged

## 📝 License

MIT License - feel free to use for your events!

## 🤝 Support

For issues or questions, please create an issue in the repository.

---

**Made with ❤️ for treasure hunters everywhere!**

