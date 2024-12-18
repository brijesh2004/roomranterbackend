const { UserRoom } =  require("../model/register");



const roomController = async(req , res)=>{
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
}

module.exports = roomController;