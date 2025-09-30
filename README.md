# TuringTech Frontend Test – Next.js + Tailwind + Ant Design

This is a minimal, production-ready frontend that fulfills the core requirements using Next.js, Tailwind CSS (v4), and Ant Design.

## Features Implemented

- Login page with mocked authentication (stores `FAKE_TOKEN` in `localStorage`).
- Paginated call list (10/page) with Ant Design table and filter dropdown (missed, answered, voicemail, archived).
- Call details page with notes and archive/unarchive.
- Mocked realtime updates: a random call is toggled archived or receives a note every few seconds.

## Structure

- `src/pages/login.jsx` – mock login (AntD Form).
- `src/pages/index.jsx` – call list with filter + pagination.
- `src/pages/call/[id].jsx` – call details with notes.
- `src/components/` – `CallTable`, `FilterBar`, `Pager`.
- `src/lib/api.js` – mocked API (`fetchCalls`, `fetchCallById`, `archiveCall`, `addNote`) and realtime simulation.
- `src/styles/globals.css` – Tailwind v4 import and tokens.

## Mock Authentication

- `mockLogin()` sets `localStorage.token = "FAKE_TOKEN"`.
- No backend is required; adjust `src/lib/api.js` to integrate the real REST API when available.

## Replace With Real API Later

- Swap mocked functions in `src/lib/api.js` with real `fetch` calls to:
  - `GET /calls?offset&limit`
  - `GET /calls/:id`
  - `PUT /calls/:id/archive`
  - `POST /calls/:id/note`
- Keep signatures to avoid refactors. Add `Authorization: Bearer <token>` headers after real login.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.
