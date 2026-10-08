# CareerPilot

CareerPilot is a React/Vite job-search command center prototype.

## Included phases

1. Project setup
2. Global layout/navigation
3. Dashboard
4. Application tracker (Kanban + List)
5. Add/Edit Application + shared state + toasts
6. Application Details
7. AI Job Description Analyzer (local demo engine)
8. Interview Preparation
9. Follow-ups
10. Analytics
11. LocalStorage persistence
12. Responsive/mobile experience
13. Defensive validation and production-minded UX checks
14. UI polish, profile/settings, export/reset

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Architecture

- `ApplicationsContext` is the single source of truth for application data.
- `ProfileContext` stores profile and preferences.
- `utils/storage.js` isolates browser persistence so a backend can replace it later.
- `utils/aiAnalyzer.js` is the replaceable local AI/demo engine.
- All pages use the same application objects, so changes propagate across Dashboard, Tracker, Details, Interview Prep, Follow-ups and Analytics.

## Prototype notes

The current AI analyzer is deterministic/rule-based and does not require an API key. The UI is intentionally structured so a real LLM endpoint can later return the same analysis shape.
