const { check } = require("express-validator");
const shopService = require("../services/shop.service");
const materialService = require("../services/material.service");

const shopIdIsExists = async (value) => {
  try {
    return await shopService.getById(value);
  } catch (error) {
    throw error;
  }
};

const materialIdIsExists = async (value, options) => {
  try {
    const shopId = options.req.body?.shopId ?? options.req.query?.shopId ?? 0;
    return await materialService.getById(shopId, value);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  query: [
    check("shopId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(shopIdIsExists)
      .withMessage("is not exists"),
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
    check("shopId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(shopIdIsExists)
      .withMessage("is not exists"),
    check("name")
      .notEmpty()
      .withMessage("is empty")
      .isLength({ min: 1, max: 100 })
      .withMessage("must be between 1-100 characters"),
    check("price")
      .notEmpty()
      .withMessage("is empty")
      .isFloat({ min: 1 })
      .withMessage("must be number and value greater than 0"),
    check("unit")
      .notEmpty()
      .withMessage("is empty")
      .isLength({ min: 1, max: 100 })
      .withMessage("must be between 1-100 characters"),
  ],

  update: [
    check("shopId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(shopIdIsExists)
      .withMessage("is not exists"),
    check("name")
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage("must be between 1-100 characters"),
    check("price")
      .optional()
      .isFloat({ min: 1 })
      .withMessage("must be number and value greater than 0"),
    check("unit")
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage("must be between 1-100 characters"),
  ],

  remove: [
    check("shopId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(shopIdIsExists)
      .withMessage("is not exists"),
    check("id")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(materialIdIsExists)
      .withMessage("is not exists"),
  ],
};
