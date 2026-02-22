const express = require("express");
const userRouter= express.Router();
const UserModel = require("../models/userSchema.js");
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
        }).populate("FromUserId",["FirstName", "LastName"])
        
        res.json({
            message: "Data fetched successfully",
            data: connections
        });

    }catch(error){
        res.status(404).send(error.message);
    }
})


userRouter.get("/feed",userAuth, async (req,res)=>{
    try{
        const loggedIn=req.user;
        

        const connection= await connectionSchema.find({
            $or:[
                {FromUserId:loggedIn._id},
                {ToUserId:loggedIn._id}
              
            ]
        });
        
        const hidefromfeed=new Set();
        connection.forEach((req) => {
                     hidefromfeed.add(req.ToUserId.toString());
                     hidefromfeed.add(req.FromUserId.toString());
        });

        const feedUser=await UserModel.find({
            $and:[
                {
                   _id: {$nin: Array.from(hidefromfeed)}

                },
                {_id: {$ne: loggedIn._id}}
            ]
        }).select("FirstName LastName");

        res.send(feedUser);






    }catch(err){
        res.status(404).send(err.message);
    }
})

module.exports ={ userRouter};