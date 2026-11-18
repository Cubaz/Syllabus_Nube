const express = require("express");
const periodoAcademicoController = require("../controllers/periodoAcademicoController");

const router = express.Router();

router.get("/", periodoAcademicoController.getAllPeriodosAcademicos);
router.get("/:id_periodo", periodoAcademicoController.getPeriodoAcademicoById);
router.post("/", periodoAcademicoController.createPeriodoAcademico);
router.put("/:id_periodo", periodoAcademicoController.updatePeriodoAcademico);
router.delete("/:id_periodo", periodoAcademicoController.deletePeriodoAcademico);

module.exports = router;
