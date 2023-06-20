const { check } = require("express-validator");
const shopService = require("../services/shop.service");
const { RoleStatus } = require("../models/User");

const shopIdIsExists = async (value) => {
  try {
    return await shopService.getById(value);
  } catch (error) {
    throw error;
  }
};

const statusIdIsValid = (value) => {
  const roleStatus = Object.values(RoleStatus);
  return roleStatus.indexOf(value) >= 0;
};

module.exports = {
  query: [
    check("keyword")
      .optional()
      .isString()
      .withMessage("must be string")
      .isLength({ min: 1, max: 50 })
      .withMessage("must be between 1-50 characters"),
    check("skip")
      .optional()
      .isInt({ min: 0 })
      .withMessage("must be number and value greater than -1"),
    check("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("must be number and value greater than 0"),
  ],

  create: [
    check("name")
      .notEmpty()
      .withMessage("is empty")
      .isLength({ min: 1, max: 100 })
      .withMessage("must be between 1-100 characters"),
    check("username")
      .notEmpty()
      .withMessage("is empty")
      .isLength({ min: 5, max: 100 })
      .withMessage("must be between 5-100 characters"),
    check("password")
      .notEmpty()
      .withMessage("is empty")
      .isLength({ min: 10, max: 20 })
      .withMessage("must be between 10-20 characters"),
    check("role")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(statusIdIsValid)
      .withMessage("is invalid"),
    check("shopId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(shopIdIsExists)
      .withMessage("is not exists"),
  ],

  changePassword: [
    check("oldPassword").notEmpty().withMessage("is empty"),
    check("password")
      .notEmpty()
      .withMessage("is empty")
      .isLength({ min: 10, max: 20 })
      .withMessage("must be between 10-20 characters"),
  ],
};
