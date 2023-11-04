const _ = require("lodash");

module.exports = {
  serializeShops(shops = []) {
    return shops.map((shop) => {
      return {
        id: shop._id.toString(),
        ..._.pick(shop, ["name", "phone", "receiveNumber", "imageUrl", "promptpay"]),
      };
    });
  },
  serialize(shops = []) {
    const shopSerialized = this.serializeShops(shops);
    return {
      shops: shopSerialized
    }
  },
};
