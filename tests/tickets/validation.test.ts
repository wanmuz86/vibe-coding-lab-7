import { describe, expect, it } from "vitest";
import { createTicketSchema } from "@/modules/tickets/validation";

describe("create ticket validation", () => {
  it("accepts a title, description, and priority", () => {
    const parsed = createTicketSchema.safeParse({
      title: "Printer offline",
      description: "The third-floor printer does not respond.",
      priority: "HIGH",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects an empty title", () => {
    const parsed = createTicketSchema.safeParse({
      title: "   ",
      description: "Details",
      priority: "LOW",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.flatten().fieldErrors.title?.[0]).toBe("Title is required.");
    }
  });

  it("rejects an unknown priority", () => {
    const parsed = createTicketSchema.safeParse({
      title: "Printer offline",
      description: "Details",
      priority: "URGENT",
    });

    expect(parsed.success).toBe(false);
  });
});
