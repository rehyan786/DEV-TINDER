const express=require("express");
const profileRouter=express.Router();
const { validateSignUpData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const UserModel = require("../models/userSchema.js");
const jwt=require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth.js");
const { valideditprofile }=require("../utils/validation.js");
const { ValidPasswordChange }=require("../utils/validation.js");



profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        // req.user is already available from userAuth middleware
        res.send({
            message: "Profile fetched successfully",
            data: req.user
        });
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        // Validate the edit request (this throws error if invalid)
        valideditprofile(req);
        
        // Get user ID (req.user might be lean object)
        const userId = req.user._id;
        
        // Prepare updates from request body
        const updates = {};
        const allowedFields = ["FirstName", "LastName", "Gender"];
        
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });
        
        // Update user in database
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            updates,
            { 
                new: true,              // Return updated document
                runValidators: true,    // Run schema validators
                select: "-Password"     // Exclude password
            }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Send response ONCE
        res.json({
            message: "Profile updated successfully",
            data: updatedUser
        });
        
    } catch (err) {
        console.error("Profile edit error:", err.message);
        res.status(400).json({ 
            error: err.message || "Failed to update profile" 
        });
    }
});


profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        // Validate password change request
        await ValidPasswordChange(req); // ✅ Added await
        
        // Get user ID
        const userId = req.user._id;
        
        // Hash new password
        const newPassword = req.body.newPassword; // ✅ Get from req.body
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update user password
        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        user.Password = hashedPassword;
        await user.save(); // ✅ Added await
        
        // Send success response
        res.json({
            message: "Password updated successfully"
        });
        
    } catch (err) {
        console.error("Password update error:", err.message);
        res.status(400).json({ 
            error: err.message || "Failed to update password" 
        });
    }
});



module.exports={
    profileRouter
}