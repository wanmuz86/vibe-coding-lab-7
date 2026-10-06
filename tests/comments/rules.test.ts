import { describe, expect, it } from "vitest";
import { canAddComment, visibleCommentWhere } from "@/modules/comments/rules";

const customer = { id: "user-1", role: "USER" as const };
const agent = { id: "agent-1", role: "AGENT" as const };
const ownTicket = { createdById: "user-1" };
const otherTicket = { createdById: "user-2" };

describe("comment rules", () => {
  it("lets a customer comment publicly on their own ticket", () => {
    expect(canAddComment(customer, ownTicket, "PUBLIC")).toBe(true);
    expect(canAddComment(customer, ownTicket, "INTERNAL")).toBe(false);
    expect(canAddComment(customer, otherTicket, "PUBLIC")).toBe(false);
  });

  it("lets an agent add public or internal comments on any ticket", () => {
    expect(canAddComment(agent, otherTicket, "PUBLIC")).toBe(true);
    expect(canAddComment(agent, otherTicket, "INTERNAL")).toBe(true);
  });

  it("hides internal comments from customers", () => {
    expect(visibleCommentWhere(customer)).toEqual({ visibility: "PUBLIC" });
    expect(visibleCommentWhere(agent)).toEqual({});
  });
});
