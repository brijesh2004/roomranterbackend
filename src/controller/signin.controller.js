const jwt = require("jsonwebtoken");
require('dotenv').config()
const bcrypt = require("bcryptjs");
const secret = process.env.TOKENKEY;

const { User} = require("../model/register");


const signInController = async (req , res)=>{ 
 try {
         const { email, password } = req.body;
         if (!email || !password) {
             return res.status(400).json({ error: "Please filled the data" });
         }
 
         const userLogin = await User.findOne({ email: email });
         if (userLogin) {
             const isMatch = await bcrypt.compare(password, userLogin.password);
             if (!isMatch) {
                 return res.status(400).json({ error: "Invalid User Credential" })
             }
 
             const token = jwt.sign({ id: userLogin._id }, secret);
             //   cookie store  
             res.cookie("jwttoken", token, {
                 expires: new Date(Date.now() + 25892000000),
                 httpOnly: true,
                 sameSite: 'none',
                 secure: true
             });
             return res.status(201).json({ message: "user signin Successfully" , user:userLogin});
         }
         else {
             res.status(400).json({ error: "invalid user credentials" });
         }
     } catch (err) {
 
         return res.status(500).json({ error: "Sever error" });
     }
}


module.exports = signInController;