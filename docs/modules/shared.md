# Shared

## Purpose

Shared owns the few mechanisms every feature uses, and nothing about tickets or comments specifically.

## Responsibilities

- One Prisma client
- `DomainError` for expected failures
- The form-state shape returned by Server Actions
- Date formatting and the notice codes used after a rejected ticket action

## Important files

- `src/modules/shared/db.ts`
- `src/modules/shared/errors.ts`
- `src/modules/shared/action-state.ts`
- `src/modules/shared/notices.ts`
- `src/modules/shared/format.ts`

## Data / state ownership

No table of its own. It opens the SQLite database the feature services write.

## Interfaces

Features import `prisma`, `DomainError`, and `fieldErrorsFromZod`. UI imports `formatDateTime` and `readNotice`.

## Dependencies

`@prisma/client` and Zod. It does not import auth, tickets, or comments.

## Important rules

- New database queries belong in a feature service, not in a page and not in a new client.
- `DomainError` is for a rule the user can hit. Unexpected failures still throw.

## Verification

There is no shared-only test. The workflow test uses this client against `prisma/test.db`.
