"use client";

import { useActionState } from "react";
import type { Role } from "@/modules/auth/types";
import { addCommentAction } from "@/modules/comments/actions";
import { COMMENT_VISIBILITIES, VISIBILITY_LABELS } from "@/modules/comments/rules";
import { initialActionState } from "@/modules/shared/action-state";

export function CommentForm({ ticketId, role }: { ticketId: string; role: Role }) {
  const [state, action, pending] = useActionState(addCommentAction, initialActionState);

  return (
    <form action={action} className="stack">
      <input type="hidden" name="ticketId" value={ticketId} />
      {state.formError ? (
        <p className="banner" role="alert">
          {state.formError}
        </p>
      ) : null}
      <div className="field">
        <label htmlFor="body">Comment</label>
        <textarea id="body" name="body" rows={4} />
        {state.fieldErrors?.body ? <p className="field-error">{state.fieldErrors.body}</p> : null}
      </div>
      {role === "AGENT" ? (
        <div className="field">
          <label htmlFor="visibility">Visibility</label>
          <select id="visibility" name="visibility" defaultValue="PUBLIC">
            {COMMENT_VISIBILITIES.map((visibility) => (
              <option key={visibility} value={visibility}>
                {VISIBILITY_LABELS[visibility]}
              </option>
            ))}
          </select>
          <p className="hint">Internal comments are visible to agents only.</p>
        </div>
      ) : null}
      <button type="submit" className="button" disabled={pending}>
        {pending ? "Posting…" : "Add comment"}
      </button>
    </form>
  );
}
