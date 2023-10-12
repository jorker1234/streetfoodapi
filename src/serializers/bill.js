const _ = require("lodash");
const shopSerializer = require("./shop");

module.exports = {
  serializeBills(bills = []) {
    return bills.map((bill) => {
      const items = bill.items.map((item) => {
        return {
          id: item._id.toString(),
          ..._.pick(item, [
            "name",
            "price",
            "quantity",
            "amount",
            "description",
            "note",
          ]),
        };
      });
      return {
        id: bill._id.toString(),
        orderId: bill.orderId.toString(),
        ..._.pick(bill, [
          "name",
          "sequence",
          "shopName",
          "customer",
          "status",
          "amount",
          "promptpay",
          "imageUrl",
          "isActived",
          "createdAt",
          "updatedAt",
        ]),
        items,
      };
    });
  },

  // serialize(bills = [], shops = []) {
  //   const billSerialized = this.serializeBills(bills);
  //   const shopSerialized = shopSerializer.serializeShops(shops);
  //   return {
  //     bills: billSerialized,
  //     shops: shopSerialized,
  //   };
  // },

  serialize(bills = []) {
    const billSerialized = this.serializeBills(bills);
    return {
      bills: billSerialized,
    };
  },
};
