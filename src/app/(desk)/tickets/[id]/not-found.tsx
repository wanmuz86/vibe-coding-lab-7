import Link from "next/link";

export default function TicketNotFound() {
  return (
    <section className="card empty">
      <h1>Ticket not found</h1>
      <p className="lede">It may have been removed, or you may not be allowed to view it.</p>
      <p style={{ marginTop: "1rem" }}>
        <Link href="/tickets">Back to tickets</Link>
      </p>
    </section>
  );
}
