require("dotenv").config();
module.exports = {
  port: process.env.PORT || 3001,
  origin: process.env.ORIGIN || "http://localhost:5173",
  tokenSecret: "22a1b2bafc7e770f72176f45ff1dfdb7283597101130517a30a8e0116f25b520",
  tokenAge: Number(process.env.TOKEN_AGE || 1000 * 60 * 30),
  database: {
    user: process.env.MONGODB_USER || "root",
    password: process.env.MONGODB_PASSWORD || "1234",
    host: process.env.MONGODB_HOST || "mongodb",
    port: process.env.MONGODB_DOCKER_PORT || "27017",
    name: process.env.MONGODB_DATABASE || "streetfood",
  },
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
