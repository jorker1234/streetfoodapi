const _ = require("lodash");

module.exports = {
  serializeOrders(orders = [], menus = []) {
    return orders.map((order) => {
      const items = order.items.map((item) => {
        const menu = _.find(menus, (o) => o._id.toString() === item.menuId.toString());
        const price = menu?.price ?? 0;
        return {
          id: item._id.toString(),
          menuId: item.menuId.toString(),
          ..._.pick(item, ["quantity", "note"]),
          price,
          amount: price * item.quantity,
        };
      });
      const amount = _.sumBy(items, "amount");
      return {
        id: order._id.toString(),
        billId: order.billId?.toString(),
        ..._.pick(order, ["status", "customer"]),
        amount,
        items,
      };
    });
  },
};
