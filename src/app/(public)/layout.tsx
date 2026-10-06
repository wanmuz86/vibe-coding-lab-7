import { redirect } from "next/navigation";
import { getCurrentUser } from "@/modules/auth/current-user";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (user) {
    redirect("/tickets");
  }

  return <div className="auth-shell">{children}</div>;
}
