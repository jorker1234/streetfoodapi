const router = require("express").Router();
const orderController = require("../../controllers/order.controller");
const validator = require("../../validators/order");

router.get("/", validator.query, orderController.query);
router.get("/:id", validator.get, orderController.get);
router.post("/", validator.create, orderController.create);
router.put("/:id", validator.update, orderController.update);

module.exports = router;
