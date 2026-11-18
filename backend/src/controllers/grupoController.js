const asyncHandler = require("../utils/asyncHandler");
const grupoService = require("../services/grupoService");

const getAllGrupos = asyncHandler(async (req, res) => {
  const grupos = await grupoService.getAllGrupos();
  res.json({ ok: true, data: grupos });
});

const getGrupoById = asyncHandler(async (req, res) => {
  const grupo = await grupoService.getGrupoById(req.params.id_grupo);
  res.json({ ok: true, data: grupo });
});

const createGrupo = asyncHandler(async (req, res) => {
  const grupo = await grupoService.createGrupo(req.body);
  res.status(201).json({ ok: true, data: grupo });
});

const updateGrupo = asyncHandler(async (req, res) => {
  const grupo = await grupoService.updateGrupo(req.params.id_grupo, req.body);
  res.json({ ok: true, data: grupo });
});

const deleteGrupo = asyncHandler(async (req, res) => {
  const result = await grupoService.deleteGrupo(req.params.id_grupo);
  res.json({ ok: true, data: result });
});

module.exports = {
  getAllGrupos,
  getGrupoById,
  createGrupo,
  updateGrupo,
  deleteGrupo,
};
