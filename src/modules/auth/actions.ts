"use server";

import { redirect } from "next/navigation";
import { authenticate, registerUser } from "@/modules/auth/service";
import { clearSession, createSession } from "@/modules/auth/session";
import { loginSchema, registerSchema } from "@/modules/auth/validation";
import { fieldErrorsFromZod, type ActionState } from "@/modules/shared/action-state";
import { isDomainError } from "@/modules/shared/errors";

export async function registerAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  try {
    const user = await registerUser(parsed.data);
    await createSession(user.id);
  } catch (error) {
    if (isDomainError(error)) {
      return { fieldErrors: { email: error.message } };
    }
    throw error;
  }

  redirect("/tickets");
}

export async function loginAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const user = await authenticate(parsed.data.email, parsed.data.password);
  if (!user) {
    return { formError: "Invalid email or password." };
  }

  await createSession(user.id);
  redirect("/tickets");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}
