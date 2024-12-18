const { UserRoom } = require("../model/register");


const getRoomController = async(req , res)=>{
    try {
        const userId = req.params.id;
        const userRoom = await UserRoom.find({ userId });
        return res.status(200).json({ data: userRoom });
    }
    catch (err) {
        res.status(400).json({ err: "Error" });
    }
}

module.exports = getRoomController;