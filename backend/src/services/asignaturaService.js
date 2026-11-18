const { prisma } = require("../models");
const AppError = require("../utils/AppError");

const requiredFields = ["codigo", "nombre", "creditos", "horas_semanales"];

const getAllAsignaturas = async () => prisma.asignatura.findMany({ orderBy: { codigo: "asc" } });

const getAsignaturaById = async (codigo) => {
  const asignatura = await prisma.asignatura.findUnique({ where: { codigo } });
  if (!asignatura) throw new AppError("Asignatura no encontrada", 404);
  return asignatura;
};

const createAsignatura = async (payload) => {
  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
      throw new AppError(`El campo ${field} es obligatorio`, 400);
    }
  }

  return prisma.asignatura.create({ data: payload });
};

const updateAsignatura = async (codigo, payload) => {
  await getAsignaturaById(codigo);
  const { codigo: _codigo, ...rest } = payload;
  return prisma.asignatura.update({ where: { codigo }, data: rest });
};

const deleteAsignatura = async (codigo) => {
  await getAsignaturaById(codigo);

  const dependencias = await prisma.programa_asignatura.count({
    where: { codigo_asignatura: codigo },
  });

  if (dependencias > 0) {
    throw new AppError("No se puede eliminar la asignatura porque está asociada a programas", 400);
  }

  await prisma.asignatura.delete({ where: { codigo } });
  return { message: "Asignatura eliminada correctamente" };
};

module.exports = {
  getAllAsignaturas,
  getAsignaturaById,
  createAsignatura,
  updateAsignatura,
  deleteAsignatura,
};
