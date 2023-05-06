const _ = require("lodash");
const shopSerializer = require("./shop");
const menuSerializer = require("./menu");
const orderSerializer = require("./order");

module.exports = {
  serialize(shops = [],menus = [], orders = []) {
    const orderSerialized = orderSerializer.serializeOrders(orders, menus);
    const menuSerialized = menuSerializer.serializeMenus(menus);
    const shopSerialized = shopSerializer.serializeShops(shops);
    return {
      orders: orderSerialized,
      shops: shopSerialized,
      menus: menuSerialized
    };
  },
};
