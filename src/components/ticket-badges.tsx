import { PRIORITY_LABELS, STATUS_LABELS, type TicketPriority, type TicketStatus } from "@/modules/tickets/rules";

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <span className={`badge status-${status.toLowerCase()}`}>{STATUS_LABELS[status]}</span>;
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return <span className={`badge priority-${priority.toLowerCase()}`}>{PRIORITY_LABELS[priority]}</span>;
}
