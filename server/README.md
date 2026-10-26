# proDashboard API

A small NestJS backend for the proDashboard React app, replacing Supabase.
SQLite via Prisma, JWT auth, local disk uploads, and server-sent events for the
activity feed.

## Getting started

From the repository root, once:

```bash
npm run setup   # installs API deps, creates dev.db, seeds it
```

Then start both halves together:

```bash
npm run dev     # Vite on 5173 + this API on 3000
```

`npm run dev:web` and `npm run dev:api` run one at a time if you'd rather have
them in separate terminals. The client talks to `http://localhost:3000` unless
`VITE_API_URL` says otherwise.

The equivalent from inside `server/`:

```bash
npm install
npm run prisma:push   # create dev.db from prisma/schema.prisma
npm run seed          # cabins, guests, bookings, settings and an admin login
npm run dev           # http://localhost:3000
```

The seed prints the login it creates:

```
admin@prodashboard.local / password1234
```

Override those with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`.

## Configuration

`.env` (see `.env.example`):

| Variable         | Default                 | Notes                                   |
| ---------------- | ----------------------- | --------------------------------------- |
| `DATABASE_URL`   | `file:./dev.db`         | Any Prisma connection string            |
| `JWT_SECRET`     | —                       | Required. Change it outside development |
| `JWT_EXPIRES_IN` | `7d`                    | Token lifetime                          |
| `PORT`           | `3000`                  |                                         |
| `CLIENT_ORIGIN`  | `http://localhost:5173` | Any localhost origin is allowed in dev  |
| `PUBLIC_URL`     | `http://localhost:PORT` | Prefix written into uploaded image URLs |

## Endpoints

Everything except login, signup and the two password-recovery routes requires
`Authorization: Bearer <token>`.

| Method | Path                             | Purpose                              |
| ------ | -------------------------------- | ------------------------------------ |
| POST   | `/auth/login`                    | Returns `{ user, session.token }`    |
| POST   | `/auth/signup`                   | Create a staff account (signed in)   |
| GET    | `/auth/me`                       | Current user                         |
| PATCH  | `/auth/me`                       | Name, password, avatar (multipart)   |
| POST   | `/auth/forgot-password`          | Issues a reset token                 |
| POST   | `/auth/reset-password`           | Consumes it, returns a new session   |
| GET    | `/cabins`                        | All cabins                           |
| POST   | `/cabins`                        | Create (multipart, `image` file)     |
| PATCH  | `/cabins/:id`                    | Update                               |
| DELETE | `/cabins/:id`                    | Delete                               |
| GET    | `/guests`                        | `?search=&sortBy=&page=` → `{data,count}` |
| GET    | `/guests/all`                    | Unpaginated, for pickers             |
| GET    | `/guests/:id`                    | One guest                            |
| POST   | `/guests`                        | Create                               |
| PATCH  | `/guests/:id`                    | Update                               |
| DELETE | `/guests/:id`                    | Refused while bookings reference it  |
| GET    | `/bookings`                      | `?status=&sortBy=&page=` → `{data,count}` |
| GET    | `/bookings/today-activity`       | Arrivals and departures today        |
| GET    | `/bookings/created-after?date=`  | Dashboard sales and stats            |
| GET    | `/bookings/stays-after?date=`    | Dashboard occupancy and durations    |
| GET    | `/bookings/cabin/:id/ranges`     | Availability for the booking form    |
| GET    | `/bookings/guest/:id`            | One guest's stay history             |
| GET    | `/bookings/:id`                  | One booking, cabin and guest included |
| POST   | `/bookings`                      | Create                               |
| PATCH  | `/bookings/:id`                  | Check in / out, payment, breakfast   |
| DELETE | `/bookings/:id`                  | Delete                               |
| GET    | `/settings`                      | The single settings row              |
| PATCH  | `/settings`                      | Update it                            |
| GET    | `/events?token=`                 | SSE stream of booking changes        |

## Notes and limitations

**Password reset has no mailer.** `/auth/forgot-password` writes a token and
logs the reset link to the server console. Wire up a real mail provider before
anyone else uses this. The endpoint answers the same way whether or not the
address exists, so it cannot be used to discover accounts.

**Signup is authenticated.** This is a staff tool, so creating an account needs
an existing login — the seed makes the first one. Drop the guard on
`AuthController.signup` if you want open registration.

**Email confirmation is gone.** Supabase offered it; this API does not, so the
"resend confirmation" UI was removed from the login and signup forms.

**SSE instead of Supabase Realtime.** `/events` pushes `booking.created`,
`booking.updated` and `booking.deleted`. Updates carry the previous row as well
as the new one, so the activity feed can tell a real status or payment change
from an unrelated edit. `EventSource` cannot send headers, so the JWT goes in
the query string.

**Uploads are local.** Images land in `server/uploads` and are served from
`/uploads/<file>`. Replacing an image does not delete the old file.

**Switching to Postgres** is a change to `provider` and `DATABASE_URL` in
`prisma/schema.prisma`, then `npx prisma migrate dev`. Nothing else assumes
SQLite — but note SQLite's `contains` filter is case-insensitive for ASCII
while Postgres's is not, so guest search will want `mode: 'insensitive'` there.
