const express=require("express");
const authRouter=express.Router();
const { validateSignUpData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const UserModel = require("../models/userSchema.js");
const jwt=require("jsonwebtoken");

authRouter.post("/Signup", async (req, res) => {
    const { FirstName, LastName, Email, Password, Gender } = req.body;
    
    try {
        // ✅ FIX 1: validateSignUpData expects req, but you're destructuring from req.body
        // You need to pass the full req object OR modify validation to accept individual fields
        validateSignUpData(req);
        const existingUser = await UserModel.findOne({ 
            Email: req.body.Email.toLowerCase().trim() 
        });
        
        if (existingUser) {
            return res.status(400).json({
                error: "Email already exists. Please use a different email."
            });
        }
        
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


authRouter.post("/login", async (req, res) => {
    try {
        const { Email, Password } = req.body;
        
        // Check if user exists
        const user = await UserModel.findOne({ Email: Email });
        
        if (!user) {
            return res.status(401).send("Invalid credentials");
        }
        
        // Verify password
        const passcheck = await bcrypt.compare(Password, user.Password);
        
        if (passcheck) {
            // ✅ FIX: Remove await, use user._id, and use the token in cookie
            const token = jwt.sign({ userId:user._id }, "rehanbhaiop", {
                expiresIn: "1d"  // Token expires in 1 day
            });
            
            // Set cookie with the actual JWT token
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
            
            res.send("Login successful");
        } else {
            res.status(401).send("Invalid credentials");
        }
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});

authRouter.post("/logout", async (req ,res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        
        res.json({ message: "Logout successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Logout failed" });
    }
});


module.exports={
    authRouter
}