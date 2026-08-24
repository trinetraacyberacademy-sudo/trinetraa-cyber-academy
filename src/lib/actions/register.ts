"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().min(8, "Please enter a valid phone number."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  courseSlug: z.string().min(1, "Please select a course."),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export type RegisterState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof RegisterInput, string>>;
};

export async function registerAction(input: RegisterInput): Promise<RegisterState> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: RegisterState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof RegisterInput | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { fieldErrors };
  }

  const { name, phone, password, courseSlug } = parsed.data;
  const email = parsed.data.email.toLowerCase();

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course || !course.isActive) {
    return { error: "The selected course is not available right now. Please choose again." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      error: "An account with this email already exists. Try logging in instead.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // Only the account is created here — the Registration row is created once the
  // student reaches the payment step (see /api/payments/create-order), so we
  // never have a "registered but never attempted payment" row with no order tied
  // to it.
  await prisma.user.create({
    data: { name, email, phone, passwordHash, role: "STUDENT" },
  });

  return { success: true };
}
