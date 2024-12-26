const Message = require("../model/messageModel");
const {User} = require("../model/register");
const Chat = require("../model/chatModel");


//@description     Get all Messages
//@route           GET /api/Message/
//@access          Protected

const allMessages = async (req , res)=>{
    try{
        const userId = req.userID;
        const messages = await Message.find({
            $or:[
                {senderId:userId},
                {receiverId:userId},
            ]
        })
        return res.status(200).json({messages:messages});
    }
    catch(error){
        return res.status(400).json({error:"Error"});
    }
}

// //@description     Create New Message
// //@route           POST /api/Message/
// //@access          Protected
// const sendMessage = async(req , res)=>{
//     const {content , chatId} = req.body;

//     if(!content || !chatId){
//         console.log("Invalid data passed into request");
//         return res.status(400).json("Error");
//     }

//     let newMessage = {
//         sender:req.user._id,
//         content:content,
//         chat:chatId,
//     };

//     try{
//         let message = await Message.create(newMessage);
//         message = await message.populate("sender" ,"name").execPopulate();
//         message = await message.populate("chat").execPopulate();
//         message = await User.populate(message , {path:'chat.users',
//             select:"name email",
//         });
//         await Chat.findByIdAndUpdate(req.body.chatId , {latestMessage:message});
//         return res.status(200).json({data:message});
//     }
//     catch(error){
//      return res.status(400).json({error:error})
//     }
// }

module.exports = {allMessages};