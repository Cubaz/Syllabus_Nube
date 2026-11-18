const { prisma } = require("../models");
const AppError = require("../utils/AppError");

const requiredFields = ["num_cuenta", "nombre", "apellidos"];

const normalizeData = (payload = {}) => {
  const data = { ...payload };
  delete data.num_cuenta;
  return data;
};

const getAllDocentes = async () => prisma.docente.findMany({ orderBy: { num_cuenta: "asc" } });

const getDocenteById = async (num_cuenta) => {
  const docente = await prisma.docente.findUnique({ where: { num_cuenta } });
  if (!docente) throw new AppError("Docente no encontrado", 404);
  return docente;
};

const createDocente = async (payload) => {
  for (const field of requiredFields) {
    if (!payload[field]) throw new AppError(`El campo ${field} es obligatorio`, 400);
  }

  return prisma.docente.create({ data: payload });
};

const updateDocente = async (num_cuenta, payload) => {
  await getDocenteById(num_cuenta);
  return prisma.docente.update({
    where: { num_cuenta },
    data: normalizeData(payload),
  });
};

const deleteDocente = async (num_cuenta) => {
  await getDocenteById(num_cuenta);

  const gruposRelacionados = await prisma.grupo.count({
    where: { num_cuenta_docente: num_cuenta },
  });

  if (gruposRelacionados > 0) {
    throw new AppError("No se puede eliminar el docente porque tiene grupos asociados", 400);
  }

  await prisma.docente.delete({ where: { num_cuenta } });
  return { message: "Docente eliminado correctamente" };
};

module.exports = {
  getAllDocentes,
  getDocenteById,
  createDocente,
  updateDocente,
  deleteDocente,
};
