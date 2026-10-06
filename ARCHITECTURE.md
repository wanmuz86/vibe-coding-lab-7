# Architecture

Support Desk is a single Next.js application. Pages render and collect input. Feature modules own the rules. Prisma is the only database access path.

```text
Browser / UI
     ↓
Next.js pages and Server Actions
     ↓
Application / domain logic
     ↓
Data access
     ↓
Prisma
     ↓
SQLite
```

Auth establishes who is calling. Tickets decide which rows that person may see or change. Comments reuse the ticket access rule, then add their own visibility rule.

```text
Auth
 ↓
Tickets
 ↓
Comments
```

Tickets do not import the comments module. Comments import ticket access rules. Both import the current user type from auth and the Prisma client from shared.

## Modules

| Module | Owns | Depends on | Used by |
| --- | --- | --- | --- |
| `auth` | Passwords, session cookie, register and sign-in | `shared` database | Pages, ticket actions, comment actions |
| `tickets` | Ticket records, status transitions, self-assignment, list scope | `auth` types, `shared` | Pages, comments |
| `comments` | Comment records and public/internal visibility | `tickets` access rules, `auth` types, `shared` | Ticket detail page |
| `shared` | Prisma client, domain errors, form-error shape | Prisma | Auth, tickets, comments |
| `app` and `components` | Rendering and forms | Feature actions and read models | The browser |

Route groups `(public)` and `(desk)` do not appear in the URL. `(desk)` requires a session. `(public)` sends a signed-in person to `/tickets`.

## Request flow

A read, such as the ticket list:

1. The desk layout calls `requireUser()`.
2. The page calls `listTickets(user)`.
3. The service applies `ticketListWhere(user)` and queries Prisma.

A write, such as creating a ticket:

1. The form posts to `createTicketAction`.
2. The action calls `requireUser()` again. A hidden page is not a permission check.
3. Zod validates the form.
4. `createTicket` inserts an `OPEN` ticket owned by the current user.
5. The action revalidates `/tickets` and redirects to the new detail page.

Status changes and self-assignment do not trust a status or assignee sent by the browser. The service loads the ticket and applies `nextStatus` or `canAssignToSelf`.

## Authentication

1. Register or sign-in checks the password with bcrypt.
2. `createSession` stores only the user id in a signed httpOnly cookie.
3. `getCurrentUser` verifies the cookie, then loads `id`, `name`, `email`, and `role` from the database.
4. Registration always stores `USER`. The agent account is seeded.

Role checks live next to the rule they protect: `canChangeStatus`, `canAssignToSelf`, and `canAddComment`. There is no policy engine.

## Important rules

- A customer sees and opens only tickets they created. An agent sees every ticket.
- Status moves one step: `OPEN → IN_PROGRESS → RESOLVED`. Resolved tickets stay resolved.
- An agent may assign an unassigned ticket to themselves. They cannot assign someone else or clear an assignment.
- Customers may add public comments on their own tickets. Agents may add public or internal comments on any ticket. Customers do not receive internal comments.

## Context hierarchy

```text
PROJECT
    ↓
MODULE
    ↓
TASK
```

Project context is this document, `AGENTS.md`, and the decision records. It says how the system is shaped and which rules are global.

Module context is `docs/modules/`. It says what that module owns, what it depends on, and which rules must stay intact.

Task context is the specific change: the goal, the files that need to move, the acceptance criteria, and the checks to run. A task should not redesign a module that the change does not require.

## Source of truth

When two sources disagree, stop and name the conflict. Do not pick silently.

1. Product and feature requirements
2. Architecture decisions in `docs/decisions/`
3. Module documents in `docs/modules/`
4. `AGENTS.md` and this architecture note
5. The current repository implementation
6. A task implementation plan
7. Temporary conversation history

The code is what runs. The documents are what a change is supposed to preserve. If they drift, the drift is a finding, not a reason to invent a third behavior.

## Verification boundaries

| Boundary | What it checks | Command |
| --- | --- | --- |
| Ticket and comment rules | Who may view, advance, assign, and comment | `npm test` |
| Ticket validation | Required title, description, and priority | `npm test` |
| Workflow | Create, list scope, status, self-assign, comment visibility against SQLite | `npm test` |
| Types and lint | Compile errors and project lint rules | `npm run typecheck`, `npm run lint` |
| Production bundle | The app builds | `npm run build` |

Rule tests do not boot Next.js. The workflow test calls the services and Prisma, not the browser.
