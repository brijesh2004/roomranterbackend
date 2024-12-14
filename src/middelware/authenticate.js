const jwt = require("jsonwebtoken");
const {User} = require("../model/register");
require("dotenv").config();

const authenticate = async (req , res , next) => {
    try{
        const token = req.cookies.jwttoken;
        const verifyToken = jwt.verify(token , `${process.env.TOKENKEY}`);
        const rootUser = await User.findById({_id : verifyToken.id});

        if(!rootUser){
            throw new Error("User Not Found");
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();

    }
    catch(err){
       return res.status(401).send("Unauthorized : No token Provided");
    }
}


module.exports = authenticate;