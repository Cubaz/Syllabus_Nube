const asyncHandler = require("../utils/asyncHandler");
const asignaturaService = require("../services/asignaturaService");

const getAllAsignaturas = asyncHandler(async (req, res) => {
  const asignaturas = await asignaturaService.getAllAsignaturas();
  res.json({ ok: true, data: asignaturas });
});

const getAsignaturaById = asyncHandler(async (req, res) => {
  const asignatura = await asignaturaService.getAsignaturaById(req.params.codigo);
  res.json({ ok: true, data: asignatura });
});

const createAsignatura = asyncHandler(async (req, res) => {
  const asignatura = await asignaturaService.createAsignatura(req.body);
  res.status(201).json({ ok: true, data: asignatura });
});

const updateAsignatura = asyncHandler(async (req, res) => {
  const asignatura = await asignaturaService.updateAsignatura(req.params.codigo, req.body);
  res.json({ ok: true, data: asignatura });
});

const deleteAsignatura = asyncHandler(async (req, res) => {
  const result = await asignaturaService.deleteAsignatura(req.params.codigo);
  res.json({ ok: true, data: result });
});

module.exports = {
  getAllAsignaturas,
  getAsignaturaById,
  createAsignatura,
  updateAsignatura,
  deleteAsignatura,
};
