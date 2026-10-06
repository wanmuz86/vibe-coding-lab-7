# ADR-001 — Database choice

## Status

Accepted

## Context

The training app must run on a laptop with no hosted database. Tickets, users, and comments need real relations so participants can see ownership and foreign keys.

## Decision

Use SQLite through Prisma 6. The database file is `prisma/dev.db`. Schema changes are committed as Prisma migrations. Tests use `prisma/test.db`.

Prisma 6 keeps the client as `new PrismaClient()` against a `DATABASE_URL`. Newer Prisma releases move SQLite behind a driver adapter and a separate config file. That extra machinery does not help this lab.

Role, status, priority, and comment visibility are Prisma enums. SQLite stores them as text. The same values are repeated in the feature rule modules so tests can run without importing the generated client.

## Consequences

- Setup is `prisma migrate deploy` and the seed script. No database server is installed.
- The file is local and gitignored. Each participant has their own data after seeding.
- The project stays on Prisma 6 until there is a reason to take on the newer client setup.
