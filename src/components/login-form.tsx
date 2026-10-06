"use client";

import { useActionState } from "react";
import { loginAction } from "@/modules/auth/actions";
import { initialActionState } from "@/modules/shared/action-state";
import { TextField } from "@/components/text-field";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialActionState);

  return (
    <form action={action} className="stack">
      {state.formError ? (
        <p className="banner" role="alert">
          {state.formError}
        </p>
      ) : null}
      <TextField label="Email" name="email" type="email" autoComplete="email" error={state.fieldErrors?.email} />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        error={state.fieldErrors?.password}
      />
      <button type="submit" className="button" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
