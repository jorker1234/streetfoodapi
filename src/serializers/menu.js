const _ = require("lodash");

module.exports = {
  serialize(menus = []) {
    return menus.map((menu) => {
      return {
        id: menu._id.toString(),
        ..._.pick(menu, ["name", "price", "description", "imageUrl"]),
      };
    });
  },
};
