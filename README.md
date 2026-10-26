# proDashboard

A hotel management dashboard: cabins, guests, bookings, check-in and check-out,
with a live activity feed. React on the front, a small NestJS API behind it.

![React](https://img.shields.io/badge/React-19-61dafb)
![NestJS](https://img.shields.io/badge/NestJS-11-e0234e)
![Prisma](https://img.shields.io/badge/Prisma-6-2d3748)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## Run it with Docker

The quickest way to see it working — nothing to install but Docker:

```bash
docker compose up --build
```

Then open **http://localhost:8080** and log in:

```
admin@prodashboard.local
password1234
```

The API comes up on port 3000. On first boot it creates its database and seeds
it with 8 cabins, 20 guests and two dozen bookings spread across the past,
today and the future, so every screen has something to show. Restarting keeps
whatever you changed — the database and uploaded images live in named volumes.

`docker compose down -v` removes those volumes and starts over from the seed.

## Run it for development

```bash
npm install
npm run setup   # installs the API's dependencies, creates and seeds the database
npm run dev     # Vite on 5173 and the API on 3000, together
```

`npm run dev:web` and `npm run dev:api` run one half at a time.

## What's in it

**Dashboard** — bookings, sales, check-ins and occupancy for the last 7, 30 or
90 days, with a sales chart, a stay-duration breakdown and today's arrivals and
departures.

**Bookings** — filter by status, sort by date or amount, paginated. Create a
booking with a cabin and date picker that checks availability and refuses to
double-book, prices the stay from the cabin's rate and the breakfast setting,
and validates against the configured minimum and maximum stay.

**Check-in / check-out** — confirm payment, optionally add breakfast, move a
booking through unconfirmed → checked-in → checked-out.

**Cabins** — full CRUD with photo upload, discounts, and duplicate.

**Guests** — searchable and paginated, with a detail page showing stay history,
nights stayed and money taken.

**Settings** — booking rules, breakfast price, arrival and departure times,
cancellation policy, currency and locale (which reformat every price in the
app), tax rate, and the hotel's name and logo.

**Activity feed** — a bell in the header that fills in as bookings are created,
guests check in or out, and payments land. Driven by server-sent events, so two
open tabs stay in step.

Plus dark mode, and password reset.

## Architecture

```
proDashboard/
├── src/                  React 19 + Vite + styled-components
│   ├── features/         one folder per domain: bookings, cabins, guests, …
│   ├── services/         the API client; nothing else talks to the network
│   └── ui/               presentational components
├── server/               NestJS 11 + Prisma
│   ├── prisma/           schema and seed
│   └── src/              one module per resource
├── docker-compose.yml
└── nginx.conf            static serving + SPA fallback
```

TanStack Query owns server state and caching; React Hook Form owns the forms;
Recharts draws the dashboard. The API uses SQLite through Prisma, JWT auth with
bcrypt, local disk for uploads, and SSE for the activity feed.
[server/README.md](server/README.md) lists every endpoint.

Switching to Postgres is a change to `provider` and `DATABASE_URL` in
`server/prisma/schema.prisma`.

## Configuration

The client reads one variable, at **build** time:

| Variable       | Default                 | Notes                        |
| -------------- | ----------------------- | ---------------------------- |
| `VITE_API_URL` | `http://localhost:3000` | Where the browser finds the API |

Vite inlines it into the bundle, so hosting the API elsewhere means rebuilding
(or passing `--build-arg VITE_API_URL=…`), not just restarting.

The API's variables are in [server/.env.example](server/.env.example), and
docker-compose sets them for you.

## Before deploying this anywhere public

It is a demo, and two things are deliberately simple:

- **`JWT_SECRET` in `docker-compose.yml` is a placeholder.** Replace it.
- **Password reset has no mailer.** `/auth/forgot-password` writes the reset
  link to the server log instead of sending it.

Creating an account requires being signed in already — the seed makes the first
one. Remove the guard on `AuthController.signup` if you want open registration.
