const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');
const config = require('../configs/app');

const firebaseApp = initializeApp(config.firebase);
module.exports = getStorage(firebaseApp, config.firebase.bucket);