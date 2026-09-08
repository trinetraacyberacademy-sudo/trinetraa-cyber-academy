-- CreateEnum
CREATE TYPE "TicketCategory" AS ENUM ('PHISHING', 'MALWARE', 'ENDPOINT', 'IDENTITY', 'NETWORK');

-- CreateEnum
CREATE TYPE "TicketSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "LogSourceType" AS ENUM ('EMAIL_GATEWAY', 'ENDPOINT', 'AUTHENTICATION', 'NETWORK');

-- CreateTable
CREATE TABLE "FakeEmployee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FakeEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "TicketCategory" NOT NULL,
    "severity" "TicketSeverity" NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "assignedToUserId" TEXT,
    "investigationNotes" TEXT,
    "resolution" TEXT,
    "resolutionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportedEmail" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "toEmployeeId" TEXT,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "attachmentName" TEXT,
    "linkUrl" TEXT,

    CONSTRAINT "ReportedEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogEvent" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "sourceType" "LogSourceType" NOT NULL,
    "employeeId" TEXT,
    "eventSummary" TEXT NOT NULL,
    "rawLogLine" TEXT NOT NULL,
    "relatedTicketId" TEXT,

    CONSTRAINT "LogEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FakeEmployee_email_key" ON "FakeEmployee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_ticketNumber_key" ON "Ticket"("ticketNumber");

-- CreateIndex
CREATE INDEX "Ticket_assignedToUserId_idx" ON "Ticket"("assignedToUserId");

-- CreateIndex
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ReportedEmail_ticketId_key" ON "ReportedEmail"("ticketId");

-- CreateIndex
CREATE INDEX "LogEvent_relatedTicketId_idx" ON "LogEvent"("relatedTicketId");

-- CreateIndex
CREATE INDEX "LogEvent_sourceType_idx" ON "LogEvent"("sourceType");

-- CreateIndex
CREATE INDEX "LogEvent_employeeId_idx" ON "LogEvent"("employeeId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportedEmail" ADD CONSTRAINT "ReportedEmail_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportedEmail" ADD CONSTRAINT "ReportedEmail_toEmployeeId_fkey" FOREIGN KEY ("toEmployeeId") REFERENCES "FakeEmployee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogEvent" ADD CONSTRAINT "LogEvent_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "FakeEmployee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogEvent" ADD CONSTRAINT "LogEvent_relatedTicketId_fkey" FOREIGN KEY ("relatedTicketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

