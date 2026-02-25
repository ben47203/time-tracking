# Time Tracking App

## Tech Stack
- React 19 + Vite 7.3 + TypeScript 5.9
- Convex 1.32 backend (project: `keen-pika-968`)
- Convex Auth with Password provider
- React Router v7 for routing
- Recharts for charts
- Tailwind CSS v4

## Structure
- `convex/` — Backend schema, auth, queries/mutations
- `src/lib/` — Categories, time utilities, stats utilities
- `src/hooks/` — Custom hooks (drag-fill, shift-select, date nav)
- `src/components/` — Reusable UI (Layout, Legend, DatePicker, auth/, display/, log/)
- `src/pages/` — Route pages (Home, TimeTracking, Log)

## Conventions
- 288 blocks per day (5-minute intervals)
- Category codes 1-16, 0 = unset
- Date format: "YYYY-MM-DD" everywhere
- Display page is public, log page requires auth
- All chart/stats aggregation is client-side
