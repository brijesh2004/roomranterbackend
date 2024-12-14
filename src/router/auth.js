const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const express = require("express");
const cors = require("cors");
require('dotenv').config()
const router = express.Router();
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');
const multer = require("multer");
require("../db/conn");
router.use(cookieParser());
const secret = process.env.TOKENKEY;

const { User, UserRoom } = require("../model/register");

const authenticate = require("../middelware/authenticate");
router.use(
    cors({
        origin: process.env.LOCALPATH,
        methods: ['GET', 'POST', 'DELETE', 'UPDATE'],
        credentials: true
    })
)
const storage = multer.diskStorage({});
const upload = multer({ storage });


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});


router.get('/', (req, res) => {
    res.send("<h1>Hello World</h1>");
})

router.post("/register", async (req, res) => {
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
            return res.status(201).json({ message: "User Registerd Successfully" });
        }
    }
    catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }

})



router.post('/signin', async (req, res) => {
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
            return res.json({ message: "user signin Successfully" });
        }
        else {
            res.status(400).json({ error: "invalid user credentials" });
        }
    } catch (err) {

        return res.status(500).json({ error: "Sever error" });
    }
})


router.get('/about', authenticate, (req, res) => {
    try {
        const data = req.rootUser;
        return res.status(200).json({ data: data.name });
    }
    catch (err) {
        return res.status(401).json({ err: "Unauthorized" });
    }
});



router.get('/profile', authenticate, async (req, res) => {
    try {
        const { _id, name, email } = req.rootUser;
        const data = {
            _id, name, email
        }
        if (!_id) {
            return res.status(400).json({ err: "User Not Found" });
        }
        const userRoom = await UserRoom.find({ userId: _id }).sort({ _id: -1 }).select('_id images city place roomdetails price CreatedAt');
        if (!userRoom) {
            return res.status(200).json({ data: data, rooms: [] });
        }
        return res.status(200).json({ data: data, rooms: userRoom });
    }
    catch (err) {
        return res.status(400).json({ err: "Error on Profile page" });
    }
})

router.get('/api', async (req, res) => {
    try {
        let { page = 1,city, place } = req.query;
        city=city.toLowerCase();
        page = Number(page);
        const skip = (page - 1) * 3;

        let query = {};
        if (city) query.city = new RegExp(city ,'i');
        if (place) query.place = new RegExp(place, 'i'); // Case-insensitive partial match for place
        let data;
        data = await UserRoom.find(query).sort({ _id: -1 }).select('_id images city place roomdetails price CreatedAt').skip(skip).limit(3);
        return res.status(200).json({ data });
    } catch (err) {
        return res.status(500).send('Server Error');
    }
});


router.post("/uploadImages", authenticate, upload.array("images", 10), async (req, res) => {
    const userId = req.userID;
    const id = req.query.id;
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const uploadResults = [];

        // Upload each file to Cloudinary
        for (const file of req.files) {
            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: "uploads", // Optional: specify folder name
            });
            uploadResults.push(uploadResult.secure_url);
        }
        const roomdata = await UserRoom.findById(id);
        roomdata.images=uploadResults;
        await roomdata.save();
        // Respond with details of all uploaded files
        return res.status(200).json({
            message: "Files uploaded successfully",
            uploadedFiles: uploadResults, // Array of uploaded file details
        });
    } catch (err) {
        return res.status(500).json({ message: "Error while uploading files" });
    }
});




router.get("/getcity", async (req, res) => {
    try {
        const cities = await UserRoom.aggregate([
            {
                $group: {
                    _id: "$city", // Group by the city field
                    count: { $sum: 1 } // Count the number of occurrences for each city
                }
            },
        ]);

        return res.status(201).json({ data: cities });
    }
    catch (error) {
        return res.status(500).send('Server Error');
    }
})






// router.post('/changePass', async (req, res) => {
//     try {
//         const { email, newpassword, cnewpassword } = req.body;

//         const UserRegister = await User.findOne({ email: email });

//         if (!UserRegister) {
//             return res.status(400).json({ error: 'Invalid  Email' });
//         }

//         if (newpassword !== cnewpassword) {
//             return res.status(400).json({ error: 'Password are not matching' });
//         }
//         UserRegister.password = newpassword;
//         UserRegister.cpassword = cnewpassword;

//         await UserRegister.save();
//         res.status(200).json({ message: 'Password reset successfully' });
//     }
//     catch (err) {
//         res.status(400).send(err);
//     }
// })




/// new code 

router.post("/roomupload", authenticate, async (req, res) => {
    try {
        const userId = req.userID;
        let { roomrenterName, country, state, city, mobile, place, roomdetails, price } = req.body;

        if (!roomrenterName || !country || !state || !city || !mobile || !place || !roomdetails || !price) {
            return res.status(406).json({ error: "please fill all the details carefully" });
        } else {
            mobile=parseInt(mobile);
            price=parseInt(price);
            country=country.toLowerCase();
            state=state.toLowerCase();
            city=city.toLowerCase();
            const newRoom = new UserRoom({ roomrenterName, country, state, city, mobile, place, roomdetails, price, userId });
            await newRoom.save();
            return res.status(201).json({ message: "Room added Successfully",
                id:newRoom._id,
             });
        }
    }
    catch (err) {
       return res.status(500).json({ error: err.message });
    }
});



router.delete('/delete/myModel/:id', authenticate, async (req, res) => {
    try {
        const userId = req.userID; // Get the userId from the authenticated user
        const roomId = req.params.id;

        // Find the room by ID
        const room = await UserRoom.findById(roomId);
        if (!room) {
            return res.status(404).json({ mess: "Room not found" });
        }

        // Check if the userId matches the room's userId
        if (room.userId.toString() !== userId.toString()) {
            return res.status(403).json({ mess: "You are not authorized to delete this room" });
        }

        // Delete the room if the userId matches
        await UserRoom.findByIdAndDelete(roomId);
        return res.status(200).json({ mess: "Room Deleted" });
    } catch (error) {
        res.status(500).json({ err: "Error while deleting the data" });
    }
});


// feching the others user details
router.get('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select("name");
        if (!user) {
            return res.status(400).json({ err: "User Not found" });
        }
        const rooms = await UserRoom.find({userId}).sort({ _id: -1 }).select('_id images city place roomdetails price CreatedAt');
        if (!rooms) {
            return res.status(200).json({ mess: user, rooms: [] });
        }
        return res.status(200).json({ mess: user, rooms: rooms });
    }
    catch {
        res.status(200).json({ err: "error" })
    }
})

router.get("/userroom/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const userRoom = await UserRoom.find({ userId });
        return res.status(200).json({ data: userRoom });
    }
    catch (err) {
        res.status(400).json({ err: "Error" });
    }
})


router.get("/logout", (req, res) => {
    try {
        res.cookie("jwttoken", '', {
            expires: 0,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });
        return res.status(200).json({ data: "user logout" });
    }
    catch (err) {
        return res.status(401).json({ err: "Error" });
    }
})

router.get("/room", async (req, res) => {
    try {
        const { id } = req.query; 
        const findRoom = await UserRoom.findById(id);
        if (!findRoom) {
            return res.status(404).json({ error: "Room not found" }); 
        }
        return res.status(200).json({ data: findRoom });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "Error while fetching the data" });
    }
});


router.get("/similarrooms" , async (req , res)=>{
    try{
      const city = req.query.city;
      const similarroom = await UserRoom.find({city}).sort({_id:-1}).limit(5);
      return res.status(200).json({data:similarroom});
    }
    catch(error){
        return res.status(400).json({error:"Error while fetching similar rooms"})
    }
})



module.exports = router;