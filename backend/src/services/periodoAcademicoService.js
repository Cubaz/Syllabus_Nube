const { prisma } = require("../models");
const AppError = require("../utils/AppError");
const { assertRules, buildData, isFutureDate, parseId } = require("../utils/validation");

const schema = {
  anio: { label: "año", type: "int", required: true },
  semestre: { label: "semestre", type: "int", required: true },
  fecha_inicio: { label: "fecha de inicio", type: "date", required: true },
  fecha_fin: { label: "fecha de fin", type: "date", required: true },
};

const getAllPeriodosAcademicos = async () =>
  prisma.periodo_academico.findMany({ orderBy: { id_periodo: "asc" } });

const getPeriodoAcademicoById = async (id_periodo) => {
  const periodo = await prisma.periodo_academico.findUnique({
    where: { id_periodo: parseId(id_periodo, "ID del periodo") },
  });
  if (!periodo) throw new AppError("Periodo académico no encontrado", 404);
  return periodo;
};

const formatoFecha = (fecha) => fecha.toISOString().slice(0, 10);

const assertSinTraslape = async ({ fecha_inicio, fecha_fin }, idExcluido = null) => {
  const traslapado = await prisma.periodo_academico.findFirst({
    where: {
      fecha_inicio: { lte: fecha_fin },
      fecha_fin: { gte: fecha_inicio },
      ...(idExcluido === null ? {} : { id_periodo: { not: idExcluido } }),
    },
  });

  if (traslapado) {
    throw new AppError(
      `Las fechas se traslapan con el periodo ${traslapado.anio}-${traslapado.semestre} ` +
        `(${formatoFecha(traslapado.fecha_inicio)} a ${formatoFecha(traslapado.fecha_fin)})`,
      400,
    );
  }
};

const createPeriodoAcademico = async (payload) => {
  const data = buildData(payload, schema);
  assertRules("periodo_academico", data);
  await assertSinTraslape(data);
  return prisma.periodo_academico.create({ data });
};

const updatePeriodoAcademico = async (id_periodo, payload) => {
  const periodo = await getPeriodoAcademicoById(id_periodo);
  const data = buildData(payload, schema, { partial: true });
  const resultado = { ...periodo, ...data };
  assertRules("periodo_academico", resultado);
  await assertSinTraslape(resultado, periodo.id_periodo);

  if (isFutureDate(resultado.fecha_inicio)) {
    const calificadas = await prisma.inscripcion.count({
      where: { calificacion_final: { not: null }, grupo: { id_periodo: periodo.id_periodo } },
    });
    if (calificadas > 0) {
      throw new AppError(
        `No se puede mover el inicio del periodo a una fecha futura: ya tiene ${calificadas} calificaciones capturadas`,
        400,
      );
    }
  }

  return prisma.periodo_academico.update({
    where: { id_periodo: periodo.id_periodo },
    data,
  });
};

const deletePeriodoAcademico = async (id_periodo) => {
  const periodo = await getPeriodoAcademicoById(id_periodo);

  const dependencias = await prisma.grupo.count({
    where: { id_periodo: periodo.id_periodo },
  });

  if (dependencias > 0) {
    throw new AppError("No se puede eliminar el periodo académico porque tiene grupos asociados", 400);
  }

  await prisma.periodo_academico.delete({ where: { id_periodo: periodo.id_periodo } });
  return { message: "Periodo académico eliminado correctamente" };
};

module.exports = {
  getAllPeriodosAcademicos,
  getPeriodoAcademicoById,
  createPeriodoAcademico,
  updatePeriodoAcademico,
  deletePeriodoAcademico,
};
