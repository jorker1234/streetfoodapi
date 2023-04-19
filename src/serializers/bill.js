const _ = require("lodash");

module.exports = {
  serialize(bills = []) {
    return bills.map((bill) => {
      const items = bill.items.map((item) => {
        return {
          id: item._id.toString(),
          ..._.pick(item, ["name", "price", "quantity", "description", "note"]),
        };
      });
      return {
        id: bill._id.toString(),
        ..._.pick(bill, ["name", "sequence", "customer", "createdAt", "updatedAt"]),
        items,
      };
    });
  },
};
