import { redirect } from "next/navigation";
import { readSessionUserId } from "@/modules/auth/session";
import type { SessionUser } from "@/modules/auth/types";
import { prisma } from "@/modules/shared/db";

export async function getCurrentUser(): Promise<SessionUser | null> {
  const userId = await readSessionUserId();
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });

  return user;
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
