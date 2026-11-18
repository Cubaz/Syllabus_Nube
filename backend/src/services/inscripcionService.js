const { prisma } = require("../models");
const AppError = require("../utils/AppError");

const requiredFields = ["num_cuenta_alumno", "id_grupo"];

const getAllInscripciones = async () => prisma.inscripcion.findMany({
  include: {
    alumno: true,
    grupo: {
      include: {
        periodo_academico: true,
        programa_asignatura: {
          include: {
            asignatura: true,
            programa_academico: true,
          },
        },
      },
    },
  },
  orderBy: { id_inscripcion: "asc" },
});

const getInscripcionById = async (id_inscripcion) => {
  const inscripcion = await prisma.inscripcion.findUnique({
    where: { id_inscripcion: Number(id_inscripcion) },
    include: {
      alumno: true,
      grupo: {
        include: {
          periodo_academico: true,
          programa_asignatura: {
            include: {
              asignatura: true,
              programa_academico: true,
            },
          },
        },
      },
    },
  });

  if (!inscripcion) throw new AppError("Inscripción no encontrada", 404);
  return inscripcion;
};

const createInscripcion = async (payload) => {
  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
      throw new AppError(`El campo ${field} es obligatorio`, 400);
    }
  }

  const alumnoExiste = await prisma.alumno.findUnique({ where: { num_cuenta: payload.num_cuenta_alumno } });
  if (!alumnoExiste) throw new AppError("El alumno especificado no existe", 400);

  const grupoExiste = await prisma.grupo.findUnique({ where: { id_grupo: Number(payload.id_grupo) } });
  if (!grupoExiste) throw new AppError("El grupo especificado no existe", 400);

  const mismaAsignatura = await prisma.inscripcion.findFirst({
    where: {
      num_cuenta_alumno: payload.num_cuenta_alumno,
      grupo: {
        id_periodo: grupoExiste.id_periodo,
        codigo_asignatura: grupoExiste.codigo_asignatura,
      },
    },
  });

  if (mismaAsignatura) {
    throw new AppError("El alumno ya está inscrito en la misma asignatura dentro del mismo periodo", 400);
  }

  const cantidadEnPeriodo = await prisma.inscripcion.count({
    where: {
      num_cuenta_alumno: payload.num_cuenta_alumno,
      grupo: {
        id_periodo: grupoExiste.id_periodo,
      },
    },
  });

  if (cantidadEnPeriodo >= 8) {
    throw new AppError("El alumno no puede cursar más de ocho asignaturas por periodo", 400);
  }

  if (payload.calificacion_final !== undefined && payload.calificacion_final !== null) {
    const valor = Number(payload.calificacion_final);
    if (Number.isNaN(valor) || valor < 0 || valor > 10) {
      throw new AppError("La calificación final debe estar entre 0 y 10", 400);
    }

    payload.calificacion_final = valor;
  }

  return prisma.inscripcion.create({
    data: {
      num_cuenta_alumno: payload.num_cuenta_alumno,
      id_grupo: Number(payload.id_grupo),
      calificacion_final: payload.calificacion_final !== undefined ? payload.calificacion_final : null,
    },
  });
};

const updateInscripcion = async (id_inscripcion, payload) => {
  await getInscripcionById(id_inscripcion);

  if (payload.calificacion_final !== undefined && payload.calificacion_final !== null) {
    const valor = Number(payload.calificacion_final);
    if (Number.isNaN(valor) || valor < 0 || valor > 10) {
      throw new AppError("La calificación final debe estar entre 0 y 10", 400);
    }
    payload.calificacion_final = valor;
  }

  const { id_inscripcion: _id_inscripcion, ...rest } = payload;
  return prisma.inscripcion.update({
    where: { id_inscripcion: Number(id_inscripcion) },
    data: rest,
  });
};

const deleteInscripcion = async (id_inscripcion) => {
  await getInscripcionById(id_inscripcion);
  await prisma.inscripcion.delete({ where: { id_inscripcion: Number(id_inscripcion) } });
  return { message: "Inscripción eliminada correctamente" };
};

module.exports = {
  getAllInscripciones,
  getInscripcionById,
  createInscripcion,
  updateInscripcion,
  deleteInscripcion,
};
