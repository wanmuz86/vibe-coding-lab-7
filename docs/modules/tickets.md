# Tickets

## Purpose

Tickets own the support request: who created it, who it is assigned to, and which status and priority it has.

## Responsibilities

- Validate a new ticket
- List the tickets the current user is allowed to see
- Load one ticket or hide it
- Move status forward one step
- Let an agent claim an unassigned ticket

## Important files

- `src/modules/tickets/rules.ts` — access, list scope, status transitions, self-assignment
- `src/modules/tickets/validation.ts` — create schema
- `src/modules/tickets/service.ts` — Prisma reads and writes
- `src/modules/tickets/actions.ts` — Server Actions
- `src/app/(desk)/tickets/page.tsx`, `new/page.tsx`, and `[id]/page.tsx`

## Data / state ownership

The `Ticket` row. `createdById` is the customer who opened it. `assignedToId` is null or one agent.

## Interfaces

`listTickets`, `getTicketForActor`, `createTicket`, `advanceTicketStatus`, and `assignTicketToSelf` take a `SessionUser`. Comments call `canViewTicket` rather than reimplementing ownership.

## Dependencies

Auth for the user type. Shared Prisma client and `DomainError`. No dependency on the comments module.

## Important rules

- Customers are scoped to `createdById`. Agents are not.
- The next status is computed on the server. The form does not submit a free-form status.
- Self-assignment requires an agent and a null `assignedToId`.
- A ticket the caller cannot view is treated as missing.

## Verification

`tests/tickets/validation.test.ts`, `tests/tickets/rules.test.ts`, and the workflow in `tests/workflow.integration.test.ts`.

```bash
npm test
```
