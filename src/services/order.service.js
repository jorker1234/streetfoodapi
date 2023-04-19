const _ = require("lodash");
const ObjectId = require("mongoose").Types.ObjectId;
const Order = require("../models/Order");
const { ErrorNotFound } = require("../configs/errors");

const service = {
  async query({
    shopId,
    skip = 0,
    limit = 10,
    sort = { updatedAt: -1 },
    projection = null,
  }) {
    const filter = {
      shopId,
      isActived: true,
    };
    const orders = await Order.find(filter, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    return orders;
  },

  async getById(shopId, id) {
    const order = await Order.findById(id).lean();
    if (!order || !order.isActived || order.shopId.toString() !== shopId) {
      throw ErrorNotFound("order is not exists.");
    }
    return order;
  },

  async getItemById(shopId, orderId, orderItemId) {
    const order = await Order.findOne({
      _id: orderId,
      shopId,
      "items._id": orderItemId,
    }).lean();
    if (!order || !order.isActived) {
      throw ErrorNotFound("order is not exists.");
    }
    return order;
  },

  async add({ shopId, orderId, menuId, quantity, note }) {
    const item = {
      menuId,
      quantity,
      note,
    };
    orderId = orderId ?? new ObjectId();
    return await Order.findOneAndUpdate(
      { _id: orderId, shopId },
      {
        shopId,
        $push: { items: item },
      },
      { upsert: true, new: true }
    );
  },

  async edit({ shopId, orderId, orderItemId, quantity, note }) {
    return await Order.findOneAndUpdate(
      { _id: orderId, shopId, "items._id": orderItemId },
      {
        $set: {
          "items.$.quantity": quantity,
          "items.$.note": note,
        },
      },
      { new: true }
    );
  },

  async remove({ shopId, orderId, orderItemId }) {
    return await Order.findOneAndUpdate(
      { _id: orderId, shopId },
      {
        $pull: { items: { _id: orderItemId } },
      },
      { new: true }
    );
  },

  async inactive(shopId, orderId) {
    return await Order.findOneAndUpdate(
      { _id: orderId, shopId },
      {
        isActived: false,
      },
      { new: true }
    );
  },
};

module.exports = { ...service };
