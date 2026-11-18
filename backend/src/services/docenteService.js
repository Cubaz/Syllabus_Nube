const { prisma } = require("../models");
const AppError = require("../utils/AppError");
const { assertRules, buildData, omit } = require("../utils/validation");

const schema = {
  num_cuenta: { label: "número de cuenta", required: true },
  nombre: { label: "nombre", required: true },
  apellidos: { label: "apellidos", required: true },
  direccion: { label: "dirección" },
  sindicalizado: { label: "sindicalizado", type: "boolean" },
  correo_personal: { label: "correo personal", transform: "lower" },
  correo_institucional: { label: "correo institucional", transform: "lower" },
  telefono: { label: "teléfono" },
  nss: { label: "NSS" },
  curp: { label: "CURP", transform: "upper" },
};

const updateSchema = omit(schema, "num_cuenta");

const getAllDocentes = async () => prisma.docente.findMany({ orderBy: { num_cuenta: "asc" } });

const getDocenteById = async (num_cuenta) => {
  const docente = await prisma.docente.findUnique({ where: { num_cuenta } });
  if (!docente) throw new AppError("Docente no encontrado", 404);
  return docente;
};

const withDefaults = (data) => ({ ...data, sindicalizado: data.sindicalizado ?? false });

const createDocente = async (payload) => {
  const data = withDefaults(buildData(payload, schema));
  assertRules("docente", data);
  return prisma.docente.create({ data });
};

const updateDocente = async (num_cuenta, payload) => {
  const docente = await getDocenteById(num_cuenta);
  const data = buildData(payload, updateSchema, { partial: true });
  if (data.sindicalizado === null) data.sindicalizado = false;
  assertRules("docente", { ...docente, ...data });

  return prisma.docente.update({ where: { num_cuenta }, data });
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
