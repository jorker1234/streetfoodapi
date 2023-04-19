const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameSearch: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    note: { type: String },
    isActived: { type: Boolean, default: true },
  },
);

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameSearch: { type: String, required: true },
    sequence: { type: Number, required: true },
    customer: { type: String, required: true },
    shopId: { type: mongoose.Schema.Types.ObjectId, required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    promptpay: { type: String, required: true },
    items: { type: [ItemSchema], default: [] },
    isActived: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", schema);
