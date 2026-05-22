const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!uri) {
  console.error("FAIL: MONGO_URI not found in Backend/.env");
  process.exit(1);
}

console.log("Testing MongoDB connection...");

mongoose
  .connect(uri)
  .then(() => {
    console.log("SUCCESS: Connected to", mongoose.connection.name);
    process.exit(0);
  })
  .catch((err) => {
    console.error("FAIL:", err.message);
    if (err.message.includes("bad auth")) {
      console.error("\nFix: MongoDB Atlas → Database Access → reset your user password");
      console.error("Then update MONGO_URI in Backend/.env with the new password");
    }
    if (err.message.includes("ENOTFOUND")) {
      console.error("\nFix: Check your internet and cluster hostname in the connection string");
    }
    process.exit(1);
  });
