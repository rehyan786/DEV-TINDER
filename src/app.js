const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const connectDB = require("./config/Database.js");
const UserModel = require("./models/userSchema.js");
const { validateSignUpData } = require("./utils/validation.js");

// Add middleware to parse JSON
app.use(express.json()); 

app.get("/", (req, res) => {
    res.send("Hello from the server!");
});

// Signup Route - FIXED ✅
app.post("/Signup", async (req, res) => {
    const { FirstName, LastName, Email, Password, Gender } = req.body;
    
    try {
        // ✅ FIX 1: validateSignUpData expects req, but you're destructuring from req.body
        // You need to pass the full req object OR modify validation to accept individual fields
        validateSignUpData(req);
        
        // ✅ FIX 2: bcrypt.hash is async, needs await
        const Password_hash = await bcrypt.hash(Password, 10);
        
        // ✅ FIX 3: Wrong syntax - should be UserModel() not User{}
        const user = new UserModel({
            FirstName,
            LastName,
            Email,
            Password: Password_hash,
            Gender
        });
        
        await user.save();
  
        res.status(201).json({
            message: "User added successfully",
            data: user,
        });
    } catch (err) {
        res.status(400).json({
            error: err.message,
        });
    }
});

// Get all users (Feed)
app.get("/feed", async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});

// Get user by email (Query parameter)
app.get("/user", async (req, res) => {
    const userEmail = req.query.email;
    
    if (!userEmail) {
        return res.status(400).send("Email is required");
    }
    
    try {
        const user = await UserModel.findOne({ Email: userEmail });
        
        if (!user) {
            return res.status(404).send("User not found");
        }
        
        res.send(user);
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});

// Update user - FIXED ✅
app.patch("/user/:userId", async (req, res) => {  // ✅ FIX 4: Changed :userIdno to :userId
    const userId = req.params.userId;
    const data = req.body;
    
    try {
        const Allowed_updates = ["FirstName", "LastName", "Password", "Gender"];
        
        const updates = Object.keys(data);
        const isUpdateAllowed = updates.every(k => Allowed_updates.includes(k));
        
        if (!isUpdateAllowed) {
            return res.status(400).send("Update not allowed");
        }
        
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            data,
            {
                runValidators: true,
                new: true,
                context: 'query'
            }
        );
        
        if (!updatedUser) {
            return res.status(404).send("User not found");
        }
        
        res.send({
            message: "Data updated successfully",
            data: updatedUser
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).send("Validation Error: " + error.message);
        }
        res.status(500).send("Error: " + error.message);
    }
});

// Delete user
app.delete("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    
    try {
        const deletedUser = await UserModel.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return res.status(404).send("User not found");
        }
        
        res.send("User deleted successfully");
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});

connectDB()
    .then(() => {
        console.log("Database connected");
        app.listen(5000, () => {
            console.log("Server is running on port 5000");
        });
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });