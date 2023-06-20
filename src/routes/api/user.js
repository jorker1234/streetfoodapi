const router = require("express").Router();
const userController = require("../../controllers/user.controller");
const validator = require("../../validators/user");
const { jwtAuthenticate } = require('../authentication');

router.get("/", validator.query, userController.query);
router.post("/", validator.create, userController.create);
router.put("/password", validator.changePassword, jwtAuthenticate, userController.changePassword);

module.exports = router;
