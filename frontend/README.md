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

## Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` (see `.env.example`):
   ```ini
   VITE_API_URL=http://localhost:8080/api
   VITE_CLIENT_ID=caregiver-app
   VITE_CLIENT_SECRET=caregiver-secret
   VITE_DEFAULT_CAREGIVER_ID=c2d1bb61-8d67-4db5-9e59-4c2c16f7d4f2
   ```

3. Start the dev server (backend must be running on the configured base URL):
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
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
