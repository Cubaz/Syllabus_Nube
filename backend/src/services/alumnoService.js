const { prisma } = require("../models");
const AppError = require("../utils/AppError");

const requiredFields = ["num_cuenta", "nombre", "apellidos"];

const getAllAlumnos = async () => prisma.alumno.findMany({ orderBy: { num_cuenta: "asc" } });

const getAlumnoById = async (num_cuenta) => {
  const alumno = await prisma.alumno.findUnique({ where: { num_cuenta } });
  if (!alumno) throw new AppError("Alumno no encontrado", 404);
  return alumno;
};

const createAlumno = async (payload) => {
  for (const field of requiredFields) {
    if (!payload[field]) throw new AppError(`El campo ${field} es obligatorio`, 400);
  }

  return prisma.alumno.create({ data: payload });
};

const updateAlumno = async (num_cuenta, payload) => {
  await getAlumnoById(num_cuenta);
  const { num_cuenta: _num_cuenta, ...rest } = payload;
  return prisma.alumno.update({ where: { num_cuenta }, data: rest });
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
