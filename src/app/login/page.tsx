import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { LoginForm } from "@/components/auth/LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Log In | Trinetraa Cyber Academy",
  description: "Log in to your Trinetraa Cyber Academy account.",
};

export default function LoginPage() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-24 sm:pt-40">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid mask-fade-b absolute inset-0" />
      </div>
      <Container className="relative max-w-md">
        <Reveal>
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Log In
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Welcome back. Log in to check your registration status.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9">
            <LoginForm />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
