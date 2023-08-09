const { check } = require("express-validator");
const shopService = require("../services/shop.service");
const orderService = require("../services/order.service");
const { BillStatus } = require("../models/Bill");

const shopIdIsExists = async (value) => {
  try {
    return await shopService.getById(value);
  } catch (error) {
    throw error;
  }
};

const orderIdIsExists = async (value, options) => {
  try {
    const shopId = options.req.body?.shopId ?? options.req.query?.shopId ?? 0;
    return await orderService.getById(shopId, value);
  } catch (error) {
    throw error;
  }
};

const statusIdIsValid = (value) => {
  const billStatus = Object.values(BillStatus);
  return billStatus.indexOf(value) >= 0;
};

module.exports = {
  query: [
    check("shopId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(shopIdIsExists)
      .withMessage("is not exists"),
    // check("orderId")
    //   .notEmpty()
    //   .withMessage("is empty")
    //   .bail()
    //   .custom(orderIdIsExists)
    //   .withMessage("is not exists"),
    check("orderId")
      .optional()
      .bail()
      .custom(orderIdIsExists)
      .withMessage("is not exists"),
    check("skip")
      .optional()
      .isInt({ min: 0 })
      .withMessage("must be number and value greater than -1"),
    check("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("must be number and value greater than 0"),
    check("status")
      .optional()
      .custom(statusIdIsValid)
      .withMessage("is invalid"),
  ],

  get: [
    check("shopId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(shopIdIsExists)
      .withMessage("is not exists"),
    check("orderId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(orderIdIsExists)
      .withMessage("is not exists"),
  ],

  create: [
    check("shopId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(shopIdIsExists)
      .withMessage("is not exists"),
    check("orderId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(orderIdIsExists)
      .withMessage("is not exists"),
    check("customer")
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
    check("orderId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(orderIdIsExists)
      .withMessage("is not exists"),
    check("status")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(statusIdIsValid)
      .withMessage("is invalid"),
  ],
};
