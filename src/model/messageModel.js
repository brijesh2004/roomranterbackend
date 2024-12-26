const mongoose=require("mongoose");

const messageSchema = mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'alluser'
    },
    senderName:{
        type:String,
        required:true,
        ref:'alluser'
    },
    receiverName:{
        type:String,
        required:true,
        ref:'alluser'
    },
    receiverId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'alluser',
    },
    lastTime:{
        type:String,
        default:Date.now,
    }
},
{timestams:true}
)
const Message = mongoose.model("Message" , messageSchema);

module.exports = Message;