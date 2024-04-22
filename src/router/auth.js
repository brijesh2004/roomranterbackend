const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const router = express.Router();
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');
require('dotenv').config()

require("../db/conn");
router.use(cookieParser());

const { User, AlltheRoom } = require("../model/register");
const authenticate = require("../middelware/authenticate");
router.use(
    cors({
        credentials: true,
        origin: [`${process.env.LOCALPATH}`],
        methods: ['GET', 'POST', 'DELETE'],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
)
router.get('/', (req, res) => {
    res.send("<h1>Hello World</h1>");
})

router.post("/register", async (req, res) => {
    res.header('Access-Control-Allow-Origin', `${process.env.LOCALPATH}`);
    const { name, email, password, cpassword } = req.body;

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
            const user = new User({ name, email, password, cpassword })

            // hashing the password 

            await user.save();
            res.status(201).json({ message: "User Registerd Successfully" });
        }
    }
    catch (err) {
        res.status(500).json({ error: "Server Error" });
    }

})



router.post('/signin', async (req, res) => {
    res.header('Access-Control-Allow-Origin', `${process.env.LOCALPATH}`);
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please filled the data" });
        }

        const userLogin = await User.findOne({ email: email });
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            const token = await userLogin.generateAutoToken();

            //   cookie store  
            res.cookie("jwttoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true,
                sameSite: 'none',
                secure: true
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

        res.status(500).json({ error: "Sever error" });
    }
})

router.get('/about', authenticate, (req, res) => {
    res.header('Access-Control-Allow-Origin', `${process.env.LOCALPATH}`);
    res.send(req.rootUser);
})



router.get('/profile', authenticate, (req, res) => {
    res.header('Access-Control-Allow-Origin', `${process.env.LOCALPATH}`);
    const { _id, name, email, rooms } = req.rootUser;
    const data = {
        _id, name, email, rooms
    }
    res.send(data);
})

router.get('/api', async (req, res) => {
    //res.header('Access-Control-Allow-Origin', `http://localhost:3000`);

    res.header('Access-Control-Allow-Origin', `${process.env.LOCALPATH}`);
    
    try {
        // Query the database for all data
        const data = await AlltheRoom.find();

        // Send the data as the response
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});



router.get("/getcity", async (req, res) => {
    try {
        const data = await AlltheRoom.find({});
        const allRooms = data[0].allrooms;

        // Use JavaScript to extract city names from the array of objects
        const cityNames = allRooms.map(room => room.city.toLowerCase());

        // Use JavaScript to count occurrences of each city
        const cityCounts = cityNames.reduce((acc, city) => {
            acc[city] = (acc[city] || 0) + 1;
            return acc;
        }, {});

        // Convert the counts into an array of objects
        const cityCountsArray = Object.keys(cityCounts).map(city => ({
            city,
            count: cityCounts[city]
        }));
        res.json(cityCountsArray);

    }
    catch (error) {
        res.status(500).send('Server Error');
    }
})






router.post('/changePass', async (req, res) => {
    try {
        const { email, newpassword, cnewpassword } = req.body;

        const UserRegister = await User.findOne({ email: email });

        if (!UserRegister) {
            return res.status(400).json({ error: 'Invalid  Email' });
        }

        if (newpassword !== cnewpassword) {
            return res.status(400).json({ error: 'Password are not matching' });
        }
        UserRegister.password = newpassword;
        UserRegister.cpassword = cnewpassword;

        await UserRegister.save();
        res.status(200).json({ message: 'Password reset successfully' });
    }
    catch (err) {
        res.status(400).send(err);
    }
})




/// new code 

router.post("/roomupload", async (req, res) => {
    try {
        const date = new Date();
        const {
            roomrenterName,
            email,
            country,
            state,
            city,
            mobile,
            place,
            roomtype,
            location,
            price,
        } = req.body;

        if (
            !roomrenterName ||
            !email ||
            !country ||
            !state ||
            !city ||
            !mobile ||
            !place ||
            !roomtype ||
            !location ||
            !price
        ) {
            res
                .status(406)
                .json({ error: "please fill all the details carefully" });
        } else {
            const userRoom = await User.findOne({ email: email });
            let allroomsdata = await AlltheRoom.findOne();
            if (userRoom) {
                const addUserRoom = await userRoom.addRoom(
                    roomrenterName,
                    country,
                    state,
                    city,
                    mobile,
                    place,
                    roomtype,
                    date,
                    location,
                    price
                );

                const referenceID = addUserRoom[0]._id;
                const userId = userRoom._id;

                if (!allroomsdata) {
                    // If the collection is empty, create a new document
                    allroomsdata = new AlltheRoom();
                }

                if (allroomsdata.allrooms) {
                    allroomsdata.allrooms.unshift({
                        roomrenterName,
                        country,
                        state,
                        city,
                        mobile,
                        place,
                        roomtype,
                        date,
                        location,
                        price,
                        referenceID,
                        userId
                    });

                    await allroomsdata.save();
                } else {
                    allroomsdata.allrooms = [];
                    const data = await allroomsdata.addAllRoomsinArray(
                        roomrenterName,
                        country,
                        state,
                        city,
                        mobile,
                        place,
                        roomtype,
                        date,
                        location,
                        price,
                        referenceID,
                        userId
                    );
                    await allroomsdata.save();
                    
                }

               
                await userRoom.save();
            
                res.status(201).json({ message: "Room added Successfully" });
            }
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// router.delete('/api/myModel/:id', async (req, res) => {
//     res.header('Access-Control-Allow-Origin', `http://localhost:3000`);
//     try {
//         //   const deletedData = await Postroom.findByIdAndRemove(req.params.id);
//         const deletedData = await User.findByIdAndRemove(req.params.id);
//         if (!deletedData) {
//             return res.status(404).send('Data not found');
//         }
//         res.send(deletedData);
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });



router.delete('/delete/myModel/:id', async (req, res) => {
    res.header('Access-Control-Allow-Origin', `${process.env.LOCALPATH}`);
    try {
        const userId = req.query.userId;
        const roomId = req.params.id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { rooms: { _id: roomId } } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        // Delete from alltheRoomSchema
        const updatedAllRooms = await AlltheRoom.updateMany(
            { "allrooms.referenceID": roomId },
            { $pull: { allrooms: { referenceID: roomId } } },
            { new: true }
        );
        res.send(updatedUser);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/user/:id' , async (req , res)=>{
    res.header('Access-Control-Allow-Origin', `${process.env.LOCALPATH}`);
    try{
        const userId = req.params.id;
        const user =await User.findById(userId);
        res.status(200).json({mess:user})
    }
    catch{
        
        res.status(200).json({err:"error"})

    }
})


router.get("/logout", (req, res) => {
    res.header('Access-Control-Allow-Origin', `${process.env.LOCALPATH}`);
    res.cookie("jwttoken", token, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: 'none',
        secure: true
    });
    res.status(200).send("user logout");
})



module.exports = router;