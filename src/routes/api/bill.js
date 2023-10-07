const router = require("express").Router();
const billController = require("../../controllers/bill.controller");
const validator = require("../../validators/bill");
const multer = require("../multer");

router.get("/", validator.query, billController.query);
router.get("/:id", validator.get, billController.get);
router.post("/", validator.create, billController.create);git
router.put(
  "/:id",
  multer.single("file"),
  validator.update,
  billController.update
);

module.exports = router;
