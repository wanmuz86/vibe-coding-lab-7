import { assignTicketToSelfAction, advanceTicketStatusAction } from "@/modules/tickets/actions";
import { nextStatus, STATUS_LABELS, type TicketStatus } from "@/modules/tickets/rules";

export function TicketControls({
  ticketId,
  status,
  assignedToId,
  isAgent,
}: {
  ticketId: string;
  status: TicketStatus;
  assignedToId: string | null;
  isAgent: boolean;
}) {
  if (!isAgent) {
    return null;
  }

  const upcoming = nextStatus(status);

  return (
    <div className="control-row">
      {upcoming ? (
        <form action={advanceTicketStatusAction}>
          <input type="hidden" name="ticketId" value={ticketId} />
          <button type="submit" className="button">
            Mark {STATUS_LABELS[upcoming].toLowerCase()}
          </button>
        </form>
      ) : (
        <p className="hint">This ticket is resolved.</p>
      )}
      {assignedToId === null ? (
        <form action={assignTicketToSelfAction}>
          <input type="hidden" name="ticketId" value={ticketId} />
          <button type="submit" className="button button-secondary">
            Assign to me
          </button>
        </form>
      ) : null}
    </div>
  );
}
