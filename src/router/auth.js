const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');


require("../db/conn");
router.use(cookieParser());

const { User, Postroom } = require("../model/register");
const authenticate = require("../middelware/authenticate");
router.use(
    cors({
      credentials:true,
      origin:['https://master--ornate-kheer-5bbba7.netlify.app/'],
      methods:['GET','POST'],
    })
  )
router.get('/', (req, res) => {
    res.send("<h1>Hello World</h1>");
})

router.post("/register", async (req, res) => {
    // console.log(req.body);
    const { name, email, password, cpassword } = req.body;

    if (!name || !email || !password || !cpassword) {
        return res.status(422).json({ error: "All filled is required" });
    }

    try {
        const userExist = await User.findOne({email:email});
        console.log("user Exist");
        // console.log(userExist);
        if (userExist) {
            return res.status(422).json({ error: "User Already Exist Please Login" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "Password are not matching" });
        }
        else {
            const user = new User({ name, email, password, cpassword })

            // hashing the password 

            await user.save();
            res.status(201).json({ message: "User Registerd Successfully" });
        }
    }
    catch (err) {
        console.log("error occurs")
    }

})



router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(req.body);
        if (!email || !password) {
            return res.status(400).json({ error: "Please filled the data" });
        }

        const userLogin = await User.findOne({ email: email });
        // console.log(userLogin);
        if (userLogin) { 
            const isMatch = await bcrypt.compare(password, userLogin.password);
            // console.log(password);
            // console.log(userLogin.password);
            // console.log(isMatch);
            const token = await userLogin.generateAutoToken();
            // console.log(token);

            //   cookie store  
            res.cookie("jwttoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });


   
            if (!isMatch) {
                res.status(400).json({ error: "invalid user credentia" });
            }
            else {
                res.json({ message: "user signin Successfully" });
            }
        }
        else {
            res.status(400).json({ error: "invalid user credentials" });
        }



    } catch (err) {
        console.log(err);
    }
})

router.get('/about' , authenticate , (req,res) =>{
    // console.log("Hello My about");
    res.send(req.rootUser);
})

router.post('/postroom', async (req, res) => {
    console.log(req.body);
    const { Name,email, City,Pincode, Type, Place, HouseNumber, MobileNumber, RoomType } = req.body;
    
    if (!Name || !email || !City|| !Pincode || !Type || !Place || !HouseNumber || !MobileNumber || !RoomType) {
       console.log("All field required");
        return res.status(422).json({ error: "All filled is required" });
    }
    else {
        try {
            const userExist = await User.findOne({email:email});
            console.log("email "+email);
            if(userExist){
               const postroom = new Postroom({ Name,email, City,Pincode, Type, Place, HouseNumber, MobileNumber, RoomType });
                // const postroom = new Postroom(req.body);
                // console.log("prev");
                //    await postroom.save();
                console.log("postroom"+postroom);
                Postroom.create(postroom)
                    .then((document) => {
                        console.log('Document saved:', document);
                    })
                    .catch((error) => {
                        console.error('Error saving document:', error);
                    });
                // console.log("post");
                res.status(201).json({ message: "Room Details Send Successfully Thanks for using us" });
            }
            else{
                return res.status(421).json({ error: "Email Not Exist" });
            }
            
        }
        catch (error) {
            res.status(400).json({ error:"error" });
        }
    }

})

router.get('/profile' , authenticate , (req,res) => {
    res.send(req.rootUser);
})

router.get('/api', async (req, res) => {
    try {
      // Query the database for all data
      const data = await Postroom.find();
  
      // Send the data as the response
    //   console.log(data);
      res.send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

router.get("/logout" ,(req, res)=>{
    // console.log("hello my logout page");
  res.clearCookie('jwttoken',{path:'/'})
  res.status(200).send("user logout");
})


module.exports = router;