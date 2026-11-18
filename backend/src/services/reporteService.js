const { prisma } = require("../models");

const LIMITE_REGISTROS = 500;

const getReporteCalificaciones = async () => prisma.$queryRaw`
  SELECT *
  FROM v_reporte_calificaciones
  ORDER BY anio, semestre, id_grupo, cuenta_alumno
  LIMIT ${LIMITE_REGISTROS};
`;

module.exports = {
  getReporteCalificaciones,
};
