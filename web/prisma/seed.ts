// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Team
  const team = await prisma.team.upsert({
    where: { name: "Rifle A" },
    update: {},
    create: { name: "Rifle A" },
  });

  // User (parent)
  const user = await prisma.user.upsert({
    where: { email: "parent@example.com" },
    update: {},
    create: {
      email: "parent@example.com",
      name: "Pat Parent",
      role: Role.PARENT,
      password: "hashed_dummy", // TODO: replace with real hash later
    },
  });

  // Membership (unique on [userId, teamId])
  await prisma.membership.upsert({
    where: { userId_teamId: { userId: user.id, teamId: team.id } },
    update: {},
    create: { userId: user.id, teamId: team.id, role: Role.PARENT },
  });

  // Athlete
  await prisma.athlete.upsert({
    where: { id: "seed-athlete-1" },
    update: {},
    create: {
      id: "seed-athlete-1",
      firstName: "Alex",
      lastName: "Sharps",
      teamId: team.id,
      parentId: user.id,
    },
  });

  // Event
  await prisma.event.create({
    data: {
      teamId: team.id,
      title: "Practice",
      startsAt: new Date(Date.now() + 60 * 60 * 1000),
      endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      location: "Range 1",
      notes: "Bring eye/ear protection",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
