const _ = require("lodash");
const ObjectId = require("mongoose").Types.ObjectId;
const { Bill, BillStatus } = require("../models/Bill");
const { ErrorNotFound, ErrorForbidden } = require("../configs/errors");
const moment = require("moment");

const service = {
  async query({
    shopId,
    orderId = null,
    keyword,
    skip = 0,
    limit = 10,
    sort = { updatedAt: -1 },
    status = null,
    projection = null,
  }) {
    const filter = {
      shopId,
      isActived: true,
    };
    if (orderId) {
      filter.orderId = orderId;
    }
    if (status) {
      filter.status = status;
    }
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

  async getById(shopId, id) {
    if (!ObjectId.isValid(id)) {
      throw ErrorNotFound("bill is not exists.");
    }
    const bill = await Bill.findById(id).lean();
    if (!bill || !bill.isActived || bill.shopId.toString() !== shopId) {
      throw ErrorNotFound("bill is not exists.");
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
    updateStatusOrder,
  }) {
    const billExists = await Bill.findOne(
      { shopId, orderId },
      { isActived: 1 }
    ).lean();
    if (billExists && billExists.isActived) {
      throw ErrorForbidden("bill is exists.");
    }

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
        menuId: item.menuId,
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
    const { name: shopName, receiveNumber } = await getShopById(shopId);
    const promptpay = await generatePromptpay(receiveNumber, amount);
    const bill = await Bill.create({
      customer,
      shopId,
      shopName,
      orderId,
      amount,
      promptpay,
      items: billItems,
    });
    if (bill) {
      await updateStatusOrder(
        shopId,
        orderId,
        bill._id.toString(),
        BillStatus.INITIALIZE,
        customer
      );
    }
    return bill;
  },

  async update({ shopId, orderId, id, status, imagePath, imageUrl, updateStatusOrder }) {
    await this.getById(shopId, id);
    const updateCriteria = {
      status,
      imagePath,
      imageUrl,
    };
    if (status === BillStatus.CANCEL || status === BillStatus.REJECT) {
      updateCriteria.isActived = false;
    }
    if (status === BillStatus.COMPLETE) {
      updateCriteria.completedAt = moment().toDate();
    }
    if (status === BillStatus.QUEUE) {
      const sequence = (await this.getLastSequence(shopId)) + 1;
      const maxQueue = 100;
      const prefixSequence = Math.floor(sequence / maxQueue) % 26;
      const prefix = String.fromCharCode(65 + prefixSequence); // A=65 ... Z=90
      const name = prefix + (sequence % maxQueue);
      const nameSearch = name.toLowerCase();
      updateCriteria.name = name;
      updateCriteria.nameSearch = nameSearch;
      updateCriteria.sequence = sequence;
    }
    const bill = await Bill.findByIdAndUpdate(id, updateCriteria, {
      new: true,
    });
    if (bill) {
      await updateStatusOrder(shopId, orderId, id, status);
    }
    return bill;
  },
};

module.exports = { ...service };
