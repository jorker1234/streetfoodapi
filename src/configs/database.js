const mongoose = require("mongoose");
const {database: {user, password, host, port, name}} = require("../configs/app");

const databases = {
  async mongoDB() {
    let db;
    try {
      //const mongoUri = `mongodb://${user}:${password}@${host}:${port}/${name}?authSource=admin`;
      const mongoUri = `mongodb+srv://${user}:${password}@${host}/${name}?retryWrites=true&w=majority`;
      db = await mongoose.connect(mongoUri);
      console.log("MongoDB connected");
    } catch (error) {
      console.error(`MongoDB error: ${error} : ${mongoUri}`);
    }
    return db;
  },
};

module.exports = databases;
