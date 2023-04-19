const billService = require("../services/bill.service");
const shopService = require("../services/shop.service");
const orderService = require("../services/order.service");
const menuService = require("../services/menu.service");
const promptpayService = require("../services/promptpay.service");
const billSerializer = require("../serializers/bill");

const controller = {
  async query(req, res) {
    try {
      req.validate();
      const bills = await billService.query(req.query);
      const billSerialized = billSerializer.serialize(bills);
      res.success(billSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async create(req, res) {
    try {
      req.validate();
      const param = {
        ...req.body,
        getShopById: shopService.getById,
        getOrderById: orderService.getById,
        getMenuByIds: menuService.getByIds,
        generatePromptpay: (receiveNumber, amount) =>
          promptpayService.generatePayload(receiveNumber, amount),
        inactiveOrder: orderService.inactive,
      };
      const bill = await billService.create(param);
      const billSerialized = billSerializer.serialize([bill]);
      res.success(billSerialized);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...controller };
