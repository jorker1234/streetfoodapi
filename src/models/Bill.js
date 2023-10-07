const mongoose = require("mongoose");

const BillStatus = {
  INITIALIZE: "initialize",
  PAYMENT: "payment",
  QUEUE: "queue",
  COMPLETE: "complete",
  REJECT: "reject",
  CANCEL: "cancel",
};

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameSearch: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  note: { type: String },
  isActived: { type: Boolean, default: true },
});

const schema = new mongoose.Schema(
  {
    customer: { type: String, required: true },
    shopId: { type: mongoose.Schema.Types.ObjectId, required: true },
    shopName: { type: String, required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    promptpay: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(BillStatus),
      default: BillStatus.INITIALIZE,
    },
    name: { type: String },
    nameSearch: { type: String },
    sequence: { type: Number, default: 0 },
    items: { type: [ItemSchema], default: [] },
    isActived: { type: Boolean, default: true },
    imagePath: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

schema.index({ shopId: 1, _id: 1 }, { unique: true });

module.exports = {
  Bill: mongoose.model("Bill", schema),
  BillStatus,
};
