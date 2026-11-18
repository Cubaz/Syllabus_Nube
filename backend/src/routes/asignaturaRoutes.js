const express = require("express");
const asignaturaController = require("../controllers/asignaturaController");

const router = express.Router();

router.get("/", asignaturaController.getAllAsignaturas);
router.get("/:codigo", asignaturaController.getAsignaturaById);
router.post("/", asignaturaController.createAsignatura);
router.put("/:codigo", asignaturaController.updateAsignatura);
router.delete("/:codigo", asignaturaController.deleteAsignatura);

module.exports = router;
