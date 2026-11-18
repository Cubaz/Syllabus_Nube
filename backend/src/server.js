const app = require("./app");
const prisma = require("./config/prisma");

const PORT = Number(process.env.PORT || 3000);

const server = app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});

const shutdown = () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 5000).unref();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
