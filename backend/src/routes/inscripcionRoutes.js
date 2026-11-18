const express = require("express");
const inscripcionController = require("../controllers/inscripcionController");

const router = express.Router();

router.get("/", inscripcionController.getAllInscripciones);
router.get("/:id_inscripcion", inscripcionController.getInscripcionById);
router.post("/", inscripcionController.createInscripcion);
router.put("/:id_inscripcion", inscripcionController.updateInscripcion);
router.delete("/:id_inscripcion", inscripcionController.deleteInscripcion);

module.exports = router;
