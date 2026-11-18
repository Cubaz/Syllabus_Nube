const { prisma } = require("../models");
const AppError = require("../utils/AppError");
const { assertRules, buildData, omit } = require("../utils/validation");

const schema = {
  codigo: { label: "código", required: true, transform: "upper" },
  nombre: { label: "nombre", required: true },
  creditos: { label: "créditos", type: "int", required: true },
  horas_semanales: { label: "horas semanales", type: "int", required: true },
};

const updateSchema = omit(schema, "codigo");

const getAllAsignaturas = async () =>
  prisma.asignatura.findMany({
    include: { programa_asignatura: { include: { programa_academico: true } } },
    orderBy: { codigo: "asc" },
  });

const getAsignaturaById = async (codigo) => {
  const asignatura = await prisma.asignatura.findUnique({ where: { codigo } });
  if (!asignatura) throw new AppError("Asignatura no encontrada", 404);
  return asignatura;
};

const createAsignatura = async (payload) => {
  const data = buildData(payload, schema);
  assertRules("asignatura", data);
  return prisma.asignatura.create({ data });
};

const updateAsignatura = async (codigo, payload) => {
  const asignatura = await getAsignaturaById(codigo);
  const data = buildData(payload, updateSchema, { partial: true });
  assertRules("asignatura", { ...asignatura, ...data });
  return prisma.asignatura.update({ where: { codigo }, data });
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
