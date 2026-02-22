const connectionSchema = require("../models/connectionSchema");
const UserModel = require("../models/userSchema.js");
const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");

requestRouter.post("/request/send/:status/:ToUserId", userAuth, async (req, res) => {
  try {
    const FromUserId = req.user._id; 
    const ToUserId = req.params.ToUserId;
    const status = req.params.status;

    const allowedStatus = ["ignore", "interested"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid request status");
    }

    if (FromUserId.toString() === ToUserId.toString()) {
      throw new Error("Cannot send request to yourself");
    }

    const user = await UserModel.findById(ToUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingRequest = await connectionSchema.findOne({
      $or: [
        { FromUserId, ToUserId },
        { FromUserId: ToUserId, ToUserId: FromUserId }
      ]
    });

    if (existingRequest) {
      throw new Error("Connection request already exists");
    }

    const connection = new connectionSchema({
      FromUserId,
      ToUserId,
      status
    });

    const data = await connection.save();

    res.status(201).json({
      message: "Connection request sent successfully",
      data
    });

  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    // Allowed status values
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status not allowed" });
    }

    // Find the connection request
    const connection = await connectionSchema.findOne({
      ToUserId: requestId,
      FromUserId: loggedInUser._id,
      status: "interested"
    });

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    // Update status
    connection.status = status;

    // Save in DB
    const data = await connection.save();

    res.json({
      message: `Connection request ${status}`,
      data
    });

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = {requestRouter};