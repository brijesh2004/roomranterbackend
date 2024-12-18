const { UserRoom } = require("../model/register");

const apiController = async(req , res)=>{
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
}

module.exports = apiController;

