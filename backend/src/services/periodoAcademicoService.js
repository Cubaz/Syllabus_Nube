const { prisma } = require("../models");
const AppError = require("../utils/AppError");

const requiredFields = ["anio", "semestre", "fecha_inicio", "fecha_fin"];

const getAllPeriodosAcademicos = async () => prisma.periodo_academico.findMany({ orderBy: { id_periodo: "asc" } });

const getPeriodoAcademicoById = async (id_periodo) => {
  const periodo = await prisma.periodo_academico.findUnique({ where: { id_periodo: Number(id_periodo) } });
  if (!periodo) throw new AppError("Periodo académico no encontrado", 404);
  return periodo;
};

const createPeriodoAcademico = async (payload) => {
  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
      throw new AppError(`El campo ${field} es obligatorio`, 400);
    }
  }

  if (new Date(payload.fecha_inicio) > new Date(payload.fecha_fin)) {
    throw new AppError("La fecha de inicio no puede ser posterior a la fecha de fin", 400);
  }

  return prisma.periodo_academico.create({ data: payload });
};

const updatePeriodoAcademico = async (id_periodo, payload) => {
  await getPeriodoAcademicoById(id_periodo);
  const { id_periodo: _id_periodo, ...rest } = payload;

  if (rest.fecha_inicio && rest.fecha_fin && new Date(rest.fecha_inicio) > new Date(rest.fecha_fin)) {
    throw new AppError("La fecha de inicio no puede ser posterior a la fecha de fin", 400);
  }

  return prisma.periodo_academico.update({
    where: { id_periodo: Number(id_periodo) },
    data: rest,
  });
};

const deletePeriodoAcademico = async (id_periodo) => {
  await getPeriodoAcademicoById(id_periodo);

  const dependencias = await prisma.grupo.count({
    where: { id_periodo: Number(id_periodo) },
  });

  if (dependencias > 0) {
    throw new AppError("No se puede eliminar el periodo académico porque tiene grupos asociados", 400);
  }

  await prisma.periodo_academico.delete({ where: { id_periodo: Number(id_periodo) } });
  return { message: "Periodo académico eliminado correctamente" };
};

module.exports = {
  getAllPeriodosAcademicos,
  getPeriodoAcademicoById,
  createPeriodoAcademico,
  updatePeriodoAcademico,
  deletePeriodoAcademico,
};
