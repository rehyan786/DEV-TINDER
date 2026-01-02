const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const connectDB = require("./config/Database.js");
const UserModel = require("./models/userSchema.js");
const { validateSignUpData } = require("./utils/validation.js");
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.js");



const {authRouter}= require("./routes/auth.js");
const {profileRouter}= require("./routes/profile.js");





// Add middleware to parse JSON
app.use(express.json()); 
app.use(cookieParser()); 


app.use("/",authRouter);
app.use("/",profileRouter);

app.get("/", (req, res) => {
    res.send("Hello from the server!");
});


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

