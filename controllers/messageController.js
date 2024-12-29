const Message = require("../models/message");

// Lưu tin nhắn mới
exports.saveMessage = async (req, res) => {
    try {
        const { matchingID, from, context, time } = req.body;

        // Kiểm tra nếu matchingID bị null hoặc undefined
        if (!matchingID) {
            return res.status(400).json({ error: "matchingID cannot be null" });
        }

        const newMessage = await Message.create({
            matchingID,
            from,
            time,
            context,
        });
        res.status(201).json(newMessage);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error saving message" });
    }
};

// Lấy tất cả tin nhắn theo matchingID
exports.getMessagesByMatchingID = async (req, res) => {
    try {
        const { matchingID } = req.params;
        const messages = await Message.findAll({
            where: { matchingID }
        });
        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error fetching messages" });
    }
};