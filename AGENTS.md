<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Support Desk agent instructions

Read `ARCHITECTURE.md` and the module document for the area you are changing before editing. Next.js behavior for this version comes from `node_modules/next/dist/docs/`.

## Architecture

- Keep pages and components responsible for rendering and form submission.
- Keep permission, status, and assignment rules in the feature `rules.ts` files.
- Keep database access in the feature services and `src/modules/shared/db.ts`.
- Reuse Server Actions, Zod schemas, and `DomainError` instead of a new pattern.
- Auth owns the session. Tickets own ticket access. Comments reuse ticket access and add visibility.

## Scope

- Change only what the task needs.
- Do not introduce a new architectural style without an explicit decision.
- Do not add dependencies without approval.
- Do not build a general permission framework, notifications, attachments, or realtime updates unless the task asks for them.

## Security and data

- Check the current user inside each Server Action. Do not rely on what the page hid.
- Keep password hashes and `SESSION_SECRET` out of client components, logs, and docs.
- Use fictional seed data only. Do not add real credentials.
- Registration stays `USER` unless a task says otherwise.

## Verification

Run the checks that match the change:

- `npm test` for rules, validation, or service behavior
- `npm run lint`
- `npm run typecheck`
- `npm run build` when routes, server actions, or shared runtime code change

## Reporting

Report:

- files modified
- commands executed and their results
- checks you did not run
- assumptions or conflicts between the requirements, decision records, module docs, and code
