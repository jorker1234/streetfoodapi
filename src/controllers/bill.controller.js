const billService = require("../services/bill.service");
const shopService = require("../services/shop.service");
const orderService = require("../services/order.service");
const menuService = require("../services/menu.service");
const promptpayService = require("../services/promptpay.service");
const billSerializer = require("../serializers/bill");

const controller = {
  async _serialize(shopId, bills = []) {
    //const shop = !shopId ? null : await shopService.getById(shopId);
    //const shops = !shop ? [] : [shop];
    return billSerializer.serialize(bills);
  },

  async query(req, res) {
    try {
      req.validate();
      const { shopId } = req.query;
      const bills = await billService.query(req.query);
      const billSerialized = await controller._serialize(shopId, bills);
      res.success(billSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async get(req, res) {
    try {
      req.validate();
      const { id } = req.params;
      const { shopId } = req.query;
      const bill = await billService.getById(shopId, id);
      const billSerialized = await controller._serialize(shopId, [bill]);
      res.success(billSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async create(req, res) {
    try {
      req.validate();
      const { shopId } = req.body;
      const param = {
        ...req.body,
        getShopById: shopService.getById,
        getOrderById: orderService.getById,
        getMenuByIds: menuService.getByIds,
        generatePromptpay: (receiveNumber, amount) =>
          promptpayService.generatePayload(receiveNumber, amount),
        updateStatusOrder: orderService.updateStatus,
      };
      const bill = await billService.create(param);
      const billSerialized = await controller._serialize(shopId, [bill]);
      res.success(billSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async update(req, res) {
    try {
      req.validate();
      const { id } = req.params;
      const { shopId } = req.body;
      const param = {
        ...req.body,
        id,
        updateStatusOrder: orderService.updateStatus,
      };
      const bill = await billService.update(param);
      const billSerialized = await controller._serialize(shopId, [bill]);
      res.success(billSerialized);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...controller };
