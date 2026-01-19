const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js"); // ✅ Fixed: Added destructuring
const connectionSchema = require("../models/connectionSchema.js"); // ✅ Fixed: Added import

userRouter.get("/request/received", userAuth, async (req, res) => { // ✅ Fixed: aysnc → async
    try {
        const userid = req.user._id; 
        
        const connectionRequests = await connectionSchema.find({ // ✅ Fixed: connections → connectionSchema
            ToUserId: userid,
            status: "interested",
        }).populate("FromUserId", ["FirstName", "LastName"]);

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests
        });

    } catch (error) {
        res.status(400).json({ message: error.message }); // ✅ Better: Use 400 and JSON
    }
});


userRouter.get("/request/connections",userAuth, async (req,res)=>{
    try{
        const user=req.user._id;

        const connections= await connectionSchema.find({
            $or:[{
                FromUserId:user,status:"accepted"
            },
        {
            ToUserId:user,status:"accepted"
        }]
            
        })
        
        res.json({
            message: "Data fetched successfully",
            data: connections
        });

    }catch(error){
        res.status(404).send(error.message);
    }
})

module.exports ={ userRouter};