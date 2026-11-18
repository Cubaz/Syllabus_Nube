const { prisma } = require("../models");
const AppError = require("../utils/AppError");

const requiredFields = ["clave_grupo", "num_cuenta_docente", "codigo_asignatura", "id_programa", "id_periodo"];

const getAllGrupos = async () => prisma.grupo.findMany({
  include: {
    docente: true,
    periodo_academico: true,
    programa_asignatura: {
      include: {
        asignatura: true,
        programa_academico: true,
      },
    },
  },
  orderBy: { id_grupo: "asc" },
});

const getGrupoById = async (id_grupo) => {
  const grupo = await prisma.grupo.findUnique({
    where: { id_grupo: Number(id_grupo) },
    include: {
      docente: true,
      periodo_academico: true,
      programa_asignatura: {
        include: {
          asignatura: true,
          programa_academico: true,
        },
      },
    },
  });

  if (!grupo) throw new AppError("Grupo no encontrado", 404);
  return grupo;
};

const createGrupo = async (payload) => {
  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
      throw new AppError(`El campo ${field} es obligatorio`, 400);
    }
  }

  const docenteExiste = await prisma.docente.findUnique({ where: { num_cuenta: payload.num_cuenta_docente } });
  if (!docenteExiste) throw new AppError("El docente especificado no existe", 400);

  const periodoExiste = await prisma.periodo_academico.findUnique({ where: { id_periodo: Number(payload.id_periodo) } });
  if (!periodoExiste) throw new AppError("El periodo académico especificado no existe", 400);

  const programaExiste = await prisma.programa_academico.findUnique({ where: { id_programa: Number(payload.id_programa) } });
  if (!programaExiste) throw new AppError("El programa académico especificado no existe", 400);

  const asignaturaExiste = await prisma.asignatura.findUnique({ where: { codigo: payload.codigo_asignatura } });
  if (!asignaturaExiste) throw new AppError("La asignatura especificada no existe", 400);

  const relacionProgramaAsignatura = await prisma.programa_asignatura.findUnique({
    where: {
      id_programa_codigo_asignatura: {
        id_programa: Number(payload.id_programa),
        codigo_asignatura: payload.codigo_asignatura,
      },
    },
  });

  if (!relacionProgramaAsignatura) {
    throw new AppError("La asignatura no pertenece al programa académico seleccionado", 400);
  }

  return prisma.grupo.create({
    data: {
      clave_grupo: payload.clave_grupo,
      num_cuenta_docente: payload.num_cuenta_docente,
      codigo_asignatura: payload.codigo_asignatura,
      id_programa: Number(payload.id_programa),
      id_periodo: Number(payload.id_periodo),
    },
  });
};

const updateGrupo = async (id_grupo, payload) => {
  await getGrupoById(id_grupo);

  const data = { ...payload };
  if (data.id_grupo) delete data.id_grupo;
  if (data.id_programa) data.id_programa = Number(data.id_programa);
  if (data.id_periodo) data.id_periodo = Number(data.id_periodo);

  if (data.num_cuenta_docente) {
    const docenteExiste = await prisma.docente.findUnique({ where: { num_cuenta: data.num_cuenta_docente } });
    if (!docenteExiste) throw new AppError("El docente especificado no existe", 400);
  }

  if (data.id_programa && data.codigo_asignatura) {
    const relacion = await prisma.programa_asignatura.findUnique({
      where: {
        id_programa_codigo_asignatura: {
          id_programa: Number(data.id_programa),
          codigo_asignatura: data.codigo_asignatura,
        },
      },
    });

    if (!relacion) {
      throw new AppError("La asignatura no pertenece al programa académico seleccionado", 400);
    }
  }

  return prisma.grupo.update({
    where: { id_grupo: Number(id_grupo) },
    data,
  });
};

const deleteGrupo = async (id_grupo) => {
  await getGrupoById(id_grupo);

  const inscripcionesRelacionadas = await prisma.inscripcion.count({
    where: { id_grupo: Number(id_grupo) },
  });

  if (inscripcionesRelacionadas > 0) {
    throw new AppError("No se puede eliminar el grupo porque tiene inscripciones asociadas", 400);
  }

  await prisma.grupo.delete({ where: { id_grupo: Number(id_grupo) } });
  return { message: "Grupo eliminado correctamente" };
};

module.exports = {
  getAllGrupos,
  getGrupoById,
  createGrupo,
  updateGrupo,
  deleteGrupo,
};
