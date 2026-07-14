# Foosha — Mandaue City Food Assistance Network

A functional (frontend-only, for now) web app connecting food/cash donors with recipient families in Mandaue City, matched and verified by the city government through a one-time-code pickup confirmation system.

This started as static HTML mockups and is now a real React app with working navigation, forms, and state — but **no database yet on purpose**. It's built so a database is a drop-in later, not a rewrite. See [Connecting a real database](#connecting-a-real-database-later) below.

## Running it locally

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). You'll land on the marketing page — click **Get the app** to pick a role (donor / recipient / admin) and explore.

To switch roles later, click your profile card at the bottom of the sidebar — it logs you out back to the role picker.

## How data works right now

There's no backend. Instead:

- **`src/data/seed.ts`** — sample data (donations, requests, tickets, profiles) matching the original mockups.
- **`src/data/localStore.ts`** — a tiny localStorage-backed "table" system. Each collection (donations, requests, etc.) persists in your browser so changes survive a refresh.
- **`src/data/api.ts`** — the function every page actually calls (`listDonations()`, `createDonation()`, `confirmPickup()`, etc.). Right now these read/write through `localStore`. **This is the only file that needs to change when a real database is connected.**

Pages never touch `localStore` or `seed.ts` directly — only `api.ts`. That boundary is what makes the future swap contained.

To wipe your local test data and start fresh, open your browser's dev tools → Application/Storage → clear localStorage for this site (or just use a private/incognito window).

## Project structure

```
src/
├── data/
│   ├── types.ts        → shared TypeScript types for every data model
│   ├── seed.ts          → sample data
│   ├── localStore.ts    → localStorage mock "database"
│   └── api.ts            → the data layer every page calls — swap this later
├── context/
│   └── AuthContext.tsx  → mock role-based "auth" (no real login yet)
├── layouts/               → sidebar + outlet shell for each role
├── components/            → shared UI: Sidebar, StatCard, StatusChip, TicketStub...
├── pages/
│   ├── public/            → landing page, role picker
│   ├── donor/              → dashboard, new donation, history, badges
│   ├── recipient/          → home, request help, browse, confirm pickup, history
│   └── admin/               → overview, matching queue, records, reports, verification, analytics
└── styles/
    └── global.css          → all design tokens & component styles in one file
```

## Connecting a real database (later)

When you're ready — Supabase is a natural fit since it's already your stack from Balance Hub:

1. `npm install @supabase/supabase-js`
2. Create a Supabase project, add tables matching the shapes in `src/data/types.ts` (`donations`, `requests`, `tickets`, `donor_profiles`, `recipient_profiles`, etc.)
3. Copy `.env.example` to `.env.local` and fill in your project URL and anon key
4. Create `src/data/supabaseClient.ts` with the Supabase client setup
5. Rewrite the **insides** of each function in `src/data/api.ts` to query Supabase instead of `localStore` — for example:

   ```ts
   // before
   export async function listDonations() {
     return localStore.get("donations", DONATIONS);
   }

   // after
   export async function listDonations() {
     const { data, error } = await supabase.from("donations").select("*");
     if (error) throw error;
     return data as Donation[];
   }
   ```

6. Replace the mock role logic in `src/context/AuthContext.tsx` with real Supabase Auth (`supabase.auth.signInWithPassword`, etc.)

No page components need to change — they only ever imported from `api.ts`.

## Deploying to GitHub Pages

A GitHub Actions workflow is already set up at `.github/workflows/deploy.yml`. Once this repo is pushed to GitHub:

1. Repo → **Settings → Pages → Source** → select **GitHub Actions**
2. Push to `main` — the workflow builds and deploys automatically
3. Your site appears at `https://<username>.github.io/<repo-name>/`

The app uses hash-based routing (`/#/donor/history`) specifically so it works correctly on GitHub Pages' static hosting without extra rewrite configuration — direct links and refreshes won't 404.

## Design system

Colors, type scale, and component specs are documented in `docs/design-tokens.md` (carried over from the original mockups) if you want a Figma-side reference alongside this code.
