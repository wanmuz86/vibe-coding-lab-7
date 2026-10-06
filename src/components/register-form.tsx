"use client";

import { useActionState } from "react";
import { registerAction } from "@/modules/auth/actions";
import { initialActionState } from "@/modules/shared/action-state";
import { TextField } from "@/components/text-field";

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initialActionState);

  return (
    <form action={action} className="stack">
      {state.formError ? (
        <p className="banner" role="alert">
          {state.formError}
        </p>
      ) : null}
      <TextField label="Name" name="name" autoComplete="name" error={state.fieldErrors?.name} />
      <TextField label="Email" name="email" type="email" autoComplete="email" error={state.fieldErrors?.email} />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        error={state.fieldErrors?.password}
      />
      <button type="submit" className="button" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
