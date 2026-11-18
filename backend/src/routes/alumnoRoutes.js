const express = require("express");
const alumnoController = require("../controllers/alumnoController");

const router = express.Router();

router.get("/", alumnoController.getAllAlumnos);
router.get("/:num_cuenta", alumnoController.getAlumnoById);
router.post("/", alumnoController.createAlumno);
router.put("/:num_cuenta", alumnoController.updateAlumno);
router.delete("/:num_cuenta", alumnoController.deleteAlumno);

module.exports = router;
