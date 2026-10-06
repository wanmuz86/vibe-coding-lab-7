import type { SessionUser } from "@/modules/auth/types";
import { hashPassword, verifyPassword } from "@/modules/auth/password";
import type { RegisterInput } from "@/modules/auth/validation";
import { DomainError } from "@/modules/shared/errors";
import { prisma } from "@/modules/shared/db";

export async function registerUser(input: RegisterInput): Promise<SessionUser> {
  const email = input.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new DomainError("An account with that email already exists.", "INVALID");
  }

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email,
      passwordHash: await hashPassword(input.password),
      role: "USER",
    },
    select: { id: true, name: true, email: true, role: true },
  });

  return user;
}

export async function authenticate(email: string, password: string): Promise<SessionUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return null;
  }

  const matches = await verifyPassword(password, user.passwordHash);
  if (!matches) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
