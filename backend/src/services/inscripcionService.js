const { prisma } = require("../models");
const AppError = require("../utils/AppError");
const { assertRules, buildData, parseId } = require("../utils/validation");

const MAX_ASIGNATURAS_POR_PERIODO = 8;

const schema = {
  num_cuenta_alumno: { label: "alumno", required: true },
  id_grupo: { label: "grupo", type: "id", required: true },
  calificacion_final: { label: "calificación final", type: "decimal" },
};

const inscripcionInclude = {
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
};

const getAllInscripciones = async () =>
  prisma.inscripcion.findMany({
    include: inscripcionInclude,
    orderBy: { id_inscripcion: "asc" },
  });

const getInscripcionById = async (id_inscripcion) => {
  const inscripcion = await prisma.inscripcion.findUnique({
    where: { id_inscripcion: parseId(id_inscripcion, "ID de la inscripción") },
    include: inscripcionInclude,
  });

  if (!inscripcion) throw new AppError("Inscripción no encontrada", 404);
  return inscripcion;
};

// Las mismas reglas las aplica el trigger validar_inscripcion de la base de
// datos; validarlas aquí permite responder con mensajes más claros.
const assertReglasInscripcion = async ({ num_cuenta_alumno, id_grupo }, idExcluido = null) => {
  const [alumno, grupo] = await Promise.all([
    prisma.alumno.findUnique({ where: { num_cuenta: num_cuenta_alumno } }),
    prisma.grupo.findUnique({ where: { id_grupo } }),
  ]);

  if (!alumno) throw new AppError("El alumno especificado no existe", 400);
  if (!grupo) throw new AppError("El grupo especificado no existe", 400);

  const excluirActual = idExcluido === null ? {} : { id_inscripcion: { not: idExcluido } };
  const mismoPeriodo = {
    ...excluirActual,
    num_cuenta_alumno,
    grupo: { id_periodo: grupo.id_periodo },
  };

  const [mismaAsignatura, cantidadEnPeriodo] = await Promise.all([
    prisma.inscripcion.findFirst({
      where: {
        ...mismoPeriodo,
        grupo: { id_periodo: grupo.id_periodo, codigo_asignatura: grupo.codigo_asignatura },
      },
    }),
    prisma.inscripcion.count({ where: mismoPeriodo }),
  ]);

  if (mismaAsignatura) {
    throw new AppError("El alumno ya está inscrito en la misma asignatura dentro del mismo periodo", 400);
  }

  if (cantidadEnPeriodo >= MAX_ASIGNATURAS_POR_PERIODO) {
    throw new AppError("El alumno no puede cursar más de ocho asignaturas por periodo", 400);
  }
};

// El periodo del grupo se necesita para validar la fecha de captura de la calificación.
const getGrupoConPeriodo = async (id_grupo) => {
  const grupo = await prisma.grupo.findUnique({
    where: { id_grupo },
    include: { periodo_academico: true },
  });
  if (!grupo) throw new AppError("El grupo especificado no existe", 400);
  return grupo;
};

const createInscripcion = async (payload) => {
  const data = buildData(payload, schema);
  const grupo = await getGrupoConPeriodo(data.id_grupo);
  assertRules("inscripcion", { ...data, grupo });
  await assertReglasInscripcion(data);
  return prisma.inscripcion.create({ data });
};

const updateInscripcion = async (id_inscripcion, payload) => {
  const inscripcion = await getInscripcionById(id_inscripcion);
  const data = buildData(payload, schema, { partial: true });
  const grupo =
    data.id_grupo !== undefined && data.id_grupo !== inscripcion.id_grupo
      ? await getGrupoConPeriodo(data.id_grupo)
      : inscripcion.grupo;
  assertRules("inscripcion", { ...inscripcion, ...data, grupo });

  const destino = {
    num_cuenta_alumno: data.num_cuenta_alumno ?? inscripcion.num_cuenta_alumno,
    id_grupo: data.id_grupo ?? inscripcion.id_grupo,
  };
  const cambiaAsignacion =
    destino.num_cuenta_alumno !== inscripcion.num_cuenta_alumno ||
    destino.id_grupo !== inscripcion.id_grupo;

  if (cambiaAsignacion) {
    await assertReglasInscripcion(destino, inscripcion.id_inscripcion);
  }

  return prisma.inscripcion.update({
    where: { id_inscripcion: inscripcion.id_inscripcion },
    data,
  });
};

const deleteInscripcion = async (id_inscripcion) => {
  const inscripcion = await getInscripcionById(id_inscripcion);
  await prisma.inscripcion.delete({ where: { id_inscripcion: inscripcion.id_inscripcion } });
  return { message: "Inscripción eliminada correctamente" };
};

module.exports = {
  getAllInscripciones,
  getInscripcionById,
  createInscripcion,
  updateInscripcion,
  deleteInscripcion,
};
