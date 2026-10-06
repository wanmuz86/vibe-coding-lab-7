"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/modules/auth/current-user";
import { ticketDetailPath } from "@/modules/tickets/paths";
import { advanceTicketStatus, assignTicketToSelf, createTicket } from "@/modules/tickets/service";
import { createTicketSchema } from "@/modules/tickets/validation";
import { fieldErrorsFromZod, type ActionState } from "@/modules/shared/action-state";
import { isDomainError } from "@/modules/shared/errors";
import { noticeForDomainCode } from "@/modules/shared/notices";

function readTicketId(formData: FormData): string {
  const value = formData.get("ticketId");
  return typeof value === "string" ? value : "";
}

export async function createTicketAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = createTicketSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const ticket = await createTicket(user, parsed.data);
  revalidatePath("/tickets");
  redirect(ticketDetailPath(ticket.id));
}

export async function advanceTicketStatusAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const ticketId = readTicketId(formData);
  const path = ticketDetailPath(ticketId);

  try {
    await advanceTicketStatus(user, ticketId);
  } catch (error) {
    if (isDomainError(error)) {
      redirect(`${path}?notice=${noticeForDomainCode(error.code)}`);
    }
    throw error;
  }

  revalidatePath(path);
  revalidatePath("/tickets");
  redirect(path);
}

export async function assignTicketToSelfAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const ticketId = readTicketId(formData);
  const path = ticketDetailPath(ticketId);

  try {
    await assignTicketToSelf(user, ticketId);
  } catch (error) {
    if (isDomainError(error)) {
      redirect(`${path}?notice=${noticeForDomainCode(error.code)}`);
    }
    throw error;
  }

  revalidatePath(path);
  revalidatePath("/tickets");
  redirect(path);
}
