# ADR-003 — Module organisation

## Status

Accepted

## Context

Participants need to point at a boundary and say what it owns. The app is too small for packages, services, or a layered framework, and too large to keep every rule inside a page.

## Decision

Group code by feature under `src/modules`:

- `auth`
- `tickets`
- `comments`
- `shared`

Each feature keeps its Zod schema, pure rules, Prisma service, and Server Actions together. `src/app` holds routes. `src/components` holds UI that more than one route renders.

Comments may import ticket access rules. Tickets do not import comments. A ticket detail page calls both services and renders the result.

## Consequences

- A change to status rules starts in `src/modules/tickets/rules.ts` and the ticket service, then the detail controls, then the tests.
- A change to comment visibility starts in `src/modules/comments` and does not require a ticket rewrite unless access itself changes.
- There is no dependency-injection container. Services import the shared Prisma client directly.
