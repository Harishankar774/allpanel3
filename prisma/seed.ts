import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPass = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@allpanel.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@allpanel.com",
      phone: "9999999999",
      password: adminPass,
      role: "ADMIN",
      balance: 100000,
      referralCode: "ADMIN001",
    },
  });

  // Create demo user
  const demoPass = await bcrypt.hash("demo123", 12);
  await prisma.user.upsert({
    where: { email: "demo@allpanel.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@allpanel.com",
      phone: "8888888888",
      password: demoPass,
      role: "USER",
      balance: 1500,
      referralCode: "DEMO001",
    },
  });

  // Create matches
  const matches = [
    { sport: "Cricket", name: "Warriors v Kwazulu Natal Inland", teamA: "Warriors", teamB: "Kwazulu Natal Inland", oddsA: 1.22, oddsALay: 1.23, oddsB: 5.3, oddsBLay: 5.5, isLive: true, isLocked: false, status: "LIVE", startTime: new Date("2026-03-21T13:30:00") },
    { sport: "Cricket", name: "Indian Premier League", teamA: "Team A", teamB: "Team B", oddsA: null, oddsALay: null, oddsB: null, oddsBLay: null, isLive: true, isLocked: true, status: "LIVE", startTime: new Date("2026-03-28T19:30:00") },
    { sport: "Cricket", name: "Boland v Lions", teamA: "Boland", teamB: "Lions", oddsA: 2.92, oddsALay: 2.96, oddsB: 1.51, oddsBLay: 1.52, isLive: false, isLocked: false, status: "UPCOMING", startTime: new Date("2026-03-21T16:30:00") },
    { sport: "Cricket", name: "West Indies W v Australia W", teamA: "West Indies W", teamB: "Australia W", oddsA: 13.5, oddsALay: 15.5, oddsB: 1.07, oddsBLay: 1.08, isLive: false, isLocked: false, status: "UPCOMING", startTime: new Date("2026-03-21T23:30:00") },
    { sport: "Cricket", name: "RC Bengaluru v Sunrisers Hyderabad", teamA: "RC Bengaluru", teamB: "Sunrisers Hyderabad", oddsA: 1.82, oddsALay: 1.91, oddsB: 2.08, oddsBLay: 2.22, isLive: false, isLocked: false, status: "UPCOMING", startTime: new Date("2026-03-28T19:30:00") },
    { sport: "Cricket", name: "Mumbai Indians v Kolkata Knight Riders", teamA: "Mumbai Indians", teamB: "Kolkata Knight Riders", oddsA: 1.64, oddsALay: 1.65, oddsB: 2.52, oddsBLay: 2.58, isLive: false, isLocked: false, status: "UPCOMING", startTime: new Date("2026-03-29T18:30:00") },
    { sport: "Football", name: "Brighton v Liverpool", teamA: "Brighton", teamB: "Liverpool", oddsA: 4.2, oddsALay: 4.4, oddsDraw: 3.5, oddsB: 1.9, oddsBLay: 1.95, isLive: true, isLocked: false, status: "LIVE", startTime: new Date("2026-03-21T20:45:00") },
    { sport: "Football", name: "Bayern Munich v Union Berlin", teamA: "Bayern Munich", teamB: "Union Berlin", oddsA: 1.35, oddsALay: 1.38, oddsDraw: 5.5, oddsB: 8.0, oddsBLay: 8.5, isLive: true, isLocked: false, status: "LIVE", startTime: new Date("2026-03-21T17:30:00") },
    { sport: "Tennis", name: "Ivan Kolenciak v Zdenek Luksa", teamA: "Ivan Kolenciak", teamB: "Zdenek Luksa", oddsA: 1.45, oddsALay: 1.48, oddsB: 2.8, oddsBLay: 2.9, isLive: true, isLocked: false, status: "LIVE", startTime: new Date("2026-03-21T14:00:00") },
  ];

  await prisma.match.deleteMany();
  for (const match of matches) {
    await prisma.match.create({ data: match as any });
  }

  console.log("Database seeded successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
