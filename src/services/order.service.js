const _ = require("lodash");
const ObjectId = require("mongoose").Types.ObjectId;
const { Order, OrderStatus } = require("../models/Order");
const { BillStatus } = require("../models/Bill");
const { ErrorNotFound } = require("../configs/errors");

const service = {
  async query({
    shopId,
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
    if(status) {
      filter.OrderStatus = status;
    }
    const orders = await Order.find(filter, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    return orders;
  },

  async getById(shopId, id) {
    if (!ObjectId.isValid(id)) {
      throw ErrorNotFound("order is not exists.");
    }
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

  async create({ shopId, customer }) {
    const orderId = new ObjectId();
    return await Order.findOneAndUpdate(
      { _id: orderId, shopId },
      {
        shopId,
        customer,
      },
      { upsert: true, new: true }
    );
  },

  async update({ shopId, id, menuId, quantity, note }) {
    const order = await this.getById(shopId, id);
    const item = _.find(
      order.items,
      (item) => item.menuId.toString() === menuId
    );
    if (!item && quantity === 0) {
      return order;
    }

    const searchCriteria = { _id: id, shopId };
    let updateCriteria = null;
    if (!item && quantity > 0) {
      updateCriteria = {
        $push: {
          items: {
            menuId,
            quantity,
            note,
          },
        },
      };
    }
    if (item && quantity > 0) {
      searchCriteria["items._id"] = item._id;
      updateCriteria = {
        $set: {
          "items.$.quantity": quantity,
          "items.$.note": note,
        },
      };
    }
    if (item && quantity === 0) {
      updateCriteria = {
        $pull: { items: { _id: item._id } },
      };
    }

    return await Order.findOneAndUpdate(searchCriteria, updateCriteria, {
      new: true,
    });
  },

  // async add({ shopId, orderId, menuId, quantity, note }) {
  //   const item = {
  //     menuId,
  //     quantity,
  //     note,
  //   };
  //   orderId = orderId ?? new ObjectId();
  //   return await Order.findOneAndUpdate(
  //     { _id: orderId, shopId },
  //     {
  //       shopId,
  //       $push: { items: item },
  //     },
  //     { upsert: true, new: true }
  //   );
  // },

  // async edit({ shopId, orderId, orderItemId, quantity, note }) {
  //   return await Order.findOneAndUpdate(
  //     { _id: orderId, shopId, "items._id": orderItemId },
  //     {
  //       $set: {
  //         "items.$.quantity": quantity,
  //         "items.$.note": note,
  //       },
  //     },
  //     { new: true }
  //   );
  // },

  // async remove({ shopId, orderId, orderItemId }) {
  //   return await Order.findOneAndUpdate(
  //     { _id: orderId, shopId },
  //     {
  //       $pull: { items: { _id: orderItemId } },
  //     },
  //     { new: true }
  //   );
  // },

  // async inactive(shopId, orderId) {
  //   return await Order.findOneAndUpdate(
  //     { _id: orderId, shopId },
  //     {
  //       isActived: false,
  //     },
  //     { new: true }
  //   );
  // },

  async updateStatus(shopId, orderId, billId, billStatus, customer) {
    const updateCriteria = {
      billId,
    };
    if (!!customer) {
      updateCriteria.customer = customer;
    }
    if (billStatus === BillStatus.INITIALIZE) {
      updateCriteria.status = OrderStatus.PAYMENT_REQUEST;
    }
    if (billStatus === BillStatus.PAYMENT) {
      updateCriteria.status = OrderStatus.PAYMENT_COMMIT;
    }
    if (billStatus === BillStatus.QUEUE) {
      updateCriteria.status = OrderStatus.QUEUE;
    }
    if (billStatus === BillStatus.COMPLETE) {
      updateCriteria.status = OrderStatus.COMPLETE;
    }
    if (billStatus === BillStatus.REJECT || billStatus === BillStatus.CANCEL) {
      updateCriteria.billId = null;
      updateCriteria.status = OrderStatus.INITIALIZE;
    }
    return await Order.findOneAndUpdate(
      { _id: orderId, shopId },
      updateCriteria,
      { new: true }
    );
  },
};

module.exports = { ...service };
