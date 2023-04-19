const router = require("express").Router();
const billController = require("../../controllers/bill.controller");
const validator = require('../../validators/bill');

router.get("/", validator.query, billController.query);
router.post("/", validator.create, billController.create);

module.exports = router;
