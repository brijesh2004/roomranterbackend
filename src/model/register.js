const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name : {
        type:String ,
        required:true
    },
    email:{
        type:String , 
        required:true
    },
    password:{
        type:String , 
        required:true
    },
    cpassword:{
        type:String , 
        required:true
    },
    tokens:[
        {
            token:{
                type:String ,
                required:true
            }
        }
    ]

})

// post the room details schema
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
        type:Number,
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
    type:String
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



// we are hashing the password 

userSchema.pre('save' , async function(next) {
    
   if(this.isModified('password')){
      this.password =await bcrypt.hash(this.password , 12);
      this.cpassword =await bcrypt.hash(this.cpassword , 12);
    
   }
   next();
})

// generating the auto tokens 

   userSchema.methods.generateAutoToken = async function(){
    try{
    let token = jwt.sign({_id: this._id} , "iambrijeshsinghfrommadanmohanmalaviya");
    this.tokens = this.tokens.concat({token:token});
    await this.save();
    return token;
    }
    catch(err){
        console.log(err);
    }
   }


const User = mongoose.model('user',userSchema);
const Postroom = mongoose.model('Postroom' ,posttoomSchema);

module.exports = { User, Postroom };