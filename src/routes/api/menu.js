const router = require("express").Router();
const menuController = require("../../controllers/menu.controller");
const validator = require("../../validators/menu");
const multer = require("../multer");
const { jwtAuthenticate } = require("../authentication");

router.get("/", validator.query, menuController.query);
router.post(
  "/",
  multer.single("file"),
  validator.create,
  jwtAuthenticate,
  menuController.create
);
router.put(
  "/:id",
  multer.single("file"),
  validator.update,
  jwtAuthenticate,
  menuController.update
);
// router.put(
//   "/:id/materials/:materialId",
//   validator.updateMaterial,
//   jwtAuthenticate,
//   menuController.updateMaterial
// );
router.delete("/:id", validator.remove, jwtAuthenticate, menuController.remove);

module.exports = router;
