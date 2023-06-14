const router = require("express").Router();
const shopController = require("../../controllers/shop.controller");
const validator = require('../../validators/shop');
const multer = require("../multer");

router.get("/", validator.query, shopController.query);
router.get("/:id", shopController.get);
router.post(
    "/",
    multer.single("file"),
    validator.create,
    shopController.create
  );
  router.put(
    "/:id",
    multer.single("file"),
    validator.update,
    shopController.update
  );

module.exports = router;
