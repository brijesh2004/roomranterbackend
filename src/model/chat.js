const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        sender: {
            type: String, // User ID of the sender
            required: true,
        },
        receiver: {
            type: String, // User ID of the receiver
            required: true,
        },
        message: {
            type: String, // Chat message content
            required: true,
        },
        sentAt: {
            type: Date,
            default: Date.now, // Timestamp for when the message was sent
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
