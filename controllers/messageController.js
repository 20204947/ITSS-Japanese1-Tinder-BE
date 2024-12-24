const Message = require("../models/message");

// Lưu tin nhắn mới
exports.saveMessage = async (req, res) => {
    try {
        const { matchingID, from, context } = req.body;
        const newMessage = await Message.create({
            matchingID,
            from,
            time: new Date(),
            context,
        });
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: "Error saving message" });
    }
};

// Lấy tất cả tin nhắn theo matchingID
exports.getMessagesByMatchingID = async (req, res) => {
    try {
        const { matchingID } = req.params;
        const messages = await Message.find({ matchingID });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Error fetching messages" });
    }
};