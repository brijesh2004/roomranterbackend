const { UserRoom } = require("../model/register");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const uploadeImageController = async(req , res)=>{
    const userId = req.userID;
    const id = req.query.id;
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const uploadResults = [];

        // Upload each file to Cloudinary
        for (const file of req.files) {
            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: "uploads", // Optional: specify folder name
            });
            uploadResults.push(uploadResult.secure_url);
        }
        const roomdata = await UserRoom.findById(id);
        roomdata.images=uploadResults;
        await roomdata.save();
        // Respond with details of all uploaded files
        return res.status(200).json({
            message: "Files uploaded successfully",
            uploadedFiles: uploadResults, // Array of uploaded file details
        });
    } catch (err) {
        return res.status(500).json({ message: "Error while uploading files" });
    }
}


module.exports = uploadeImageController;