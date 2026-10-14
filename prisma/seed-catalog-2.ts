/**
 * RISE Hub 2.0 initial catalog: 13 markets and 23 initiatives only.
 * Non-destructive and idempotent: no delete/update of existing rows.
 * Do NOT run on the RISE Hub 1.0 database.
 * Requires an explicit RISE_HUB_2_SEED=YES safeguard.
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const markets = [
  [
    "AT",
    "Austria"
  ],
  [
    "BE",
    "Belgium"
  ],
  [
    "CZ",
    "Czech Republic"
  ],
  [
    "FR",
    "France"
  ],
  [
    "DE",
    "Germany"
  ],
  [
    "IE",
    "Ireland"
  ],
  [
    "IT",
    "Italy"
  ],
  [
    "NL",
    "Netherlands"
  ],
  [
    "PL",
    "Poland"
  ],
  [
    "SK",
    "Slovakia"
  ],
  [
    "ES",
    "Spain"
  ],
  [
    "SE",
    "Sweden"
  ],
  [
    "UK",
    "United Kingdom"
  ]
] as const;
const initiativeNames = [
  "Aftersales - Personnel",
  "Aftersales Processes",
  "Automated Stock Advertising",
  "Aftersales - GDAS",
  "Customer Offer Creator",
  "AI-trade-in price checker",
  "AI vehicle check-in at service point",
  "Used Car Growth Strategy",
  "Refurbishment & Revitalization",
  "Additional Business: UC in Showroom",
  "SKODA Rent",
  "Additional Business: Shop-in-Shop",
  "Change flexibility & upselling (next KAP)",
  "Human Touch | People Excellence Hire",
  "Business Excellence",
  "Digital at Retail | AI Campaign Studio",
  "Dealer Website",
  "Retail Sales Standard Reductions",
  "Capacity Planning Tool",
  "Aftersales formats (service factory)",
  "Hub & Satellite in Sales",
  "Green Retail",
  "AI Inbound & Outbound Calls"
] as const;

async function main() {
  if (process.env.RISE_HUB_2_SEED !== "YES") {
    throw new Error("Set RISE_HUB_2_SEED=YES only after verifying DATABASE_URL points to RISE Hub 2.0.");
  }
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is missing");
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    let addedMarkets = 0;
    let addedInitiatives = 0;
    for (const [code, name] of markets) {
      const existing = await prisma.market.findUnique({ where: { code } });
      if (!existing) {
        await prisma.market.create({ data: { code, name, region: "", lead: "", status: "ON_TRACK" } });
        addedMarkets++;
      }
    }
    for (const name of initiativeNames) {
      const existing = await prisma.initiative.findFirst({ where: { name } });
      if (!existing) {
        await prisma.initiative.create({ data: { name, description: "", owner: "", status: "ON_TRACK", progress: 0 } });
        addedInitiatives++;
      }
    }
    console.log(`Catalog ready: ${markets.length} markets (${addedMarkets} new) and ${initiativeNames.length} initiatives (${addedInitiatives} new).`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
