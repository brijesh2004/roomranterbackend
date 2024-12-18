const { UserRoom } = require("../model/register");

const uploadRoomController = async(req , res)=>{
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
}

module.exports = uploadRoomController;