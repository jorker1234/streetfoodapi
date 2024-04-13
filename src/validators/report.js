const { check } = require("express-validator");
const shopService = require("../services/shop.service");

const shopIdIsExists = async (value) => {
  try {
    return await shopService.getById(value);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getSale: [
    check("shopId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(shopIdIsExists)
      .withMessage("is not exists"),
    check("from").isISO8601().toDate().withMessage("Invalid day received"),
    check("to").isISO8601().toDate().withMessage("Invalid day received"),
  ],
};
