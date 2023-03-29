const mongoose = require("mongoose");

const posttoomSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    City:{
        type:String,
        required:true
    },
    Pincode:{
        type:String,
        required:true
    },
     Type:{
        type:String,
        required:true
     },
    Place:{
        type:String,
        required:true
    },
    HouseNumber:{
    type:String,
    required:true
    },
    MobileNumber:{
     type:Number,
     required:true
    }, 
    RoomType:{
        type:String,
        required:true
    }
})



const newRoom = mongoose.model('newRoom',posttoomSchema);

module.exports = newRoom;