const { prisma } = require("../models");

const getReporteCalificaciones = async () => {
  const query = `
    SELECT *
    FROM v_reporte_calificaciones
    ORDER BY anio, semestre, id_grupo, cuenta_alumno
    LIMIT 500;
  `;

  return prisma.$queryRawUnsafe(query);
};

module.exports = {
  getReporteCalificaciones,
};
