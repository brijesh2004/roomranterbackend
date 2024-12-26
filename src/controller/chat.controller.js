const Chat = require("../model/chatModel");
const Message = require("../model/messageModel");
const { User } = require("../model/register");


//@description     fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected

const accessChat = async (req, res) => {
    try{
        const  userId  = req.userID;
        const {receiverId} = req.body;
        if (!userId) {
            return res.status(400).json({ error: "Provide the User id" });
        }
        const chat = await Chat.find({
            $or: [
                { sender: userId, receiver: receiverId},
                { sender: receiverId, receiver: userId }
            ],
        });
        return res.status(200).json({chat:chat});
    }
    catch(error){
     return res.status(400).json({error:'Error'});
    }
   
   
}


//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected

const sendChat = async (req, res) => {
   try{
   const userId = req.userID;
   const {receiverId , message} = req.body;
   if(!receiverId||!message){
    return res.status(400).json({error:"please enter all field"});
    }
   const isListPresent = await Message.findOne({
      $or:[
        {senderId:userId, receiverId:receiverId},
        {senderId:receiverId , receiverId:userId},
      ]
   })

   if(!isListPresent){
      const sender = await User.findById(userId).select('name');
      const senderName = sender.name;
      const receiver = await User.findById(receiverId).select('name');
      const receiverName = receiver.name;
      const newList = new Message({
        senderId:userId,
        senderName,
        receiverName,
        receiverId
      })
      await newList.save();
   }
  
   const newMessage = new Chat({sender:userId ,receiver:receiverId , message});
   await newMessage.save();
   return res.status(201).json({message:"Message Send" , newMessage:newMessage});
   }
   catch(error){
    return res.status(400).json({error:"Error"});
   }
}

module.exports = {
    accessChat ,
    sendChat
};