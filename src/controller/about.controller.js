

const aboutController = async (req , res)=>{ 
    try {
        const data = req.rootUser;
        const userId = req.userID;
        return res.status(200).json({ data: data.name,userId:userId});
    }
    catch (err) {
        return res.status(401).json({ err: "Unauthorized" });
    }
}


module.exports = aboutController;