const TICKET_ID = /^c[a-z0-9]+$/;

export function ticketDetailPath(ticketId: string): string {
  if (!TICKET_ID.test(ticketId)) {
    return "/tickets";
  }
  return `/tickets/${ticketId}`;
}
