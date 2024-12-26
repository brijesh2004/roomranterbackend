const jwt = require("jsonwebtoken");
require('dotenv').config()
const bcrypt = require("bcryptjs");
const secret = process.env.TOKENKEY;

const { User} = require("../model/register");


const registerController = async (req , res)=>{
    let { name, email, password, cpassword } = req.body;

    if (!name || !email || !password || !cpassword) {
        return res.status(422).json({ error: "All filled is required" });
    }

    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "User Already Exist Please Login" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "Password are not matching" });
        }
        else {
            // hashing the password 
            password = await bcrypt.hash(password, 10);

            const user = new User({ name, email, password });
            await user.save();
            const token = jwt.sign({ id: user._id }, secret);
            //   cookie store  
            res.cookie("jwttoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true,
                sameSite: 'none',
                secure: true
            });
            return res.status(201).json({ message: "User Registerd Successfully" , user:user });
        }
    }
    catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
}


module.exports = registerController;