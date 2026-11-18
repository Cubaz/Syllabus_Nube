const AppError = require("./AppError");

const uniqueMessages = [
  ["alumno_pkey", "Ya existe un alumno con ese número de cuenta"],
  ["docente_pkey", "Ya existe un docente con ese número de cuenta"],
  ["asignatura_pkey", "Ya existe una asignatura con ese código"],
  ["correo_personal", "El correo personal ya está registrado"],
  ["correo_institucional", "El correo institucional ya está registrado"],
  ["nss", "El NSS ya está registrado"],
  ["curp", "La CURP ya está registrada"],
  ["programa_academico_nombre", "Ya existe un programa académico con ese nombre"],
  ["uq_periodo", "Ya existe un periodo con ese año y semestre"],
  ["uq_grupo_periodo", "Ya existe un grupo con esa clave en el periodo seleccionado"],
  ["uq_alumno_grupo", "El alumno ya está inscrito en ese grupo"],
];

const foreignKeyMessages = [
  ["fk_grupo_docente", "El docente especificado no existe"],
  ["fk_grupo_periodo", "El periodo académico especificado no existe"],
  ["fk_grupo_programa_asignatura", "La asignatura no pertenece al programa académico seleccionado"],
  ["fk_inscripcion_alumno", "El alumno especificado no existe"],
  ["fk_inscripcion_grupo", "El grupo especificado no existe"],
];

const checkMessages = [
  ["curp", "La CURP debe tener exactamente 18 caracteres"],
  ["chk_asignatura_creditos", "Los créditos deben ser mayores a 0"],
  ["chk_asignatura_horas", "Las horas semanales deben ser mayores a 0"],
  ["chk_periodo_semestre", "El semestre debe ser 1 o 2"],
  ["chk_periodo_fechas", "La fecha de fin debe ser posterior a la fecha de inicio"],
  ["chk_calificacion", "La calificación final debe estar entre 0 y 10"],
];

const findMessage = (messages, constraint, fallback) => {
  if (!constraint) return fallback;
  const match = messages.find(([fragment]) => constraint.includes(fragment));
  return match ? match[1] : fallback;
};

const getDriverCause = (error) => error.meta?.driverAdapterError?.cause || {};

const getConstraint = (error) => {
  const cause = getDriverCause(error);
  if (cause.constraint?.index) return cause.constraint.index;
  const fromMessage = /constraint "([^"]+)"/.exec(cause.originalMessage || cause.message || "");
  return fromMessage ? fromMessage[1] : null;
};

/**
 * Convierte errores de Prisma/PostgreSQL en errores con mensaje claro y
 * código HTTP adecuado. Devuelve null si el error no es de base de datos.
 */
const translatePrismaError = (error) => {
  const name = error?.constructor?.name;

  if (name === "PrismaClientValidationError") {
    return new AppError("Los datos enviados no son válidos", 400);
  }

  if (name !== "PrismaClientKnownRequestError") return null;

  const cause = getDriverCause(error);
  const constraint = getConstraint(error);

  switch (error.code) {
    case "P2002":
      return new AppError(findMessage(uniqueMessages, constraint, "Ya existe un registro con esos datos"), 409);
    case "P2003":
      return new AppError(
        findMessage(
          foreignKeyMessages,
          constraint,
          "La operación no es posible porque hace referencia a datos inexistentes o tiene registros asociados",
        ),
        400,
      );
    case "P2025":
      return new AppError("Registro no encontrado", 404);
    case "P2000":
      return new AppError("Uno de los campos excede la longitud permitida", 400);
    default:
      break;
  }

  switch (cause.originalCode) {
    case "23514":
      return new AppError(findMessage(checkMessages, constraint, "Los datos no cumplen las reglas de la base de datos"), 400);
    case "22001":
      return new AppError("Uno de los campos excede la longitud permitida", 400);
    case "P0001":
      return new AppError(cause.originalMessage || "La operación no cumple las reglas académicas", 400);
    default:
      return null;
  }
};

module.exports = translatePrismaError;
