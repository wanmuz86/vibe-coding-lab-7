# ADR-002 — Authentication approach

## Status

Accepted

## Context

Participants need to see how a session becomes a role, and how that role allows or blocks an action. The app must run without a hosted identity provider. The permission model is two roles, not a general access-control system.

## Decision

Use email and password. bcryptjs stores the hash. A signed httpOnly cookie stores the user id only. `getCurrentUser` loads the name, email, and role from SQLite on each request.

Registration always creates `USER`. The agent account is inserted by the seed. Server Actions call `requireUser()` and the feature rules check the role.

Auth.js was not used. Its callbacks and adapter would hide the session path that this lab is meant to read.

## Consequences

- The whole sign-in path is visible in `src/modules/auth`.
- Changing a user's role in the database takes effect on the next request, because the cookie does not cache the role.
- There is no password reset, email verification, or enterprise single sign-on.
- The cookie is not marked `Secure`, so a local production server on `http://localhost` can keep the session. This repository is not a deployment setup.
