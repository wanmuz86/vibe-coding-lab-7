export const ROLES = ["USER", "AGENT"] as const;

export type Role = (typeof ROLES)[number];

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export function roleLabel(role: Role): string {
  return role === "AGENT" ? "Agent" : "Customer";
}
