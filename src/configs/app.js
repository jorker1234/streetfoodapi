require("dotenv").config();
console.log(process.env.MONGODB_URI);
module.exports = {
  port: process.env.PORT || 3001,
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/streetfood",
  firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      bucket: process.env.FIREBASE_BUCKET,
  },
};
