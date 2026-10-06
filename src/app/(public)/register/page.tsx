import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/register-form";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <section className="auth-card">
      <h1>Create an account</h1>
      <p className="lede">New accounts are customers. Agent access is created with the seed data.</p>
      <div className="stack" style={{ marginTop: "1.25rem" }}>
        <RegisterForm />
      </div>
      <p className="auth-links">
        Already registered? <Link href="/login">Sign in</Link>
      </p>
    </section>
  );
}
