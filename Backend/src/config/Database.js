const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGO_URI is missing. Add it to Backend/.env (see .env.example)."
    );
  }

  await mongoose.connect(uri);
  console.log("CONNECTED TO:", mongoose.connection.name);
};

module.exports = connectDB;
