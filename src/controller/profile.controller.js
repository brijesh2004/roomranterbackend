const { UserRoom } = require("../model/register");
const profileController = async (req , res)=>{ 
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
}


module.exports = profileController;