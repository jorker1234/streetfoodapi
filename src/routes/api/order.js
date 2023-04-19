const router = require("express").Router();
const orderController = require("../../controllers/order.controller");
const validator = require('../../validators/order');

router.get("/", validator.query, orderController.query);
router.post("/", validator.add, orderController.add);
router.patch("/", validator.edit, orderController.edit);
router.delete("/", validator.remove, orderController.remove);

module.exports = router;
