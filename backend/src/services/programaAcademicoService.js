const { prisma } = require("../models");
const AppError = require("../utils/AppError");

const requiredFields = ["nombre"];

const getAllProgramasAcademicos = async () => prisma.programa_academico.findMany({ orderBy: { id_programa: "asc" } });

const getProgramaAcademicoById = async (id_programa) => {
  const programa = await prisma.programa_academico.findUnique({ where: { id_programa: Number(id_programa) } });
  if (!programa) throw new AppError("Programa académico no encontrado", 404);
  return programa;
};

const createProgramaAcademico = async (payload) => {
  for (const field of requiredFields) {
    if (!payload[field]) throw new AppError(`El campo ${field} es obligatorio`, 400);
  }

  return prisma.programa_academico.create({ data: payload });
};

const updateProgramaAcademico = async (id_programa, payload) => {
  await getProgramaAcademicoById(id_programa);
  const { id_programa: _id_programa, ...rest } = payload;
  return prisma.programa_academico.update({
    where: { id_programa: Number(id_programa) },
    data: rest,
  });
};

const deleteProgramaAcademico = async (id_programa) => {
  await getProgramaAcademicoById(id_programa);

  const dependencias = await prisma.programa_asignatura.count({
    where: { id_programa: Number(id_programa) },
  });

  if (dependencias > 0) {
    throw new AppError("No se puede eliminar el programa académico porque tiene asignaturas asociadas", 400);
  }

  await prisma.programa_academico.delete({ where: { id_programa: Number(id_programa) } });
  return { message: "Programa académico eliminado correctamente" };
};

module.exports = {
  getAllProgramasAcademicos,
  getProgramaAcademicoById,
  createProgramaAcademico,
  updateProgramaAcademico,
  deleteProgramaAcademico,
};
