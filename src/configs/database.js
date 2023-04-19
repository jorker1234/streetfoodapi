const mongoose = require("mongoose");
const config = require("../configs/app");

const databases = {
  async mongoDB() {
    let db;
    try {
      db = await mongoose.connect(config.mongodbUri);
      console.log("MongoDB connected");
    } catch (error) {
      console.error(`MongoDB error: ${error}`);
    }
    return db;
  },
};

module.exports = databases;
