const _ = require("lodash");

module.exports = {
  serialize(orders = []) {
    return orders.map((order) => {
        const items = order.items.map((item) => {
            return {
                id: item._id.toString(),
                ..._.pick(item, ["quantity", "note"]),
            }
        });
      return {
        id: order._id.toString(),
        items,
      };
    });
  },
};
