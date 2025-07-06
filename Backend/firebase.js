// firebase.js
const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require("./firebaseServiceKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "anibox-backend-id.appspot.com",
});

const bucket = admin.storage().bucket();

module.exports = bucket;
