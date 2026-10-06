import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/modules/auth/current-user";
import { listTickets } from "@/modules/tickets/service";
import { PriorityBadge, StatusBadge } from "@/components/ticket-badges";
import { formatDateTime } from "@/modules/shared/format";

export const metadata: Metadata = { title: "Tickets" };

export default async function TicketsPage() {
  const user = await requireUser();
  const tickets = await listTickets(user);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Tickets</h1>
          <p className="lede">
            {user.role === "AGENT" ? "Every ticket in the desk." : "Tickets you have opened."}
          </p>
        </div>
        <Link href="/tickets/new" className="button">
          New ticket
        </Link>
      </div>
      {tickets.length === 0 ? (
        <section className="card empty">
          <p>No tickets yet.</p>
        </section>
      ) : (
        <ul className="ticket-list">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="ticket-card">
              <Link href={`/tickets/${ticket.id}`}>
                <h2>{ticket.title}</h2>
                <div className="meta">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                  <span>{formatDateTime(ticket.createdAt)}</span>
                  <span>{ticket.assignedTo ? ticket.assignedTo.name : "Unassigned"}</span>
                  {user.role === "AGENT" ? <span>Opened by {ticket.createdBy.name}</span> : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
