
const chatModel = require('../models/ChatModel');
const MessageModel = require('../models/MessageModel');




exports.createChat = async (req, res) => {
    const { senderId, receiverId } = req.body;
    const chat = await chatModel.create({
        members: [senderId, receiverId]
    });
    res.status(200).json(chat);
}


exports.userChats = async (req, res) => {
    const { userId } = req.params;
    const chats = await chatModel.find({
        members: { $in: [userId] }
    });
    res.status(200).json(chats);
}


exports.findChat = async (req, res) => {
    const { firstId, secondId } = req.params;
    const chat = await chatModel.findOne({
        members: { $all: [firstId, secondId] }
    });
    res.status(200).json(chat);
}

// delete a chat by member id
exports.deleteChat = async (req, res) => {
    const { memberId } = req.params;
    const chat = await chatModel.findOneAndDelete({
        members: { $in: [memberId] }
    });
    res.status(200).json(chat);
}




exports.countReceivedMessages = async (req, res) => {
    const { userId } = req.params;
    try {
        // Find all chat IDs where the user is a member
        const chatIds = await chatModel.find({ members: userId }).select('_id');

        // Extract the chat IDs from the result
        const chatIdList = chatIds.map(chat => chat._id);

        // Find all messages where the senderId is not the userId and the chatId is in the chatIds array
        const count = await MessageModel.countDocuments({
            senderId: { $ne: userId },
            chatId: { $in: chatIdList }
        });

        res.status(200).json(count);
    } catch (error) {
        console.error('Error counting received messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}




