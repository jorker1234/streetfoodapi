const _ = require("lodash");

module.exports = {
  serializeMenus(menus = []) {
    return menus.map((menu) => {
      return {
        id: menu._id.toString(),
        ..._.pick(menu, ["name", "price", "description", "imageUrl"]),
      };
    });
  },
};
