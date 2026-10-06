"use client";

import { useActionState } from "react";
import { createTicketAction } from "@/modules/tickets/actions";
import { PRIORITY_LABELS, TICKET_PRIORITIES } from "@/modules/tickets/rules";
import { initialActionState } from "@/modules/shared/action-state";

export function TicketForm() {
  const [state, action, pending] = useActionState(createTicketAction, initialActionState);

  return (
    <form action={action} className="stack">
      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" aria-invalid={state.fieldErrors?.title ? true : undefined} />
        {state.fieldErrors?.title ? <p className="field-error">{state.fieldErrors.title}</p> : null}
      </div>
      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={6} />
        {state.fieldErrors?.description ? <p className="field-error">{state.fieldErrors.description}</p> : null}
      </div>
      <div className="field">
        <label htmlFor="priority">Priority</label>
        <select id="priority" name="priority" defaultValue="MEDIUM">
          {TICKET_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </select>
        {state.fieldErrors?.priority ? <p className="field-error">{state.fieldErrors.priority}</p> : null}
      </div>
      <button type="submit" className="button" disabled={pending}>
        {pending ? "Creating…" : "Create ticket"}
      </button>
    </form>
  );
}
