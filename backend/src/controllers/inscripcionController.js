const asyncHandler = require("../utils/asyncHandler");
const inscripcionService = require("../services/inscripcionService");

const getAllInscripciones = asyncHandler(async (req, res) => {
  const inscripciones = await inscripcionService.getAllInscripciones();
  res.json({ ok: true, data: inscripciones });
});

const getInscripcionById = asyncHandler(async (req, res) => {
  const inscripcion = await inscripcionService.getInscripcionById(req.params.id_inscripcion);
  res.json({ ok: true, data: inscripcion });
});

const createInscripcion = asyncHandler(async (req, res) => {
  const inscripcion = await inscripcionService.createInscripcion(req.body);
  res.status(201).json({ ok: true, data: inscripcion });
});

const updateInscripcion = asyncHandler(async (req, res) => {
  const inscripcion = await inscripcionService.updateInscripcion(req.params.id_inscripcion, req.body);
  res.json({ ok: true, data: inscripcion });
});

const deleteInscripcion = asyncHandler(async (req, res) => {
  const result = await inscripcionService.deleteInscripcion(req.params.id_inscripcion);
  res.json({ ok: true, data: result });
});

module.exports = {
  getAllInscripciones,
  getInscripcionById,
  createInscripcion,
  updateInscripcion,
  deleteInscripcion,
};
