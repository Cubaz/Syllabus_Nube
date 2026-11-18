const { prisma } = require("../models");
const AppError = require("../utils/AppError");
const { assertRules, buildData, omit } = require("../utils/validation");

const schema = {
  num_cuenta: { label: "número de cuenta", required: true },
  nombre: { label: "nombre", required: true },
  apellidos: { label: "apellidos", required: true },
  direccion: { label: "dirección" },
  telefono: { label: "teléfono" },
  correo_personal: { label: "correo personal", transform: "lower" },
  correo_institucional: { label: "correo institucional", transform: "lower" },
  nss: { label: "NSS" },
  curp: { label: "CURP", transform: "upper" },
};

const updateSchema = omit(schema, "num_cuenta");

const getAllAlumnos = async () => prisma.alumno.findMany({ orderBy: { num_cuenta: "asc" } });

const getAlumnoById = async (num_cuenta) => {
  const alumno = await prisma.alumno.findUnique({ where: { num_cuenta } });
  if (!alumno) throw new AppError("Alumno no encontrado", 404);
  return alumno;
};

const createAlumno = async (payload) => {
  const data = buildData(payload, schema);
  assertRules("alumno", data);
  return prisma.alumno.create({ data });
};

const updateAlumno = async (num_cuenta, payload) => {
  const alumno = await getAlumnoById(num_cuenta);
  const data = buildData(payload, updateSchema, { partial: true });
  assertRules("alumno", { ...alumno, ...data });
  return prisma.alumno.update({ where: { num_cuenta }, data });
};

const deleteAlumno = async (num_cuenta) => {
  await getAlumnoById(num_cuenta);

  const inscripcionesRelacionadas = await prisma.inscripcion.count({
    where: { num_cuenta_alumno: num_cuenta },
  });

  if (inscripcionesRelacionadas > 0) {
    throw new AppError("No se puede eliminar el alumno porque tiene inscripciones asociadas", 400);
  }

  await prisma.alumno.delete({ where: { num_cuenta } });
  return { message: "Alumno eliminado correctamente" };
};

module.exports = {
  getAllAlumnos,
  getAlumnoById,
  createAlumno,
  updateAlumno,
  deleteAlumno,
};
