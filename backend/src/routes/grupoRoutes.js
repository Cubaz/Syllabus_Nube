const express = require("express");
const grupoController = require("../controllers/grupoController");

const router = express.Router();

router.get("/", grupoController.getAllGrupos);
router.get("/:id_grupo", grupoController.getGrupoById);
router.post("/", grupoController.createGrupo);
router.put("/:id_grupo", grupoController.updateGrupo);
router.delete("/:id_grupo", grupoController.deleteGrupo);

module.exports = router;
