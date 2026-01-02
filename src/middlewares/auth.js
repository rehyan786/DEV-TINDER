const jwt = require("jsonwebtoken");
const UserModel = require("../models/userSchema.js");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        
        if (!token) {
            return res.status(401).send("Please login first");
        }
        
        // ✅ Remove await - jwt.verify is synchronous
        const decodedobj = jwt.verify(token, "rehanbhaiop"); // ✅ Match secret key
        
        const { userId } = decodedobj; // ✅ Use userId (as set in login route)
        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(401).send("User not found");
        }
        
        // ✅ Attach user to request object for use in next middleware/route
        req.user = user;
      
        // res.send("profile load hogya");
        next();
   
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send("Invalid token");
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send("Token expired");
        }
        res.status(401).send("Authentication failed: " + error.message); // ✅ Send error message
    }
};

module.exports = {
    userAuth
};