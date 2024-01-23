const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    rooms: [
        {
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
            roomtype: {
                type: String
            },
            date: {
                type: Date
            },
            location: {
                type: String
            },
            price:{
                type:String
            }
        }
    ],

    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]

});



// for the room
const alltheRoomSchema = new mongoose.Schema({
    allrooms: [
        {    
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
            roomtype: {
                type: String
            },
            date: {
                type: Date
            },
            location: {
                type: String
            },
            price:{
            type:String
            },
            referenceID:{
                type:String,
            }
        }
    ]
});

const AlltheRoom = mongoose.model('AlltheRoom', alltheRoomSchema);

alltheRoomSchema.methods.addAllRoomsinArray = async function (roomrenterName, country, state, city, mobile, place, roomtype, date, location,price , referenceID) {
    try {
        const newRoom = {
            roomrenterName,
            country,
            state,
            city,
            mobile,
            place,
            roomtype,
            date: new Date(date),
            location,
            price,
            referenceID
        };
        this.allrooms.unshift(newRoom)
        await this.save();
        return this.allrooms;
    } catch (err) {
        throw err;
    }
}

userSchema.methods.addRoom = async function (roomrenterName, country, state, city, mobile, place, roomtype, date, location , price) {
    try {
        const newRooms = {
            roomrenterName,
            country,
            state,
            city,
            mobile,
            place,
            roomtype,
            date: new Date(date),
            location,
            price
        }
        this.rooms.unshift(newRooms);
        await this.save();
         return this.rooms;
    } catch (err) {
        throw err;
    }
}



// hashing the password

userSchema.pre('save' , async function(next){
   if(this.isModified('password')){
    this.password=await bcrypt.hash(this.password , 12);
    this.cpassword = await bcrypt.hash(this.cpassword , 12);
   }
   next();
})

userSchema.methods.generateAutoToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, `${process.env.TOKENKEY}`);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        throw err
    }
}

const User = mongoose.model('user', userSchema);


module.exports = { User , AlltheRoom };
