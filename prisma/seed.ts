import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/modules/auth/password";

const prisma = new PrismaClient();

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function main() {
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hashPassword("password123");

  const alex = await prisma.user.create({
    data: {
      name: "Alex Rivera",
      email: "user@example.com",
      passwordHash,
      role: "USER",
    },
  });

  const jordan = await prisma.user.create({
    data: {
      name: "Jordan Lee",
      email: "agent@example.com",
      passwordHash,
      role: "AGENT",
    },
  });

  const sam = await prisma.user.create({
    data: {
      name: "Sam Patel",
      email: "sam@example.com",
      passwordHash,
      role: "USER",
    },
  });

  const signIn = await prisma.ticket.create({
    data: {
      title: "Cannot sign in to the billing portal",
      description: "The password reset email never arrives. I have tried twice from the billing portal.",
      status: "OPEN",
      priority: "HIGH",
      createdById: alex.id,
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
    },
  });

  const exportTimeout = await prisma.ticket.create({
    data: {
      title: "Monthly invoice export times out",
      description: "Exporting March invoices spins for about a minute and then fails with a timeout.",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      createdById: alex.id,
      assignedToId: jordan.id,
      createdAt: daysAgo(6),
      updatedAt: daysAgo(1),
    },
  });

  const duplicateAddress = await prisma.ticket.create({
    data: {
      title: "Billing address was updated twice",
      description: "The company address shows both the March and April values on the invoice PDF.",
      status: "RESOLVED",
      priority: "LOW",
      createdById: alex.id,
      assignedToId: jordan.id,
      createdAt: daysAgo(12),
      updatedAt: daysAgo(9),
    },
  });

  const mobileCrash = await prisma.ticket.create({
    data: {
      title: "Mobile app closes on the login screen",
      description: "On iOS the app closes as soon as I tap Sign in. This started after yesterday's release.",
      status: "OPEN",
      priority: "HIGH",
      createdById: sam.id,
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    },
  });

  const statement = await prisma.ticket.create({
    data: {
      title: "Please send last month's statement",
      description: "I need a PDF of the September statement for our records.",
      status: "OPEN",
      priority: "LOW",
      createdById: alex.id,
      createdAt: daysAgo(0),
      updatedAt: daysAgo(0),
    },
  });

  await prisma.comment.createMany({
    data: [
      {
        ticketId: signIn.id,
        authorId: alex.id,
        body: "The reset email never arrives. I checked spam as well.",
        visibility: "PUBLIC",
        createdAt: daysAgo(3),
      },
      {
        ticketId: exportTimeout.id,
        authorId: alex.id,
        body: "It fails the same way if I export only one week of invoices.",
        visibility: "PUBLIC",
        createdAt: daysAgo(6),
      },
      {
        ticketId: exportTimeout.id,
        authorId: jordan.id,
        body: "Reproduced on the export worker. Checking the timeout setting before I reply to the customer.",
        visibility: "INTERNAL",
        createdAt: daysAgo(1),
      },
      {
        ticketId: duplicateAddress.id,
        authorId: jordan.id,
        body: "The duplicate write was removed. The invoice now shows the April address only.",
        visibility: "PUBLIC",
        createdAt: daysAgo(9),
      },
      {
        ticketId: mobileCrash.id,
        authorId: sam.id,
        body: "It happens on the latest app build. The phone is an iPhone 14.",
        visibility: "PUBLIC",
        createdAt: daysAgo(1),
      },
      {
        ticketId: statement.id,
        authorId: alex.id,
        body: "A PDF is enough. I do not need a printed copy.",
        visibility: "PUBLIC",
        createdAt: daysAgo(0),
      },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
