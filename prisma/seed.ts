import "dotenv/config";
import { randomUUID } from "crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const db = new PrismaClient({ adapter });

async function main() {
  await db.stampEvent.deleteMany();
  await db.pass.deleteMany();
  await db.loyaltyProgram.deleteMany();
  await db.merchant.deleteMany();

  const apiKey = randomUUID();

  const merchant = await db.merchant.create({
    data: {
      businessName: "Demo Coffee Shop",
      slug: "demo-coffee",
      apiKey,
      loyaltyPrograms: {
        create: {
          programName: "Coffee Card",
          stampThreshold: 10,
          rewardDescription: "Free coffee on us!",
          passes: {
            create: [
              { customerIdentifier: "customer-1" },
              { customerIdentifier: "customer-2" },
            ],
          },
        },
      },
    },
    include: {
      loyaltyPrograms: {
        include: { passes: true },
      },
    },
  });

  const program = merchant.loyaltyPrograms[0];

  console.log("Seed complete:");
  console.log(`  Merchant ID:  ${merchant.id}`);
  console.log(`  API Key:      ${apiKey}`);
  console.log(`  Program ID:   ${program.id}`);
  console.log("  Pass IDs:");
  for (const pass of program.passes) {
    console.log(`    ${pass.customerIdentifier}: ${pass.id}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
