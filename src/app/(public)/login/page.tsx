import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <section className="auth-card">
      <h1>Sign in</h1>
      <p className="lede">Open the tickets you are allowed to see.</p>
      <div className="stack" style={{ marginTop: "1.25rem" }}>
        <LoginForm />
      </div>
      <p className="auth-links">
        New here? <Link href="/register">Create an account</Link>
      </p>
      <div className="dev-accounts">
        <p>Development accounts, password <code>password123</code></p>
        <p>
          Customer <code>user@example.com</code>
        </p>
        <p>
          Agent <code>agent@example.com</code>
        </p>
      </div>
    </section>
  );
}
