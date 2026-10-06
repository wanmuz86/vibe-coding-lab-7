import { describe, expect, it } from "vitest";
import {
  canAssignToSelf,
  canChangeStatus,
  canViewTicket,
  nextStatus,
  ticketListWhere,
} from "@/modules/tickets/rules";

const customer = { id: "user-1", role: "USER" as const };
const agent = { id: "agent-1", role: "AGENT" as const };
const ownTicket = { createdById: "user-1", assignedToId: null, status: "OPEN" as const };
const otherTicket = { createdById: "user-2", assignedToId: null, status: "OPEN" as const };

describe("ticket access rules", () => {
  it("lets a customer see only their own tickets", () => {
    expect(canViewTicket(customer, ownTicket)).toBe(true);
    expect(canViewTicket(customer, otherTicket)).toBe(false);
    expect(ticketListWhere(customer)).toEqual({ createdById: "user-1" });
  });

  it("lets an agent see every ticket", () => {
    expect(canViewTicket(agent, otherTicket)).toBe(true);
    expect(ticketListWhere(agent)).toEqual({});
  });

  it("allows only agents to change status", () => {
    expect(canChangeStatus(customer)).toBe(false);
    expect(canChangeStatus(agent)).toBe(true);
  });

  it("advances status one step at a time", () => {
    expect(nextStatus("OPEN")).toBe("IN_PROGRESS");
    expect(nextStatus("IN_PROGRESS")).toBe("RESOLVED");
    expect(nextStatus("RESOLVED")).toBeNull();
  });

  it("lets an agent claim only an unassigned ticket", () => {
    expect(canAssignToSelf(agent, { assignedToId: null })).toBe(true);
    expect(canAssignToSelf(agent, { assignedToId: "agent-2" })).toBe(false);
    expect(canAssignToSelf(customer, { assignedToId: null })).toBe(false);
  });
});
