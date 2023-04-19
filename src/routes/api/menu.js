const router = require("express").Router();
const menuController = require("../../controllers/menu.controller");
const validator = require("../../validators/menu");
const multer = require("../multer");

router.get("/", validator.query, menuController.query);
router.post(
  "/",
  multer.single("file"),
  validator.create,
  menuController.create
);
router.delete("/:id", validator.remove, menuController.remove);

module.exports = router;
