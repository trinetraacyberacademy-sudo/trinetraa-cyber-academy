"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().min(8, "Please enter a valid phone number."),
  message: z.string().trim().min(5, "Please add a short message."),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type EnquiryState = {
  success?: boolean;
  fieldErrors?: Partial<Record<keyof EnquiryInput, string>>;
};

export async function submitEnquiryAction(input: EnquiryInput): Promise<EnquiryState> {
  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: EnquiryState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof EnquiryInput | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { fieldErrors };
  }

  await prisma.enquiry.create({
    data: { ...parsed.data, email: parsed.data.email.toLowerCase() },
  });

  return { success: true };
}
