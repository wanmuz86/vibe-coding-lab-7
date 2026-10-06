import type { SessionUser } from "@/modules/auth/types";
import type { CreateTicketInput } from "@/modules/tickets/validation";
import {
  canAssignToSelf,
  canChangeStatus,
  canViewTicket,
  nextStatus,
  ticketListWhere,
} from "@/modules/tickets/rules";
import { DomainError } from "@/modules/shared/errors";
import { prisma } from "@/modules/shared/db";

const personSelect = { id: true, name: true } as const;

export async function listTickets(actor: SessionUser) {
  return prisma.ticket.findMany({
    where: ticketListWhere(actor),
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: { select: personSelect },
      assignedTo: { select: personSelect },
    },
  });
}

export async function getTicketForActor(actor: SessionUser, ticketId: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      createdBy: { select: personSelect },
      assignedTo: { select: personSelect },
    },
  });

  if (!ticket || !canViewTicket(actor, ticket)) {
    return null;
  }

  return ticket;
}

export async function createTicket(actor: SessionUser, input: CreateTicketInput) {
  return prisma.ticket.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: "OPEN",
      createdById: actor.id,
    },
  });
}

export async function advanceTicketStatus(actor: SessionUser, ticketId: string) {
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket || !canViewTicket(actor, ticket)) {
    throw new DomainError("Ticket not found.", "NOT_FOUND");
  }
  if (!canChangeStatus(actor)) {
    throw new DomainError("Only support agents can change ticket status.", "FORBIDDEN");
  }

  const status = nextStatus(ticket.status);
  if (!status) {
    throw new DomainError("This ticket is already resolved.", "INVALID");
  }

  return prisma.ticket.update({
    where: { id: ticketId },
    data: { status },
  });
}

export async function assignTicketToSelf(actor: SessionUser, ticketId: string) {
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket || !canViewTicket(actor, ticket)) {
    throw new DomainError("Ticket not found.", "NOT_FOUND");
  }
  if (!canAssignToSelf(actor, ticket)) {
    throw new DomainError("Only an agent can claim an unassigned ticket.", "FORBIDDEN");
  }

  return prisma.ticket.update({
    where: { id: ticketId },
    data: { assignedToId: actor.id },
  });
}
