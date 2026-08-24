"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { EnquiryStatus } from "@/generated/prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Not authorized.");
  }
  return session;
}

export async function updateEnquiryStatusAction(enquiryId: string, status: EnquiryStatus) {
  await requireAdmin();
  await prisma.enquiry.update({
    where: { id: enquiryId },
    data: { status },
  });
  revalidatePath("/admin");
  return { success: true };
}
