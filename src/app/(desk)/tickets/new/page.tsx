import type { Metadata } from "next";
import Link from "next/link";
import { TicketForm } from "@/components/ticket-form";

export const metadata: Metadata = { title: "New ticket" };

export default function NewTicketPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1>New ticket</h1>
          <p className="lede">Describe the problem and choose a priority.</p>
        </div>
        <Link href="/tickets">Back to tickets</Link>
      </div>
      <section className="card detail-card">
        <TicketForm />
      </section>
    </>
  );
}
