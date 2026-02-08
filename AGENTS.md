# PolliNature - Project Context

PolliNature is a community-driven initiative to encourage and map nature restoration actions in gardens and backyards in Coimbra, Portugal.

## Tech Stack
- **Frontend**: React 19, TypeScript, Rsbuild.
- **Styling**: Tailwind CSS v4 (Emerald/Amber theme).
- **Maps**: Leaflet + React-Leaflet + Leaflet-Geoman (for drawing polygons) + Turf.js (for area calculation).
- **Backend & Auth**: Supabase (PostgreSQL + PostGIS).
- **Icons**: Lucide React.
- **Deployment**: GitHub Pages (using a `gh-pages` branch and GitHub Actions).

## Architecture & Key Files
- `src/App.tsx`: Main router and Layout. Uses a `basename` for GitHub Pages compatibility.
- `src/lib/supabase.ts`: Supabase client initialization. Uses `PUBLIC_` environment variables.
- `src/lib/AuthContext.tsx`: React Context provider for user session management.
- `src/components/Map/InteractiveMap.tsx`: The core mapping component using Leaflet-Geoman for polygon drawing.
- `src/pages/MapPage.tsx`: The registration interface (Sidebar + Map).
- `src/pages/Explore.tsx`: Public dashboard showing approved sites and total restored area stats.
- `src/pages/AdminPage.tsx`: Validation dashboard for admins to approve/reject pending sites.

## Database Schema (Supabase)
Table: `sites`
- `id`: uuid (PK)
- `name`: text
- `site_type`: text (garden, park, backyard, school, other)
- `location`: geometry(Polygon, 4326) - Requires **PostGIS** extension.
- `area_sqm`: float8 (calculated area)
- `status`: text (pending, approved, rejected) - Controls public visibility.
- `user_id`: uuid (FK to auth.users)

## Deployment & CI/CD
- **GitHub Actions**: Configured in `.github/workflows/deploy.yml`.
- **Secrets**: Requires `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` to be set in GitHub Repository Secrets.
- **SPA Routing**: The workflow creates a `404.html` (copy of `index.html`) to support client-side routing on GitHub Pages.

## Visual Identity
Inspired by `pollinet.pt` and `pollinators.ie`.
- **Primary Color**: Emerald (#10b981)
- **Secondary Color**: Amber (#f59e0b)
- **Typography**: Outfit (Headers) & Inter (Body).
