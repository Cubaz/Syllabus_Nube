const express = require("express");
const programaAcademicoController = require("../controllers/programaAcademicoController");

const router = express.Router();

router.get("/", programaAcademicoController.getAllProgramasAcademicos);
router.get("/:id_programa", programaAcademicoController.getProgramaAcademicoById);
router.post("/", programaAcademicoController.createProgramaAcademico);
router.put("/:id_programa", programaAcademicoController.updateProgramaAcademico);
router.delete("/:id_programa", programaAcademicoController.deleteProgramaAcademico);

module.exports = router;
