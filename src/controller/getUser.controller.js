const { User , UserRoom } = require("../model/register");

const getUserController = async (req , res)=>{
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
}

module.exports = getUserController;