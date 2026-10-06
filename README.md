# Support Ticket Management System

A local support desk used as a training codebase. Participants study the architecture, module boundaries, and vertical slices. It is intentionally smaller than a production help desk.

## Stack

- Next.js 16 (App Router) and React 19
- TypeScript
- Prisma 6 with SQLite
- Zod for validation
- bcryptjs password hashes and a signed httpOnly session cookie (`jose`)
- Vitest

Styling is one stylesheet in `src/app/globals.css`. No external font or hosted service is required.

## Prerequisites

- Node.js 20.9 or newer
- npm

## Setup

```bash
npm install
cp .env.example .env
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`.env` is loaded by Next.js and the Prisma CLI. `DATABASE_URL` points at `prisma/dev.db`. `SESSION_SECRET` signs the session cookie and must be at least 32 characters.

Prisma prints a notice that `package.json#prisma` will move to a Prisma config file in Prisma 7. The seed command stays in `package.json` so Prisma continues to load `.env` automatically.

## Database

```bash
npm run db:deploy    # apply committed migrations
npm run db:seed      # replace rows with the fictional sample data
npm run db:reset     # drop, migrate, and seed
npm run db:migrate   # create a new migration while developing
```

The migration already in `prisma/migrations` is the one `db:deploy` applies. `dev.db` is gitignored.

## Commands

```bash
npm run dev        # development server
npm run build      # production build
npm start          # serve the production build
npm test           # unit tests and one database workflow
npm run lint       # eslint
npm run typecheck  # route types and tsc --noEmit
```

Tests use a separate SQLite file, `prisma/test.db`. They do not write to `dev.db`.

## Sample accounts

Password for every seeded account: `password123`

| Email | Name | Role |
| --- | --- | --- |
| `user@example.com` | Alex Rivera | Customer (`USER`) |
| `agent@example.com` | Jordan Lee | Agent (`AGENT`) |
| `sam@example.com` | Sam Patel | Customer (`USER`) |

Registration always creates a customer. Agent accounts come from the seed.

Sam's ticket is there so an agent can see a ticket Alex cannot open.

## Directory guide

```text
src/app/                 routes and the global stylesheet
src/components/          shared screens: header, forms, badges
src/modules/auth/        passwords, session, register, sign-in
src/modules/tickets/     ticket rules, validation, queries, actions
src/modules/comments/    comment rules and writes
src/modules/shared/      Prisma client, errors, form state
prisma/                  schema, migrations, seed
tests/                   rule tests and one workflow test
docs/decisions/          architecture decision records
docs/modules/            module-level context
```

Pages load data and render. Server Actions validate input, call a feature service, and redirect. Permission rules live in `rules.ts` files and do not import Next.js, so tests can call them directly.

## Intentionally not included

Agents can claim an unassigned ticket for themselves. They cannot assign a different agent, remove an assignment, or filter the list by assignee. Status only moves `OPEN → IN_PROGRESS → RESOLVED`. There is no reopen, notification, attachment, rich text, or live update.

Those assignment gaps are left for a later lab. See [ARCHITECTURE.md](ARCHITECTURE.md) for how the current modules fit together.
