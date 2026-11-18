const prisma = require("../config/prisma");

async function main() {
  console.log("\n=== PRUEBA DE CONEXIÓN PRISMA ===");

  const [docentes, alumnos, asignaturas] = await Promise.all([
    prisma.docente.findMany({
      select: { num_cuenta: true, nombre: true, apellidos: true },
      take: 10,
    }),
    prisma.alumno.findMany({
      select: { num_cuenta: true, nombre: true, apellidos: true },
      take: 10,
    }),
    prisma.asignatura.findMany({
      select: { codigo: true, nombre: true },
      take: 10,
    }),
  ]);

  if (docentes.length === 0) {
    console.log("No existen docentes registrados.");
  } else {
    console.log("Docentes:");
    console.table(docentes);
  }

  if (alumnos.length === 0) {
    console.log("No existen alumnos registrados.");
  } else {
    console.log("Alumnos:");
    console.table(alumnos);
  }

  if (asignaturas.length === 0) {
    console.log("No existen asignaturas registradas.");
  } else {
    console.log("Asignaturas:");
    console.table(asignaturas);
  }
}

main()
  .catch((error) => {
    console.error("Error al consultar la base de datos:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("\nConexión cerrada correctamente.");
  });
