import Link from "next/link";
import { logoutAction } from "@/modules/auth/actions";
import { roleLabel, type SessionUser } from "@/modules/auth/types";

export function AppHeader({ user }: { user: SessionUser }) {
  return (
    <header className="site-header">
      <Link href="/tickets" className="brand">
        Support Desk
      </Link>
      <nav className="header-nav" aria-label="Main">
        <Link href="/tickets">Tickets</Link>
        <Link href="/tickets/new">New ticket</Link>
      </nav>
      <div className="header-user">
        <span className="user-name">{user.name}</span>
        <span className="role-pill">{roleLabel(user.role)}</span>
        <form action={logoutAction}>
          <button type="submit" className="button button-quiet">
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
