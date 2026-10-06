import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { hashPassword } from "@/modules/auth/password";
import type { SessionUser } from "@/modules/auth/types";
import { addComment, listComments } from "@/modules/comments/service";
import { DomainError } from "@/modules/shared/errors";
import { prisma } from "@/modules/shared/db";
import {
  advanceTicketStatus,
  assignTicketToSelf,
  createTicket,
  getTicketForActor,
  listTickets,
} from "@/modules/tickets/service";

let passwordHash = "";

async function createActor(name: string, email: string, role: SessionUser["role"]): Promise<SessionUser> {
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role },
    select: { id: true, name: true, email: true, role: true },
  });
  return user;
}

beforeAll(async () => {
  if (!process.env.DATABASE_URL?.includes("test.db")) {
    throw new Error(`Refusing to run integration tests against ${process.env.DATABASE_URL}`);
  }
  passwordHash = await hashPassword("password123");
});

beforeEach(async () => {
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("ticket workflow", () => {
  it("creates, scopes, advances, assigns, and comments according to role", async () => {
    const alex = await createActor("Alex Rivera", "alex@example.com", "USER");
    const sam = await createActor("Sam Patel", "sam@example.com", "USER");
    const jordan = await createActor("Jordan Lee", "jordan@example.com", "AGENT");

    const alexTicket = await createTicket(alex, {
      title: "Portal login",
      description: "Reset email never arrives.",
      priority: "HIGH",
    });
    await createTicket(sam, {
      title: "App crash",
      description: "The app closes on sign in.",
      priority: "MEDIUM",
    });

    const alexList = await listTickets(alex);
    const agentList = await listTickets(jordan);
    expect(alexList.map((ticket) => ticket.id)).toEqual([alexTicket.id]);
    expect(agentList).toHaveLength(2);
    expect(await getTicketForActor(sam, alexTicket.id)).toBeNull();

    await expect(advanceTicketStatus(alex, alexTicket.id)).rejects.toBeInstanceOf(DomainError);
    const inProgress = await advanceTicketStatus(jordan, alexTicket.id);
    expect(inProgress.status).toBe("IN_PROGRESS");
    const resolved = await advanceTicketStatus(jordan, alexTicket.id);
    expect(resolved.status).toBe("RESOLVED");
    await expect(advanceTicketStatus(jordan, alexTicket.id)).rejects.toMatchObject({ code: "INVALID" });

    const unassigned = await createTicket(alex, {
      title: "Statement copy",
      description: "Please send September.",
      priority: "LOW",
    });
    const claimed = await assignTicketToSelf(jordan, unassigned.id);
    expect(claimed.assignedToId).toBe(jordan.id);
    await expect(assignTicketToSelf(jordan, unassigned.id)).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(assignTicketToSelf(alex, unassigned.id)).rejects.toBeInstanceOf(DomainError);

    await addComment(alex, alexTicket.id, { body: "Still blocked.", visibility: "PUBLIC" });
    await expect(
      addComment(alex, alexTicket.id, { body: "Secret note.", visibility: "INTERNAL" }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await addComment(jordan, alexTicket.id, { body: "Checking the mail logs.", visibility: "INTERNAL" });

    const customerComments = await listComments(alex, alexTicket.id);
    const agentComments = await listComments(jordan, alexTicket.id);
    expect(customerComments.map((comment) => comment.visibility)).toEqual(["PUBLIC"]);
    expect(agentComments.map((comment) => comment.visibility)).toEqual(["PUBLIC", "INTERNAL"]);
  });
});
