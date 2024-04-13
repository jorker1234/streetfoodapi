const router = require("express").Router();
const reportController = require("../../controllers/report.controller");
const validator = require("../../validators/report");

router.get("/sales", validator.getSale, reportController.getSale);

module.exports = router;
