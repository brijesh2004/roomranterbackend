const { UserRoom } = require("../model/register");

const getCityController = async (req , res)=>{
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
}


module.exports = getCityController;