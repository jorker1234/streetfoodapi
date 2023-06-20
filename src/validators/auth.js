const { check } = require("express-validator");

module.exports = {
  signin: [
    check("username").notEmpty().withMessage("is empty"),
    check("password").notEmpty().withMessage("is empty"),
  ],
};
