const express = require("express");
const docenteController = require("../controllers/docenteController");

const router = express.Router();

router.get("/", docenteController.getAllDocentes);
router.get("/:num_cuenta", docenteController.getDocenteById);
router.post("/", docenteController.createDocente);
router.put("/:num_cuenta", docenteController.updateDocente);
router.delete("/:num_cuenta", docenteController.deleteDocente);

module.exports = router;
