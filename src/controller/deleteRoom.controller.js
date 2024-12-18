const { UserRoom } = require("../model/register");

const deleteRoomController = async (req , res)=>{
    try {
        const userId = req.userID; 
        const roomId = req.params.id;

        
        const room = await UserRoom.findById(roomId);
        if (!room) {
            return res.status(404).json({ mess: "Room not found" });
        }

      
        if (room.userId.toString() !== userId.toString()) {
            return res.status(403).json({ mess: "You are not authorized to delete this room" });
        }

       
        await UserRoom.findByIdAndDelete(roomId);
        return res.status(200).json({ mess: "Room Deleted" });
    } catch (error) {
        res.status(500).json({ err: "Error while deleting the data" });
    }
}

module.exports = deleteRoomController;