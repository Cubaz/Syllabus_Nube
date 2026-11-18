const asyncHandler = require("../utils/asyncHandler");
const reporteService = require("../services/reporteService");

const getReporteCalificaciones = asyncHandler(async (req, res) => {
  const reportes = await reporteService.getReporteCalificaciones();
  res.json({ ok: true, data: reportes });
});

module.exports = {
  getReporteCalificaciones,
};
