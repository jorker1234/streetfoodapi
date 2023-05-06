const mongoose = require("mongoose");

const OrderStatus = {
  INITIALIZE: "initialize",
  PAYMENT_REQUEST: "paymentRequest",
  PAYMENT_COMMIT: "paymentCommit",
  QUEUE: "queue",
  COMPLETE: "complete",
};

const ItemSchema = new mongoose.Schema(
  {
    menuId: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true },
    note: { type: String },
    isActived: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const schema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, required: true },
    items: { type: [ItemSchema], default: [] },
    isActived: { type: Boolean, default: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.INITIALIZE,
    },
  },
  { timestamps: true }
);

schema.index({ shopId: 1, _id: 1 }, { unique: true });

module.exports = {
  Order: mongoose.model("Order", schema),
  OrderStatus,
};
