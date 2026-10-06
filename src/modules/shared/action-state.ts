import type { ZodError } from "zod";

export type FieldErrors = Partial<Record<string, string>>;

export type ActionState = {
  formError?: string;
  fieldErrors?: FieldErrors;
};

export const initialActionState: ActionState = {};

export function fieldErrorsFromZod(error: ZodError): FieldErrors {
  const flattened = error.flatten().fieldErrors;
  const fieldErrors: FieldErrors = {};

  for (const [field, messages] of Object.entries(flattened)) {
    const message = Array.isArray(messages) ? messages[0] : undefined;
    if (typeof message === "string") {
      fieldErrors[field] = message;
    }
  }

  return fieldErrors;
}
