const router = require("express").Router();
const orderController = require("../../controllers/order.controller");
const validator = require("../../validators/order");
const { jwtAuthenticate } = require('../authentication');

router.get("/", validator.query, jwtAuthenticate, orderController.query);
router.get("/:id", validator.get, orderController.get);
router.post("/", validator.create, jwtAuthenticate, orderController.create);
router.put("/:id", validator.update, orderController.update);

module.exports = router;
