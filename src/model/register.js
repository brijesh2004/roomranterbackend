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
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    mobile: {
        type: String
    },
    place: {
        type: String
    },
    roomdetails: {
        type: String,
    },
    price: {
        type: String
    },
    CreatedAt:{
        type:String,
        default:Date.now
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
