const _ = require("lodash");
const Bill = require("../models/Bill");
const { ErrorNotFound } = require("../configs/errors");

const service = {
  async query({
    shopId,
    keyword,
    skip = 0,
    limit = 10,
    sort = { sequence: -1 },
    projection = null,
  }) {
    const filter = {
      shopId,
      isActived: true,
    };
    if (!_.isNil(keyword)) {
      filter.nameSearch = new RegExp(`^${keyword.toLowerCase()}`);
    }
    const bills = await Bill.find(filter, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    return bills;
  },

  async getById(id) {
    const bill = await Bill.findById(id).lean();
    if (!bill || !bill.isActived) {
      throw ErrorNotFound("menu is not exists.");
    }
    return bill;
  },

  async getLastSequence(shopId) {
    const bill = await Bill.findOne({ shopId }, { sequence: 1, _id: 0 })
      .sort({ sequence: -1 })
      .lean();
    return bill?.sequence || 0;
  },

  async create({
    shopId,
    orderId,
    customer,
    getShopById,
    getOrderById,
    getMenuByIds,
    generatePromptpay,
    inactiveOrder,
  }) {
    const sequence = (await this.getLastSequence(shopId)) + 1;
    const maxQueue = 100;
    const prefixSequence = Math.floor(sequence / maxQueue) % 26;
    const prefix = String.fromCharCode(65 + prefixSequence); // A=65 ... Z=90
    const name = prefix + (sequence % maxQueue);
    const nameSearch = name.toLowerCase();
    const { items } = await getOrderById(shopId, orderId);
    const menuIds = items.map((item) => item.menuId.toString());
    const menus = await getMenuByIds(shopId, menuIds);
    const menuDict = _.reduce(
      menus,
      (prev, { _id, ...value }) => {
        const result = {
          ...prev,
          [_id.toString()]: value,
        };
        return result;
      },
      {}
    );
    const billItems = items.map((item) => {
      const menu = menuDict[item.menuId];
      return {
        name: menu.name,
        nameSearch: menu.nameSearch,
        price: menu.price,
        quantity: item.quantity,
        description: menu.description,
        note: item.note,
        amount: menu.price * item.quantity,
      };
    });
    const amount = _.sumBy(billItems, "amount");
    const { receiveNumber } = await getShopById(shopId);
    const promptpay = await generatePromptpay(receiveNumber, amount);
    const bill = await Bill.create({
      name,
      nameSearch,
      sequence,
      customer,
      shopId,
      orderId,
      amount,
      promptpay,
      items: billItems,
    });
    if (!!bill) {
      await inactiveOrder(shopId, orderId);
    }
    return bill;
  },
};

module.exports = { ...service };
