const mongoose=require("mongoose");


const connectionSchema=new mongoose.Schema({
    
        FromUserId:{
            type:mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        ToUserId:{
            type:mongoose.Schema.Types.ObjectId,
            required: true
        },
        status:{
            type: String,
            enum:{
                values:["ignore","interested","accepted","rejected"],
                message:"{VALUE} is incorrect status type"
            }

        }
    
},
{
    timestamps: true
})

const connections = mongoose.model("connections", connectionSchema);

module.exports = connections;