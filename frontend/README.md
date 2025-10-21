# Caregiver Shift Tracker – Frontend

Responsive caregiver-facing web app built with React 19, TypeScript, Tailwind CSS, and DaisyUI. The interface mirrors the provided Figma designs across mobile and desktop breakpoints and integrates with the Go backend implemented in this project.

## Tech Stack

- **React + Vite + TypeScript**
- **Tailwind CSS 3 + DaisyUI** for the design system
- **React Router 7** for routing
- **React Query 5** for server-state management & caching
- **Axios** for API calls
- **React Hot Toast** for feedback messages

## Project Structure

```
frontend/
  src/
    api/           # Axios client + endpoint helpers
    components/    # Re-usable UI building blocks
    context/       # Auth/session context
    hooks/         # Custom hooks (geolocation, data hooks)
    pages/         # Route-level screens
    routes/        # Router configuration
    utils/         # Formatting helpers
    types/         # Shared TypeScript interfaces
```

## Prerequisites

- Node.js 20 (or 18+) and npm
- Backend API running locally on `http://localhost:8080` (see [`../backend/README.md`](../backend/README.md))

## Quick start

```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Configure environment variables (creates frontend/.env)
cp .env.example .env
# Adjust values if your backend runs on a different host/port.

# 3. Run the app (opens http://localhost:5173)
npm run dev
```

For a production build:

```bash
npm run build
npm run preview   # optional: serve the built app locally
```

## Key Features

- **Dashboard** with daily metrics, active visit callout, and schedule cards matching Figma styling.
- **Schedule detail** view that shows client contact info, tasks, and clock-in controls with geolocation + manual fallback.
- **Progress/Clock-out** flow for managing task outcomes, adding ad-hoc tasks, and capturing clock-out geolocation.
- **Global session context** handles client credentials login, caches the caregiver profile, and injects tokens for API requests.
- **Reusable components** (`StatCard`, `ScheduleCard`, `StatusBadge`, etc.) to keep the codebase modular and maintainable.
- **Responsive layout** with desktop header and mobile bottom navigation implemented via DaisyUI.

## Geolocation Fallback

The app attempts to grab device coordinates automatically. If access is denied or unavailable, the UI surfaces manual latitude/longitude inputs before submitting clock-in/out events, meeting the assignment requirement.

## Testing & Linting

- `npm run build` – Type-checks and builds the app (tsc + Vite).
- `npm run lint` – ESLint (optional stricter rules can be enabled later).

Feel free to adjust the environment values for deployed environments (e.g. pointing to a hosted backend). EOF
