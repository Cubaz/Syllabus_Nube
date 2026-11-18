const express = require("express");
const reporteController = require("../controllers/reporteController");

const router = express.Router();

router.get("/calificaciones", reporteController.getReporteCalificaciones);

module.exports = router;
