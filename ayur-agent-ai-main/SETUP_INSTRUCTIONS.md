# 🚀 AyurAgent - Setup & Run Instructions

## ✅ Code Status
**All checks passed!** No TypeScript errors, all dependencies installed, dev server running successfully.

---

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A modern web browser (Chrome, Firefox, Edge, etc.)

---

## 🛠️ Step-by-Step Setup

### Step 1: Navigate to Project Directory
```bash
cd e:\AYURAGENT\ayur-agent-ai-prime\ayur-agent-ai-main
```

### Step 2: Install Dependencies (If Not Already Installed)
```bash
npm install
```
✅ **Status**: Dependencies are already installed in your project!

### Step 3: Verify Environment Variables
Your `.env` file is already configured with:
- ✅ Supabase credentials
- ✅ Gemini API key (hardcoded in source files)

**No action needed** - everything is ready!

---

## 🚀 Running the Application

### Option 1: Development Mode (Recommended)
```bash
npm run dev
```

**What happens:**
- Vite dev server starts
- Hot Module Replacement (HMR) enabled - changes reflect instantly
- Default URL: `http://localhost:8080`
- If port 8080 is busy, Vite auto-switches to 8081, 8082, etc.

**Expected output:**
```
VITE v7.1.12  ready in 468 ms

➜  Local:   http://localhost:8081/
➜  Network: http://192.168.188.221:8081/
```

### Option 2: Production Build
```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

### Option 3: Run Linter (Check Code Quality)
```bash
npm run lint
```

---

## 🌐 Accessing the Application

Once the dev server is running:

1. **Open your browser**
2. **Navigate to**: `http://localhost:8081/` (or the port shown in terminal)
3. **You should see**: AyurAgent landing page

### Available Routes:
- `/` - Landing page
- `/auth` - Authentication page
- `/dashboard/home` - Main dashboard
- `/dashboard/chat` - AI chat interface
- `/dashboard/constitution` - Prakriti quiz
- `/dashboard/plans` - Wellness plans
- `/dashboard/doctor-panel` - Doctor dashboard
- `/dashboard/food-database` - Food database
- And more!

---

## 🐛 Troubleshooting

### Issue: Port already in use
**Solution**: Vite will automatically use the next available port (8081, 8082, etc.)

### Issue: Module not found errors
**Solution**: 
```bash
# Delete node_modules and reinstall
rmdir /s /q node_modules
npm install
```

### Issue: Supabase connection errors
**Solution**: The app works without Supabase! Auth features may not work, but core functionality (chat, dosha analysis, task tracking) is fully operational.

### Issue: Gemini API errors
**Solution**: The API key is hardcoded in:
- `src/lib/gemini.ts`
- `src/main.py` (Flask backend - optional)

If you hit rate limits, you can replace with your own key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### Issue: Browser console errors
**Common warnings (safe to ignore)**:
- React Router warnings about routes
- Supabase auth warnings (if not using auth)
- LocalStorage access warnings

---

## 🎯 Key Features to Test

### 1. **Prakriti Assessment** (`/dashboard/constitution`)
- 15-question dosha quiz
- Calculates Vata/Pitta/Kapha constitution
- Generates personalized recommendations

### 2. **AI Chat Interface** (`/dashboard/chat`)
- Interactive chat with Ayurvedic AI doctor
- Context-aware conversations
- Adds recommendations to task list

### 3. **Task Manager** (`/dashboard/home`)
- Default Ayurvedic tasks (Abhyanga, Yoga, etc.)
- Points system for gamification
- Streak tracking

### 4. **Doctor Dashboard** (`/dashboard/doctor-panel`)
- Patient management
- Treatment plan creation
- Sample data available (click "Load Sample Data")

### 5. **Food Database** (`/dashboard/food-database`)
- 500+ Ayurvedic foods
- Dosha-specific recommendations
- Nutritional information

---

## 📱 Mobile Testing

The app is mobile-responsive! Test on mobile by:
1. Find your network URL in terminal output (e.g., `http://192.168.188.221:8081/`)
2. Open on your phone (must be on same WiFi network)
3. Test all features on mobile view

---

## 🔧 Development Tips

### Hot Reload
Changes to `.tsx`, `.ts`, `.css` files auto-reload in browser!

### Key Directories:
- `src/components/` - All React components
- `src/pages/` - Page components (Index, AuthPage, etc.)
- `src/contexts/` - AppContext for global state
- `src/lib/` - Utility libraries (Gemini integration, etc.)
- `src/hooks/` - Custom React hooks
- `src/data/` - Static data (food database, etc.)

### Adding New Features:
1. Create component in `src/components/`
2. Add route in `src/pages/Index.tsx` (ABOVE catch-all route)
3. Update navigation in `src/components/Navigation.tsx`
4. Add to AppContext if global state needed

---

## 🎨 Theming

Toggle between light/dark themes:
- Click theme toggle button in navigation
- Themes persist in localStorage
- Dosha-specific color schemes (Vata-purple, Pitta-golden, Kapha-green)

---

## 💾 Data Persistence

All user data is stored in **browser localStorage**:
- `ayuragent-state` - Main app state
- `ayuragent-chat-v1` - Chat history (simple interface)
- `ayuragent-chat-interactive-v1` - Interactive chat history
- `ayuragent-custom-tasks` - User-created tasks

**To reset all data**: Use the "Reset" button in dashboard or clear browser data.

---

## 🚀 Next Steps for SIH 2025

Your app is **fully functional**! Here are improvement areas:

### High Priority:
1. ✅ Enhanced nutrient analysis (PS 25024 requirement)
2. ✅ Practice management features for dietitians
3. ✅ Better food recommendations based on dosha
4. ✅ Export functionality (PDF reports, meal plans)

### Medium Priority:
- Multi-language support (Hindi, Tamil, etc.)
- WhatsApp/Telegram integration for reminders
- Voice input for elderly users
- Offline mode with PWA

### Low Priority:
- Advanced analytics dashboard
- Integration with wearable devices
- Telemedicine video consultation

---

## 📞 Support

If you encounter any issues:
1. Check browser console for errors (F12)
2. Verify terminal shows "ready" status
3. Clear browser cache and localStorage
4. Restart dev server (`Ctrl+C` then `npm run dev`)

---

**🎉 Congratulations! Your AyurAgent app is ready for development and SIH 2025 demo!**

**Current Status**: ✅ Running on `http://localhost:8081/`

---

*Built for Smart India Hackathon 2025 - Problem Statement 25024*
*Comprehensive Cloud-Based Practice Management & Nutrient Analysis Software for Ayurvedic Dietitians*
