"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/modules/auth/current-user";
import { addComment } from "@/modules/comments/service";
import { createCommentSchema } from "@/modules/comments/validation";
import { ticketDetailPath } from "@/modules/tickets/paths";
import { fieldErrorsFromZod, type ActionState } from "@/modules/shared/action-state";
import { isDomainError } from "@/modules/shared/errors";

export async function addCommentAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const ticketId = formData.get("ticketId");
  const path = ticketDetailPath(typeof ticketId === "string" ? ticketId : "");

  const visibility = formData.get("visibility") || "PUBLIC";
  const parsed = createCommentSchema.safeParse({
    body: formData.get("body"),
    visibility,
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  try {
    await addComment(user, typeof ticketId === "string" ? ticketId : "", parsed.data);
  } catch (error) {
    if (isDomainError(error)) {
      return { formError: error.message };
    }
    throw error;
  }

  revalidatePath(path);
  redirect(path);
}
