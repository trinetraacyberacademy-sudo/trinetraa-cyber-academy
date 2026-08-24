-- AlterEnum
BEGIN;
CREATE TYPE "RegistrationStatus_new" AS ENUM ('PENDING_PAYMENT', 'PAID', 'FAILED', 'REFUNDED');
ALTER TABLE "public"."Registration" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Registration" ALTER COLUMN "status" TYPE "RegistrationStatus_new" USING ("status"::text::"RegistrationStatus_new");
ALTER TYPE "RegistrationStatus" RENAME TO "RegistrationStatus_old";
ALTER TYPE "RegistrationStatus_new" RENAME TO "RegistrationStatus";
DROP TYPE "public"."RegistrationStatus_old";
ALTER TABLE "Registration" ALTER COLUMN "status" SET DEFAULT 'PENDING_PAYMENT';
COMMIT;

-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "paymentNote",
DROP COLUMN "paymentScreenshotUrl",
ADD COLUMN     "amountPaid" INTEGER,
ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT,
ADD COLUMN     "razorpaySignature" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Registration_razorpayOrderId_key" ON "Registration"("razorpayOrderId");

