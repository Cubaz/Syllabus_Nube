const { prisma } = require("../models");
const AppError = require("../utils/AppError");
const { assertRules, buildData, isFutureDate, parseId } = require("../utils/validation");

const schema = {
  clave_grupo: { label: "clave del grupo", required: true, transform: "upper" },
  num_cuenta_docente: { label: "docente", required: true },
  codigo_asignatura: { label: "asignatura", required: true, transform: "upper" },
  id_programa: { label: "programa académico", type: "id", required: true },
  id_periodo: { label: "periodo", type: "id", required: true },
};

const grupoInclude = {
  docente: true,
  periodo_academico: true,
  programa_asignatura: {
    include: {
      asignatura: true,
      programa_academico: true,
    },
  },
};

const getAllGrupos = async () =>
  prisma.grupo.findMany({ include: grupoInclude, orderBy: { id_grupo: "asc" } });

const getGrupoById = async (id_grupo) => {
  const grupo = await prisma.grupo.findUnique({
    where: { id_grupo: parseId(id_grupo, "ID del grupo") },
    include: grupoInclude,
  });

  if (!grupo) throw new AppError("Grupo no encontrado", 404);
  return grupo;
};

const assertRelaciones = async ({ num_cuenta_docente, codigo_asignatura, id_programa, id_periodo }) => {
  const [docente, periodo, programa, asignatura, relacion] = await Promise.all([
    prisma.docente.findUnique({ where: { num_cuenta: num_cuenta_docente } }),
    prisma.periodo_academico.findUnique({ where: { id_periodo } }),
    prisma.programa_academico.findUnique({ where: { id_programa } }),
    prisma.asignatura.findUnique({ where: { codigo: codigo_asignatura } }),
    prisma.programa_asignatura.findUnique({
      where: { id_programa_codigo_asignatura: { id_programa, codigo_asignatura } },
    }),
  ]);

  if (!docente) throw new AppError("El docente especificado no existe", 400);
  if (!periodo) throw new AppError("El periodo académico especificado no existe", 400);
  if (!programa) throw new AppError("El programa académico especificado no existe", 400);
  if (!asignatura) throw new AppError("La asignatura especificada no existe", 400);
  if (!relacion) {
    throw new AppError("La asignatura no pertenece al programa académico seleccionado", 400);
  }
};

const createGrupo = async (payload) => {
  const data = buildData(payload, schema);
  assertRules("grupo", data);
  await assertRelaciones(data);
  return prisma.grupo.create({ data });
};

const updateGrupo = async (id_grupo, payload) => {
  const grupo = await getGrupoById(id_grupo);
  const data = buildData(payload, schema, { partial: true });
  assertRules("grupo", { ...grupo, ...data });

  await assertRelaciones({
    num_cuenta_docente: data.num_cuenta_docente ?? grupo.num_cuenta_docente,
    codigo_asignatura: data.codigo_asignatura ?? grupo.codigo_asignatura,
    id_programa: data.id_programa ?? grupo.id_programa,
    id_periodo: data.id_periodo ?? grupo.id_periodo,
  });

  if (data.id_periodo !== undefined && data.id_periodo !== grupo.id_periodo) {
    const nuevoPeriodo = await prisma.periodo_academico.findUnique({ where: { id_periodo: data.id_periodo } });
    const calificadas = await prisma.inscripcion.count({
      where: { id_grupo: grupo.id_grupo, calificacion_final: { not: null } },
    });
    if (calificadas > 0 && isFutureDate(nuevoPeriodo.fecha_inicio)) {
      throw new AppError(
        `No se puede pasar el grupo a un periodo que aún no inicia: ya tiene ${calificadas} calificaciones capturadas`,
        400,
      );
    }
  }

  return prisma.grupo.update({
    where: { id_grupo: grupo.id_grupo },
    data,
  });
};

const deleteGrupo = async (id_grupo) => {
  const grupo = await getGrupoById(id_grupo);

  const inscripcionesRelacionadas = await prisma.inscripcion.count({
    where: { id_grupo: grupo.id_grupo },
  });

  if (inscripcionesRelacionadas > 0) {
    throw new AppError("No se puede eliminar el grupo porque tiene inscripciones asociadas", 400);
  }

  await prisma.grupo.delete({ where: { id_grupo: grupo.id_grupo } });
  return { message: "Grupo eliminado correctamente" };
};

module.exports = {
  getAllGrupos,
  getGrupoById,
  createGrupo,
  updateGrupo,
  deleteGrupo,
};
