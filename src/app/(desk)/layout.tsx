import { requireUser } from "@/modules/auth/current-user";
import { AppHeader } from "@/components/app-header";

export default async function DeskLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <>
      <AppHeader user={user} />
      <main className="page">{children}</main>
    </>
  );
}
