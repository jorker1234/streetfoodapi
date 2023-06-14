const _ = require("lodash");
const { check } = require("express-validator");

const receiveNumberValidate = async (value) => {
  if (
    !!value &&
    !isNaN(value) &&
    (value.length === 13 ||
      (value.length === 10 && value.substring(0, 1) === "0"))
  ) {
    return true;
  }
  throw new Error("must be mobile or identity number");
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
    check("receiveNumber")
      .notEmpty()
      .withMessage("is empty")
      .custom(receiveNumberValidate),
    check("phone")
      .optional()
      .isMobilePhone("th-TH")
      .withMessage("must be phone"),
  ],

  update: [
    check("name")
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage("must be between 1-100 characters"),
    check("receiveNumber")
      .optional()
      .custom(receiveNumberValidate),
    check("phone")
      .optional()
      .isMobilePhone("th-TH")
      .withMessage("must be phone"),
  ],
};
