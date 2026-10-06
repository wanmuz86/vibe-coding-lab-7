import type { SessionUser } from "@/modules/auth/types";
import { canViewTicket } from "@/modules/tickets/rules";

export const COMMENT_VISIBILITIES = ["PUBLIC", "INTERNAL"] as const;
export type CommentVisibility = (typeof COMMENT_VISIBILITIES)[number];

export const VISIBILITY_LABELS: Record<CommentVisibility, string> = {
  PUBLIC: "Public",
  INTERNAL: "Internal",
};

export function canAddComment(
  actor: Pick<SessionUser, "id" | "role">,
  ticket: { createdById: string },
  visibility: CommentVisibility,
): boolean {
  if (!canViewTicket(actor, ticket)) {
    return false;
  }
  if (actor.role === "USER" && visibility === "INTERNAL") {
    return false;
  }
  return true;
}

export function visibleCommentWhere(
  actor: Pick<SessionUser, "role">,
): { visibility: "PUBLIC" } | Record<string, never> {
  if (actor.role === "AGENT") {
    return {};
  }
  return { visibility: "PUBLIC" };
}
