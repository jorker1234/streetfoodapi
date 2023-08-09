const orderService = require("../services/order.service");
const shopService = require("../services/shop.service");
const menuService = require("../services/menu.service");
const menuOrderSerializer = require("../serializers/menuOrder");

const controller = {
  async _serialize(shopId, orders = []) {
    let menuIds = [];
    orders.forEach(order => {
      const ids = order.items.map((o) => o.menuId.toString());
      menuIds = menuIds.concat(ids);
    });
    const menus = await menuService.getByIds(shopId, menuIds);
    const shop = !shopId ? null : await shopService.getById(shopId);
    const shops = !shop ? [] : [shop];
    return menuOrderSerializer.serialize(shops, menus, orders);
  },

  async query(req, res) {
    try {
      req.validate();
      const { shopId } = req.query;
      const orders = await orderService.query(req.query);
      const menuOrderSerialized = menuOrderSerializer.serialize([], [], orders);
      //const menuOrderSerialized = await controller._serialize(shopId, orders);
      res.success(menuOrderSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async get(req, res) {
    try {
      req.validate();
      const { id } = req.params;
      const { shopId } = req.query;
      const order = await orderService.getById(shopId, id);
      const menuOrderSerialized = await controller._serialize(shopId, [order]);
      res.success(menuOrderSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async create(req, res) {
    try {
      req.validate();
      const param = { ...req.body };
      const { shopId } = req.body;
      const order = await orderService.create(param);
      const menuOrderSerialized = await controller._serialize(shopId, [order]);
      res.success(menuOrderSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async update(req, res) {
    try {
      req.validate();
      const { id } = req.params;
      const { shopId } = req.body;
      const param = { ...req.body, id };
      const order = await orderService.update(param);
      const menuOrderSerialized = await controller._serialize(shopId, [order]);
      res.success(menuOrderSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  async remove(req, res) {
    try {
      req.validate();
      const { shopId, id } = req.params;
      const param = { shopId, id };
      console.log("remove", param);
      const order = await orderService.remove(param);
      const menuOrderSerialized = await controller._serialize(shopId, [order]);
      res.success(menuOrderSerialized);
    } catch (error) {
      res.error(error);
    }
  },

  // async add(req, res) {
  //   try {
  //     req.validate();
  //     const param = { ...req.body };
  //     const order = await orderService.add(param);
  //     const orderSerialized = orderSerializer.serialize([order]);
  //     res.success(orderSerialized);
  //   } catch (error) {
  //     res.error(error);
  //   }
  // },

  // async edit(req, res) {
  //   try {
  //     req.validate();
  //     const param = { ...req.body };
  //     const order = await orderService.edit(param);
  //     const orderSerialized = orderSerializer.serialize([order]);
  //     res.success(orderSerialized);
  //   } catch (error) {
  //     res.error(error);
  //   }
  // },

  // async remove(req, res) {
  //   try {
  //     req.validate();
  //     const param = { ...req.body };
  //     const order = await orderService.remove(param);
  //     const orderSerialized = orderSerializer.serialize([order]);
  //     res.success(orderSerialized);
  //   } catch (error) {
  //     res.error(error);
  //   }
  // },
};

module.exports = { ...controller };
