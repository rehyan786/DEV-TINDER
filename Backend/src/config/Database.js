const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://mdrehyana1380_db_user:yz0lC3PPPVSvyeJ6@dev-tinder.ok7sfc5.mongodb.net/devtinder"
        );
        console.log("CONNECTED TO:", mongoose.connection.name);   // <--- ADD THIS
    } catch (error) {
        console.log("DB CONNECTION ERROR:", error.message);
    }
};

module.exports = connectDB;