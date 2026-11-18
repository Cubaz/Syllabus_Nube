require("dotenv").config({ quiet: true });

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Falta la variable DATABASE_URL. Configúrala en backend/.env (ver backend/.env.example).");
}

const globalForPrisma = globalThis;

if (!globalForPrisma.__prisma) {
  const adapter = new PrismaPg({
    connectionString,
    ssl: connectionString.includes("supabase.co")
      ? { rejectUnauthorized: false }
      : undefined,
  });

  globalForPrisma.__prisma = new PrismaClient({ adapter });
}

module.exports = globalForPrisma.__prisma;
