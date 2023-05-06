const router = require("express").Router();
const billController = require("../../controllers/bill.controller");
const validator = require("../../validators/bill");

router.get("/", validator.query, billController.query);
router.get("/:id", validator.get, billController.get);
router.post("/", validator.create, billController.create);
router.put("/:id", validator.update, billController.update);

module.exports = router;
