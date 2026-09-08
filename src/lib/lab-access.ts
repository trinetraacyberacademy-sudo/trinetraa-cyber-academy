import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Gate for the lab environment (TrinetraTicket, TrinetraSIEM): requires a
 * logged-in STUDENT with at least one PAID registration. Redirects to
 * /login or /dashboard otherwise.
 */
export async function requirePaidStudent() {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const paidRegistration = await prisma.registration.findFirst({
    where: { userId: session.user.id, status: "PAID" },
  });

  if (!paidRegistration) {
    redirect("/dashboard");
  }

  return session.user;
}
