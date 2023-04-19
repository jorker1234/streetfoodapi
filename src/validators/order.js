const { check } = require("express-validator");
const shopService = require("../services/shop.service");
const menuService = require("../services/menu.service");
const orderService = require("../services/order.service");

const shopIdIsExists = async (value) => {
  try {
    return await shopService.getById(value);
  } catch (error) {
    throw error;
  }
};

const menuIdIsExists = async (value, options) => {
  try {
    const shopId = options.req.body?.shopId ?? 0;
    return await menuService.getById(shopId, value);
  } catch (error) {
    throw error;
  }
};

const orderIdIsExists = async (value, options) => {
  try {
    const shopId = options.req.body?.shopId ?? 0;
    return await orderService.getById(shopId, value);
  } catch (error) {
    throw error;
  }
};

const orderItemIdIsExists = async (value, options) => {
  try {
    const shopId = options.req.body?.shopId ?? 0;
    const orderId = options.req.body?.orderId ?? 0;
    return await orderService.getItemById(shopId, orderId, value);
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
    check("skip")
      .optional()
      .isInt({ min: 0 })
      .withMessage("must be number and value greater than -1"),
    check("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("must be number and value greater than 0"),
  ],

  add: [
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
      .isInt({ min: 1 })
      .withMessage("must be number and value greater than 0"),
    check("orderId")
      .optional()
      .custom(orderIdIsExists)
      .withMessage("is not exists"),
  ],

  edit: [
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
    check("orderItemId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(orderItemIdIsExists)
      .withMessage("is not exists"),
    check("quantity")
      .notEmpty()
      .withMessage("is empty")
      .isInt({ min: 1 })
      .withMessage("must be number and value greater than 0"),
  ],

  remove: [
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
    check("orderItemId")
      .notEmpty()
      .withMessage("is empty")
      .bail()
      .custom(orderItemIdIsExists)
      .withMessage("is not exists"),
  ],
};
