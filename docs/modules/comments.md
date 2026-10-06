# Comments

## Purpose

Comments own the conversation on a ticket, including whether a note is public or internal.

## Responsibilities

- Validate comment text and visibility
- Decide who may write
- Decide which comments a reader receives
- Persist the comment

## Important files

- `src/modules/comments/rules.ts` — `canAddComment` and `visibleCommentWhere`
- `src/modules/comments/validation.ts`
- `src/modules/comments/service.ts` — `listComments` and `addComment`
- `src/modules/comments/actions.ts`
- `src/components/comment-form.tsx`
- The comment section of `src/app/(desk)/tickets/[id]/page.tsx`

## Data / state ownership

The `Comment` row: body, author, ticket, and `PUBLIC` or `INTERNAL` visibility.

## Interfaces

The ticket page calls `listComments(user, ticketId)` and posts `addCommentAction`. The service checks ticket access before it reads or writes.

## Dependencies

`canViewTicket` from the tickets module, `SessionUser` from auth, and the shared Prisma client.

## Important rules

- A customer can add a public comment only on a ticket they can view.
- A customer cannot create or read an internal comment.
- An agent can add either visibility on any ticket.
- The visibility filter is `visibleCommentWhere`, not a check buried in the page.

## Verification

`tests/comments/rules.test.ts` and the comment steps in `tests/workflow.integration.test.ts`.

```bash
npm test
```
