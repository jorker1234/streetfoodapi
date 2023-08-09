const { check } = require("express-validator");
const shopService = require("../services/shop.service");
const menuService = require("../services/menu.service");
const orderService = require("../services/order.service");
const { OrderStatus } = require("../models/Order");

const shopIdIsExists = async (value) => {
  try {
    return await shopService.getById(value);
  } catch (error) {
    throw error;
  }
};

const menuIdIsExists = async (value, options) => {
  try {
    const shopId = options.req.body?.shopId ?? options.req.query?.shopId ?? 0;
    return await menuService.getById(shopId, value);
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

const orderItemIdIsExists = async (value, options) => {
  try {
    const shopId = options.req.body?.shopId ?? options.req.query?.shopId ?? 0;
    const orderId =
      options.req.body?.orderId ?? options.req.query?.orderId ?? 0;
    return await orderService.getItemById(shopId, orderId, value);
  } catch (error) {
    throw error;
  }
};

const orderStatusIsValid = (value) => {
  const orderStatus = Object.values(OrderStatus);
  return orderStatus.indexOf(value) >= 0;
};

module.exports = {
  query: [
    check("shopId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(shopIdIsExists)
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
      .custom(orderStatusIsValid)
      .withMessage("is invalid"),
  ],

  get: [
    check("shopId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(shopIdIsExists)
      .withMessage("is not exists"),
  ],

  create: [
    check("shopId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(shopIdIsExists)
      .withMessage("is not exists"),
    check("customer")
      .optional()
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
    check("menuId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(menuIdIsExists)
      .withMessage("is not exists"),
    check("quantity")
      .notEmpty()
      .withMessage("is empty")
      .isInt({ min: 0 })
      .withMessage("must be number and value greater than or equal 0"),
  ],


  remove: [
    check("shopId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(shopIdIsExists)
      .withMessage("is not exists"),
  ],
  // add: [
  //   check("shopId")
  //     .notEmpty()
  //     .withMessage("is empty")
  //     .bail()
  //     .custom(shopIdIsExists)
  //     .withMessage("is not exists"),
  //   check("menuId")
  //     .notEmpty()
  //     .withMessage("is empty")
  //     .bail()
  //     .custom(menuIdIsExists)
  //     .withMessage("is not exists"),
  //   check("quantity")
  //     .notEmpty()
  //     .withMessage("is empty")
  //     .isInt({ min: 1 })
  //     .withMessage("must be number and value greater than 0"),
  //   check("orderId")
  //     .optional()
  //     .custom(orderIdIsExists)
  //     .withMessage("is not exists"),
  // ],

  // edit: [
  //   check("shopId")
  //     .notEmpty()
  //     .withMessage("is empty")
  //     .bail()
  //     .custom(shopIdIsExists)
  //     .withMessage("is not exists"),
  //   check("orderId")
  //     .notEmpty()
  //     .withMessage("is empty")
  //     .bail()
  //     .custom(orderIdIsExists)
  //     .withMessage("is not exists"),
  //   check("orderItemId")
  //     .notEmpty()
  //     .withMessage("is empty")
  //     .bail()
  //     .custom(orderItemIdIsExists)
  //     .withMessage("is not exists"),
  //   check("quantity")
  //     .notEmpty()
  //     .withMessage("is empty")
  //     .isInt({ min: 1 })
  //     .withMessage("must be number and value greater than 0"),
  // ],

  // remove: [
  //   check("shopId")
  //     .notEmpty()
  //     .withMessage("is empty")
  //     .bail()
  //     .custom(shopIdIsExists)
  //     .withMessage("is not exists"),
  //   check("orderId")
  //     .notEmpty()
  //     .withMessage("is empty")
  //     .bail()
  //     .custom(orderIdIsExists)
  //     .withMessage("is not exists"),
  //   check("orderItemId")
  //     .notEmpty()
  //     .withMessage("is empty")
  //     .bail()
  //     .custom(orderItemIdIsExists)
  //     .withMessage("is not exists"),
  // ],
};
