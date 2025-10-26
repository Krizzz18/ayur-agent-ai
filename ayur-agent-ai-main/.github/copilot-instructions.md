# AyurAgent AI Copilot Instructions

## Project Overview
**AyurAgent** is an AI-powered Ayurvedic wellness platform built with React + TypeScript (Vite) for **Smart India Hackathon 2025** - Problem Statement **25024** (Comprehensive Cloud-Based Practice Management & Nutrient Analysis Software for Ayurvedic Dietitians). Features multi-agent chatbot for personalized dosha analysis, task tracking, and doctor-patient management. Built with Lovable, then migrated to local development.

## Architecture & Key Patterns

### Frontend (React SPA)
- **Router**: React Router v6 with routes in `src/App.tsx` (`/`, `/dashboard/*`, `/auth`)
- **State Management**: Context API via `src/contexts/AppContext.tsx` (handles user profile, tasks, patients, treatment plans)
  - All state auto-saves to `localStorage` with debounced writes (500ms)
  - Version migration logic for backward compatibility (v2 format)
- **UI Components**: shadcn/ui components in `src/components/ui/` with Radix primitives
- **Styling**: Tailwind CSS with dosha-specific color scheme (Vata-purple, Pitta-golden, Kapha-green)
- **Path Aliases**: `@/*` maps to `src/*` (see `tsconfig.json`)

### AI Integration
- **Primary**: Google Gemini AI via `@google/generative-ai` SDK in `src/lib/gemini.ts`
  - Default model: `gemini-2.5-flash` (originally planned to train custom Ayurvedic model, using Gemini as pragmatic solution)
  - System instruction configures agent as "expert Ayurvedic doctor with 15+ years experience"
  - API key hardcoded in source (see security note below)
- **Optional Backend**: Flask API (`src/main.py`) for server-side Gemini calls (CORS-enabled)
  - Endpoint: `POST /api/chat` with `{ message: string }` body
  - Run with `python src/main.py` (requires `flask`, `flask-cors`, `google-generativeai`)
  - Note: Frontend-only mode is primary; backend is experimental

### Data Models
- **Task**: `{ id, title, description, category, frequency, points, completed, dateAdded, source }` (AppContext)
- **Patient**: `{ id, name, age, gender, contact, email, prakriti, goals, restrictions, joinedDate }` (doctor dashboard)
- **TreatmentPlan**: `{ patientId, patientName, createdDate, diet, lifestyle, herbs, followUp }` (doctor dashboard)
- Default tasks in `AppContext.tsx` include Morning Abhyanga, Lemon Water, Yoga, Ashwagandha, Meditation

## Developer Workflows

### Dev/Build Commands
```bash
npm run dev        # Start dev server (Vite, default http://localhost:8080)
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint check
```

### Key Files to Modify
- **Add routes**: `src/App.tsx` (insert ABOVE the catch-all `*` route)
- **Global state**: `src/contexts/AppContext.tsx` (add properties to `AppState`, update `getDefaultState()`)
- **New components**: `src/components/` (follow PascalCase naming)
- **API integration**: `src/lib/gemini.ts` (modify system instruction or model)

### Testing Dosha Analysis
- Quiz flow: `src/components/PrakritiquizComponent.tsx` (15 questions → dosha calculation)
- Chat interface: `src/components/InteractiveChatInterface.tsx` (uses Gemini with memory)
- Sample patients available via "Load Sample Data" button in doctor dashboard

## Project-Specific Conventions

1. **TypeScript Strictness**: Disabled in `tsconfig.json` (`noImplicitAny: false`, `strictNullChecks: false`)
   - Use loose typing; avoid strict null checks
2. **Task Sources**: Track origin in `source` field (`'Default'`, `'AI Chatbot'`, `'Custom'`)
3. **Dosha Names**: Always use capitalized `"Vata"`, `"Pitta"`, `"Kapha"` (or combinations like `"Vata-Pitta"`)
4. **Points System**: Morning Abhyanga (20pts), Yoga (25pts), Meditation (30pts), etc.
5. **LocalStorage Keys**:
   - `ayuragent-state` (main app state)
   - `ayuragent-chat-v1` (chat history)
   - `ayuragent-chat-interactive-v1` (interactive chat)
   - `ayuragent-custom-tasks` (user-added tasks)

## Critical Integration Points

- **Gemini API**: Direct browser calls (no proxy by default); fallback API key in source
- **Supabase**: Integrated and configured (see `src/integrations/supabase/`) - backend ready but features still in development
- **Food Database**: `src/data/comprehensive_food_database.json` (extensive Ayurvedic food data for PS 25024 nutrient analysis)
- **Python ML Models**: Scikit-learn models in `src/models/` (`.joblib` files for dosha prediction)
  - Part of original custom model plan; app currently uses JS-based logic + Gemini

## Important Development Guidelines

⚠️ **CRITICAL RULES**:
1. **NO GitHub pushes** without explicit approval
2. **NO Vercel deployments** without explicit approval  
3. **NO deletions** of code/files without explicit approval
4. **ASK if unclear** - this is a competition project with blood & sweat invested

**Security Note**: Gemini API key is hardcoded in `src/lib/gemini.ts` and `src/main.py`. For production deployment, migrate to environment variables (`VITE_GEMINI_API_KEY` in `.env`).

## Component Highlights
- **DashboardHome**: Main user dashboard with task list, streak tracking, circular progress
- **DoctorDashboard**: Patient management, treatment plan creation, sample data loading
- **ChatInterface** / **InteractiveChatInterface**: Two chat implementations (simple vs. memory-aware)
- **ConstitutionAssessment**: 15-question Prakriti quiz with dosha calculation
- **TaskManager**: Instagram-like story cards for daily tasks

## Additional Resources
- README.md: Full hackathon context, demo flows, business model
- UI Components: All shadcn/ui components in `src/components/ui/`
- Hooks: `useAuth.tsx`, `useTheme.tsx`, `useConversationMemory.tsx`, `usePDFExport.tsx`
