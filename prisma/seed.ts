import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@trinetraa.in";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Trinetraa@Admin123";
const ADMIN_NAME = process.env.ADMIN_NAME ?? "Trinetraa Admin";
const ADMIN_PHONE = process.env.ADMIN_PHONE ?? "+91 80550 77088";

async function main() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.warn(
      "⚠️  ADMIN_EMAIL / ADMIN_PASSWORD not set in .env — using default placeholder admin credentials.\n" +
        "   Set them in .env before seeding a real environment.",
    );
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE,
      passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`Admin user ready: ${admin.email}`);

  const socProgram = await prisma.course.upsert({
    where: { slug: "soc-analyst-program" },
    update: {
      title: "SOC Analyst Training + Internship Program",
      price: 5999,
      originalPrice: 9999,
      format: "6 Months · Mon–Fri · Live Online",
      description:
        "A 6-month live SOC Analyst training + internship program with hands-on access to Splunk, CrowdStrike Falcon, Azure/Entra ID, and Mimecast — plus a real incident ticket queue, internship track, and placement support.",
      isActive: true,
    },
    create: {
      slug: "soc-analyst-program",
      title: "SOC Analyst Training + Internship Program",
      price: 5999,
      originalPrice: 9999,
      format: "6 Months · Mon–Fri · Live Online",
      description:
        "A 6-month live SOC Analyst training + internship program with hands-on access to Splunk, CrowdStrike Falcon, Azure/Entra ID, and Mimecast — plus a real incident ticket queue, internship track, and placement support.",
      isActive: true,
    },
  });

  const workshop = await prisma.course.upsert({
    where: { slug: "workshop" },
    update: {
      title: "3-Day Live SOC Workshop",
      price: 499,
      originalPrice: null,
      format: "3 Days · 2 hrs/day · Live Online",
      description:
        "A fast, hands-on 3-day preview of real SOC analyst work — live sessions, a real alert-triage demo inside SOC tools, and a certificate of participation.",
      isActive: true,
    },
    create: {
      slug: "workshop",
      title: "3-Day Live SOC Workshop",
      price: 499,
      originalPrice: null,
      format: "3 Days · 2 hrs/day · Live Online",
      description:
        "A fast, hands-on 3-day preview of real SOC analyst work — live sessions, a real alert-triage demo inside SOC tools, and a certificate of participation.",
      isActive: true,
    },
  });

  console.log(`Courses ready: ${socProgram.title}, ${workshop.title}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
