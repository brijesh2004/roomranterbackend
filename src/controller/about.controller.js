

const aboutController = async (req , res)=>{ 
    try {
        const data = req.rootUser;
        return res.status(200).json({ data: data.name });
    }
    catch (err) {
        return res.status(401).json({ err: "Unauthorized" });
    }
}


module.exports = aboutController;