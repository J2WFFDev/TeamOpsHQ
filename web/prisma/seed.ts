// prisma/seed.ts
import { prisma } from "@/lib/prisma";

async function main() {
  // Org
  const org = await prisma.org.upsert({
    where: { slug: "rifle-org" },
    update: {},
    create: { name: "Rifle Org", slug: "rifle-org", timezone: "UTC" },
  });

  // User
  const user = await prisma.user.upsert({
    where: { email: "parent@example.com" },
    update: {},
    create: {
      email: "parent@example.com",
      displayName: "Pat Parent",
      orgId: org.id,
      tz: "UTC",
    },
  });

  // Team (find or create)
  let team = await prisma.team.findFirst({ where: { name: "Rifle A" } });
  if (!team) {
    team = await prisma.team.create({ data: { name: "Rifle A", color: "blue", programId: null } });
  }

  // Sample Element (task)
  const element = await prisma.element.create({
    data: {
      type: "task",
      title: "Seed Task: Check gear",
      status: "open",
      priority: 2,
      quickRef: false,
      createdBy: user.id,
      detailsJson: { $type: "task", $v: 1, assignees: [], checklist: [] },
    },
  });

  // CalendarEvent for the element
  await prisma.calendarEvent.create({
    data: {
      elementId: element.id,
      startAt: new Date(Date.now() + 60 * 60 * 1000),
      endAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      locationName: "Range 1",
      recurrence: null,
      visibility: "team",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
