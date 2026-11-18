require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const globalForPrisma = globalThis;
const connectionString = process.env.DATABASE_URL;

if (!globalForPrisma.__prisma) {
  const adapter = connectionString
    ? new PrismaPg({
        connectionString,
        ssl: connectionString.includes("supabase.co")
          ? { rejectUnauthorized: false }
          : undefined,
      })
    : undefined;

  globalForPrisma.__prisma = new PrismaClient(
    adapter ? { adapter } : undefined,
  );
}

module.exports = globalForPrisma.__prisma;
