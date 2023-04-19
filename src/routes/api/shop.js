const router = require("express").Router();
const shopController = require("../../controllers/shop.controller");
const validator = require('../../validators/shop');
const multer = require("../multer");

router.get("/", validator.query, shopController.query);
router.post(
    "/",
    multer.single("file"),
    validator.create,
    shopController.create
  );

module.exports = router;
