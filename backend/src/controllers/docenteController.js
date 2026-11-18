const asyncHandler = require("../utils/asyncHandler");
const docenteService = require("../services/docenteService");

const getAllDocentes = asyncHandler(async (req, res) => {
  const docentes = await docenteService.getAllDocentes();
  res.json({ ok: true, data: docentes });
});

const getDocenteById = asyncHandler(async (req, res) => {
  const docente = await docenteService.getDocenteById(req.params.num_cuenta);
  res.json({ ok: true, data: docente });
});

const createDocente = asyncHandler(async (req, res) => {
  const docente = await docenteService.createDocente(req.body);
  res.status(201).json({ ok: true, data: docente });
});

const updateDocente = asyncHandler(async (req, res) => {
  const docente = await docenteService.updateDocente(req.params.num_cuenta, req.body);
  res.json({ ok: true, data: docente });
});

const deleteDocente = asyncHandler(async (req, res) => {
  const result = await docenteService.deleteDocente(req.params.num_cuenta);
  res.json({ ok: true, data: result });
});

module.exports = {
  getAllDocentes,
  getDocenteById,
  createDocente,
  updateDocente,
  deleteDocente,
};
