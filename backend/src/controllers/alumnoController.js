const asyncHandler = require("../utils/asyncHandler");
const alumnoService = require("../services/alumnoService");

const getAllAlumnos = asyncHandler(async (req, res) => {
  const alumnos = await alumnoService.getAllAlumnos();
  res.json({ ok: true, data: alumnos });
});

const getAlumnoById = asyncHandler(async (req, res) => {
  const alumno = await alumnoService.getAlumnoById(req.params.num_cuenta);
  res.json({ ok: true, data: alumno });
});

const createAlumno = asyncHandler(async (req, res) => {
  const alumno = await alumnoService.createAlumno(req.body);
  res.status(201).json({ ok: true, data: alumno });
});

const updateAlumno = asyncHandler(async (req, res) => {
  const alumno = await alumnoService.updateAlumno(req.params.num_cuenta, req.body);
  res.json({ ok: true, data: alumno });
});

const deleteAlumno = asyncHandler(async (req, res) => {
  const result = await alumnoService.deleteAlumno(req.params.num_cuenta);
  res.json({ ok: true, data: result });
});

module.exports = {
  getAllAlumnos,
  getAlumnoById,
  createAlumno,
  updateAlumno,
  deleteAlumno,
};
