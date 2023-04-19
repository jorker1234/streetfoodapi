const orderService = require("../services/order.service");
const orderSerializer = require("../serializers/order");

const controller = {
  async query(req, res) {
    try {
      req.validate();
      const orders = await orderService.query(req.query);
      const orderSerialized = orderSerializer.serialize(orders);
      res.success(orderSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async add(req, res) {
    try {
      req.validate();
      const param = { ...req.body };
      const order = await orderService.add(param);
      const orderSerialized = orderSerializer.serialize([order]);
      res.success(orderSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async edit(req, res) {
    try {
      req.validate();
      const param = { ...req.body };
      const order = await orderService.edit(param);
      const orderSerialized = orderSerializer.serialize([order]);
      res.success(orderSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async remove(req, res) {
    try {
      req.validate();
      const param = { ...req.body };
      const order = await orderService.remove(param);
      const orderSerialized = orderSerializer.serialize([order]);
      res.success(orderSerialized);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...controller };
