const _ = require("lodash");

module.exports = {
  serialize(shops = []) {
    return shops.map((shop) => {
      return {
        id: shop._id.toString(),
        ..._.pick(shop, ["name", "phone", "receiveNumber", "imageUrl"]),
      };
    });
  },
};
