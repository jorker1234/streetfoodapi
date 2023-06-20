const menuService = require("../services/menu.service");
const shopService = require("../services/shop.service");
const orderService = require("../services/order.service");
const fileService = require("../services/file.service");
const menuOrderSerializer = require("../serializers/menuOrder");
const order = require("../serializers/order");

const controller = {
  async _serialize(shopId, orderId, menus = []) {
    //const shop = !shopId ? null : await shopService.getById(shopId);
    //const shops = !shop ? [] : [shop];
    const order = !orderId ? null : await orderService.getById(shopId, orderId);
    const orders = !order ? [] : [order];
    return menuOrderSerializer.serialize([], menus, orders);
  },

  async query(req, res) {
    try {
      req.validate();
      const { shopId, orderId } = req.query;
      const menus = await menuService.query(req.query);
      const menuOrderSerialized = await controller._serialize(
        shopId,
        orderId,
        menus
      );
      res.success(menuOrderSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async create(req, res) {
    try {
      req.validate();
      let file = {};
      if (req.file) {
        file = await fileService.upload(req.file, "menus");
      }
      const param = { ...req.body, ...file };
      const menu = await menuService.create(param);
      const menuOrderSerialized = await controller._serialize(null, null, [
        menu,
      ]);
      res.success(menuOrderSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async update(req, res) {
    try {
      req.validate();
      let file = {};
      if (req.file) {
        file = await fileService.upload(req.file, "shops");
      }
      const { id } = req.params;
      const param = { ...req.body, ...file, id };
      const menu = await menuService.update(param);
      const menuOrderSerialized = await controller._serialize(null, null, [
        menu,
      ]);
      res.success(menuOrderSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async remove(req, res) {
    try {
      req.validate();
      const { id } = req.params;
      const { shopId, orderId } = req.body;
      const param = { ...req.body, id, removeFile: fileService.remove };
      const menu = await menuService.remove(param);
      const menuOrderSerialized = await controller._serialize(shopId, orderId, [
        menu,
      ]);
      res.success(menuOrderSerialized);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...controller };
