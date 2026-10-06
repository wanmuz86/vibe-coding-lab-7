# Auth

## Purpose

Auth owns identity: creating a customer account, checking a password, and resolving the current user.

## Responsibilities

- Register and sign in
- Password hashing
- The session cookie
- Loading the current user and redirecting anonymous requests to `/login`

## Important files

- `src/modules/auth/validation.ts` — register and login schemas
- `src/modules/auth/password.ts` — hash and verify
- `src/modules/auth/service.ts` — create a user and authenticate
- `src/modules/auth/session.ts` — sign, read, and clear the cookie
- `src/modules/auth/current-user.ts` — `getCurrentUser` and `requireUser`
- `src/modules/auth/actions.ts` — Server Actions used by the forms
- `src/app/(public)/login/page.tsx` and `register/page.tsx`

## Data / state ownership

The `User` row, including `passwordHash` and `role`. The cookie holds the user id, not the role.

## Interfaces

Other modules depend on `SessionUser` and `requireUser()`. They do not read the cookie themselves.

## Dependencies

`shared` Prisma client, bcryptjs, and jose. No ticket or comment imports.

## Important rules

- New registrations are `USER`.
- Failed sign-in returns one message and does not say whether the email exists.
- Password hashes are never selected into `SessionUser`.

## Verification

Sign-in and sign-out are exercised in the browser. Role behavior is covered through ticket and comment tests, because those rules consume `SessionUser`.
