import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/modules/auth/current-user";
import { roleLabel } from "@/modules/auth/types";
import { listComments } from "@/modules/comments/service";
import { VISIBILITY_LABELS } from "@/modules/comments/rules";
import { getTicketForActor } from "@/modules/tickets/service";
import { CommentForm } from "@/components/comment-form";
import { PriorityBadge, StatusBadge } from "@/components/ticket-badges";
import { TicketControls } from "@/components/ticket-controls";
import { formatDateTime } from "@/modules/shared/format";
import { readNotice } from "@/modules/shared/notices";

export const metadata: Metadata = { title: "Ticket" };

export default async function TicketDetailPage(props: PageProps<"/tickets/[id]">) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const user = await requireUser();
  const ticket = await getTicketForActor(user, id);

  if (!ticket) {
    notFound();
  }

  const comments = await listComments(user, ticket.id);
  const notice = readNotice(searchParams.notice);

  return (
    <>
      <p>
        <Link href="/tickets">Back to tickets</Link>
      </p>
      {notice ? (
        <p className="banner" role="alert">
          {notice}
        </p>
      ) : null}
      <article className="card detail-card">
        <div className="meta">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
        <h1>{ticket.title}</h1>
        <p className="description">{ticket.description}</p>
        <dl className="facts">
          <div>
            <dt>Opened by</dt>
            <dd>{ticket.createdBy.name}</dd>
          </div>
          <div>
            <dt>Assigned to</dt>
            <dd>{ticket.assignedTo ? ticket.assignedTo.name : "Unassigned"}</dd>
          </div>
          <div>
            <dt>Opened</dt>
            <dd>{formatDateTime(ticket.createdAt)}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{formatDateTime(ticket.updatedAt)}</dd>
          </div>
        </dl>
        <TicketControls
          ticketId={ticket.id}
          status={ticket.status}
          assignedToId={ticket.assignedToId}
          isAgent={user.role === "AGENT"}
        />
      </article>
      <section style={{ marginTop: "1.25rem" }}>
        <h2>Comments</h2>
        {comments.length === 0 ? (
          <p className="lede">No comments yet.</p>
        ) : (
          <div className="comment-list">
            {comments.map((comment) => (
              <article key={comment.id} className="card comment">
                <header>
                  <strong>{comment.author.name}</strong>
                  <span>{roleLabel(comment.author.role)}</span>
                  <span>{formatDateTime(comment.createdAt)}</span>
                  {comment.visibility === "INTERNAL" ? (
                    <span className="badge visibility-internal">{VISIBILITY_LABELS.INTERNAL}</span>
                  ) : null}
                </header>
                <p>{comment.body}</p>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="card composer" style={{ marginTop: "1rem" }}>
        <h2>Add a comment</h2>
        <div style={{ marginTop: "0.75rem" }}>
          <CommentForm ticketId={ticket.id} role={user.role} />
        </div>
      </section>
    </>
  );
}
