const { prisma } = require("../models");
const AppError = require("../utils/AppError");
const { assertRules, buildData, parseId } = require("../utils/validation");

const schema = {
  nombre: { label: "nombre", required: true },
  descripcion: { label: "descripción" },
};

const getAllProgramasAcademicos = async () =>
  prisma.programa_academico.findMany({
    include: { programa_asignatura: { include: { asignatura: true } } },
    orderBy: { id_programa: "asc" },
  });

const getProgramaAcademicoById = async (id_programa) => {
  const programa = await prisma.programa_academico.findUnique({
    where: { id_programa: parseId(id_programa, "ID del programa") },
  });
  if (!programa) throw new AppError("Programa académico no encontrado", 404);
  return programa;
};

const createProgramaAcademico = async (payload) => {
  const data = buildData(payload, schema);
  assertRules("programa_academico", data);
  return prisma.programa_academico.create({ data });
};

const updateProgramaAcademico = async (id_programa, payload) => {
  const programa = await getProgramaAcademicoById(id_programa);
  const data = buildData(payload, schema, { partial: true });
  assertRules("programa_academico", { ...programa, ...data });
  return prisma.programa_academico.update({
    where: { id_programa: programa.id_programa },
    data,
  });
};

const deleteProgramaAcademico = async (id_programa) => {
  const programa = await getProgramaAcademicoById(id_programa);

  const dependencias = await prisma.programa_asignatura.count({
    where: { id_programa: programa.id_programa },
  });

  if (dependencias > 0) {
    throw new AppError("No se puede eliminar el programa académico porque tiene asignaturas asociadas", 400);
  }

  await prisma.programa_academico.delete({ where: { id_programa: programa.id_programa } });
  return { message: "Programa académico eliminado correctamente" };
};

module.exports = {
  getAllProgramasAcademicos,
  getProgramaAcademicoById,
  createProgramaAcademico,
  updateProgramaAcademico,
  deleteProgramaAcademico,
};
