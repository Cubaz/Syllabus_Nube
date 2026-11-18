const asyncHandler = require("../utils/asyncHandler");
const programaAcademicoService = require("../services/programaAcademicoService");

const getAllProgramasAcademicos = asyncHandler(async (req, res) => {
  const programas = await programaAcademicoService.getAllProgramasAcademicos();
  res.json({ ok: true, data: programas });
});

const getProgramaAcademicoById = asyncHandler(async (req, res) => {
  const programa = await programaAcademicoService.getProgramaAcademicoById(req.params.id_programa);
  res.json({ ok: true, data: programa });
});

const createProgramaAcademico = asyncHandler(async (req, res) => {
  const programa = await programaAcademicoService.createProgramaAcademico(req.body);
  res.status(201).json({ ok: true, data: programa });
});

const updateProgramaAcademico = asyncHandler(async (req, res) => {
  const programa = await programaAcademicoService.updateProgramaAcademico(req.params.id_programa, req.body);
  res.json({ ok: true, data: programa });
});

const deleteProgramaAcademico = asyncHandler(async (req, res) => {
  const result = await programaAcademicoService.deleteProgramaAcademico(req.params.id_programa);
  res.json({ ok: true, data: result });
});

module.exports = {
  getAllProgramasAcademicos,
  getProgramaAcademicoById,
  createProgramaAcademico,
  updateProgramaAcademico,
  deleteProgramaAcademico,
};
