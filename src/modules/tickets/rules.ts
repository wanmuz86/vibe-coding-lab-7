import type { SessionUser } from "@/modules/auth/types";

export const TICKET_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED"] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const NEXT_STATUS: Record<TicketStatus, TicketStatus | null> = {
  OPEN: "IN_PROGRESS",
  IN_PROGRESS: "RESOLVED",
  RESOLVED: null,
};

export function isAgent(actor: Pick<SessionUser, "role">): boolean {
  return actor.role === "AGENT";
}

export function canViewTicket(
  actor: Pick<SessionUser, "id" | "role">,
  ticket: { createdById: string },
): boolean {
  if (isAgent(actor)) {
    return true;
  }
  return ticket.createdById === actor.id;
}

export function ticketListWhere(
  actor: Pick<SessionUser, "id" | "role">,
): { createdById: string } | Record<string, never> {
  if (isAgent(actor)) {
    return {};
  }
  return { createdById: actor.id };
}

export function canChangeStatus(actor: Pick<SessionUser, "role">): boolean {
  return isAgent(actor);
}

export function nextStatus(status: TicketStatus): TicketStatus | null {
  return NEXT_STATUS[status];
}

export function canAssignToSelf(
  actor: Pick<SessionUser, "role">,
  ticket: { assignedToId: string | null },
): boolean {
  return isAgent(actor) && ticket.assignedToId === null;
}
