const mongoose = require("mongoose");

const chatModel = mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'alluser',
    },
    receiver:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'alluser'
    },
    message: {
        type: String,
        required:true,
    },
},
    { timestams: true }
)

const Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;