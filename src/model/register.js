const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique:true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});


const UserRoomSchema = new mongoose.Schema({
    roomrenterName: {
        type: String,
        required:true,
    },
    country: {
        type: String,
        required:true,
    },
    state: {
        type: String,
        required:true,
    },
    city: {
        type: String,
        required:true,
    },
    mobile: {
        type: Number,
        required:true,
    },
    place: {
        type: String,
        required:true,
    },
    roomdetails: {
        type: String,
        required:true,
    },
    price: {
        type: Number,
        required:true,
    },
    CreatedAt:{
        type:String,
        default:Date.now
    },
    images:{
     type:[String]
    },
    userId:{
        type:String,
    }
})



// userSchema.methods.generateAutoToken = async function () {
//     try {
//         let token = jwt.sign({ _id: this._id }, `${process.env.TOKENKEY}`);
//         // this.tokens = this.tokens.concat({ token: token });
//         // await this.save();
//         return token;
//     } catch (err) {
//         throw err
//     }
// }

const User = mongoose.model('alluser', userSchema);
const UserRoom = mongoose.model("userroom" , UserRoomSchema);

module.exports = { User, UserRoom };
