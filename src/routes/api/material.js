const router = require("express").Router();
const materialController = require("../../controllers/material.controller");
const validator = require("../../validators/material");
const { jwtAuthenticate } = require("../authentication");

router.get("/", validator.query, jwtAuthenticate, materialController.query);
router.post("/", validator.create, jwtAuthenticate, materialController.create);
router.put(
  "/:id",
  validator.update,
  jwtAuthenticate,
  materialController.update
);
router.delete(
  "/:id",
  validator.remove,
  jwtAuthenticate,
  materialController.remove
);

module.exports = router;
