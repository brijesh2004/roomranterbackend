const { UserRoom } = require("../model/register");

const similarRoomsController = async (req , res)=>{
    try{
        const city = req.query.city;
        const similarroom = await UserRoom.find({city}).sort({_id:-1}).limit(5);
        return res.status(200).json({data:similarroom});
      }
      catch(error){
          return res.status(400).json({error:"Error while fetching similar rooms"})
      }
}

module.exports = similarRoomsController;