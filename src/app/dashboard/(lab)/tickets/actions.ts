"use server";

import { revalidatePath } from "next/cache";
import { requirePaidStudent } from "@/lib/lab-access";
import { prisma } from "@/lib/prisma";

async function assertOwnedTicket(ticketId: string, userId: string) {
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) {
    throw new Error("Ticket not found.");
  }
  if (ticket.assignedToUserId !== userId) {
    throw new Error("Assign this ticket to yourself before working it.");
  }
  return ticket;
}

export async function assignToMe(ticketId: string) {
  const user = await requirePaidStudent();

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { assignedToUserId: user.id },
  });

  revalidatePath(`/dashboard/tickets/${ticketId}`);
  revalidatePath("/dashboard/tickets");
}

export async function saveInvestigationNotes(ticketId: string, notes: string) {
  const user = await requirePaidStudent();
  const ticket = await assertOwnedTicket(ticketId, user.id);

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      investigationNotes: notes,
      status: ticket.status === "OPEN" ? "IN_PROGRESS" : ticket.status,
    },
  });

  revalidatePath(`/dashboard/tickets/${ticketId}`);
  revalidatePath("/dashboard/tickets");
}

export async function escalateTicket(ticketId: string, notes: string) {
  const user = await requirePaidStudent();
  await assertOwnedTicket(ticketId, user.id);

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: "ESCALATED",
      investigationNotes: notes,
    },
  });

  revalidatePath(`/dashboard/tickets/${ticketId}`);
  revalidatePath("/dashboard/tickets");
}

export async function closeTicket(
  ticketId: string,
  resolution: string,
  resolutionNotes: string,
) {
  const user = await requirePaidStudent();
  await assertOwnedTicket(ticketId, user.id);

  if (!resolution) {
    throw new Error("Choose a resolution before closing the ticket.");
  }

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: "RESOLVED",
      resolution,
      resolutionNotes,
      resolvedAt: new Date(),
    },
  });

  revalidatePath(`/dashboard/tickets/${ticketId}`);
  revalidatePath("/dashboard/tickets");
}
