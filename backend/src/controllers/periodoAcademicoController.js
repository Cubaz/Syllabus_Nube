const asyncHandler = require("../utils/asyncHandler");
const periodoAcademicoService = require("../services/periodoAcademicoService");

const getAllPeriodosAcademicos = asyncHandler(async (req, res) => {
  const periodos = await periodoAcademicoService.getAllPeriodosAcademicos();
  res.json({ ok: true, data: periodos });
});

const getPeriodoAcademicoById = asyncHandler(async (req, res) => {
  const periodo = await periodoAcademicoService.getPeriodoAcademicoById(req.params.id_periodo);
  res.json({ ok: true, data: periodo });
});

const createPeriodoAcademico = asyncHandler(async (req, res) => {
  const periodo = await periodoAcademicoService.createPeriodoAcademico(req.body);
  res.status(201).json({ ok: true, data: periodo });
});

const updatePeriodoAcademico = asyncHandler(async (req, res) => {
  const periodo = await periodoAcademicoService.updatePeriodoAcademico(req.params.id_periodo, req.body);
  res.json({ ok: true, data: periodo });
});

const deletePeriodoAcademico = asyncHandler(async (req, res) => {
  const result = await periodoAcademicoService.deletePeriodoAcademico(req.params.id_periodo);
  res.json({ ok: true, data: result });
});

module.exports = {
  getAllPeriodosAcademicos,
  getPeriodoAcademicoById,
  createPeriodoAcademico,
  updatePeriodoAcademico,
  deletePeriodoAcademico,
};
