const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameSearch: { type: String, required: true },
    shopId: { type: mongoose.Schema.Types.ObjectId, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    isActived: { type: Boolean, default: true },
    imagePath: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

schema.index(
  { shopId: 1, _id: 1 },
  { unique: true }
);

module.exports = mongoose.model("Menu", schema);
