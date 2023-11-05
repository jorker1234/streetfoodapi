const router = require("express").Router();
const menuController = require("../../controllers/menu.controller");
const validator = require("../../validators/menu");
const { jwtAuthenticate } = require("../authentication");


router.put(
  "/:id/materials/:materialId",
  validator.updateMaterial,
  jwtAuthenticate,
  menuController.updateMaterial
);

module.exports = router;
