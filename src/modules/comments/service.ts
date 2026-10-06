import type { SessionUser } from "@/modules/auth/types";
import { canAddComment, visibleCommentWhere } from "@/modules/comments/rules";
import type { CreateCommentInput } from "@/modules/comments/validation";
import { canViewTicket } from "@/modules/tickets/rules";
import { DomainError } from "@/modules/shared/errors";
import { prisma } from "@/modules/shared/db";

export async function listComments(actor: SessionUser, ticketId: string) {
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket || !canViewTicket(actor, ticket)) {
    return [];
  }

  return prisma.comment.findMany({
    where: { ticketId, ...visibleCommentWhere(actor) },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, name: true, role: true } },
    },
  });
}

export async function addComment(actor: SessionUser, ticketId: string, input: CreateCommentInput) {
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket || !canViewTicket(actor, ticket)) {
    throw new DomainError("Ticket not found.", "NOT_FOUND");
  }
  if (!canAddComment(actor, ticket, input.visibility)) {
    throw new DomainError("You cannot add that comment.", "FORBIDDEN");
  }

  return prisma.comment.create({
    data: {
      ticketId,
      authorId: actor.id,
      body: input.body,
      visibility: input.visibility,
    },
  });
}
