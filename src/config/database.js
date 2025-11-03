const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://mdrehyana1380_db_user:yz0lC3PPPVSvyeJ6@dev-tinder.ok7sfc5.mongodb.net/"
    );
};



module.exports=connectDB;


