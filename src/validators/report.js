const { check } = require("express-validator");
const shopService = require("../services/shop.service");
const moment = require("moment");

const shopIdIsExists = async (value) => {
  try {
    return await shopService.getById(value);
  } catch (error) {
    throw error;
  }
};

const dateValid = (value) => {
    return moment(value, "YYYY-MM-DD").isValid();
};

module.exports = {
  getSale: [
    check("shopId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(shopIdIsExists)
      .withMessage("is not exists"),
    check("from")
      .notEmpty()
      .withMessage("is empty")
      .custom(dateValid)
      .withMessage("Invalid format (yyyy-mm-dd)"),
    check("to")
      .notEmpty()
      .withMessage("is empty")
      .custom(dateValid)
      .withMessage("Invalid format (yyyy-mm-dd)"),
  ],
};
