const Chat = require('../models/ChatModel');
const Message = require('../models/MessageModel');
const { Sequelize } = require('sequelize');

// Create a new chat
exports.createChat = async (req, res) => {
    const { senderId, receiverId } = req.body;
    try {
        const chat = await Chat.create({
            members: [senderId, receiverId]
        });
        res.status(200).json(chat);
    } catch (err) {
        console.error('Error creating chat:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


// Get all chats for a user
exports.userChats = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ error: 'userId parameter is missing' });
    }
    try {
        const chats = await Chat.findAll({
            where: {
                members: {
                    [Sequelize.Op.like]: `%${userId}%`
                }
            }
        });
        res.status(200).json(chats);
    } catch (err) {
        console.error('Error fetching user chats:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Find a chat between two users
exports.findChat = async (req, res) => {
    const { firstId, secondId } = req.params;
    try {
        const chat = await Chat.findOne({
            where: Sequelize.literal(`JSON_CONTAINS(members, '"${firstId}"') AND JSON_CONTAINS(members, '"${secondId}"')`)
        });
        res.status(200).json(chat);
    } catch (err) {
        console.error('Error finding chat:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete a chat by member id
exports.deleteChat = async (req, res) => {
    const { memberId } = req.params;
    try {
        const chat = await Chat.destroy({
            where: Sequelize.literal(`JSON_CONTAINS(members, '"${memberId}"')`)
        });
        res.status(200).json(chat);
    } catch (err) {
        console.error('Error deleting chat:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


// Count received messages for a user
exports.countReceivedMessages = async (req, res) => {
    const { userId } = req.params;
    try {
        // Find all chat IDs where the user is a member
        const chats = await Chat.findAll({
            where: {
                members: {
                    [Sequelize.Op.like]: `%${userId}%`
                }
            }
        });

        // Extract the chat IDs from the result
        const chatIdList = chats.map(chat => chat.id);

        // Find all messages where the senderId is not the userId and the chatId is in the chatIds array
        const count = await Message.count({
            where: {
                senderId: {
                    [Sequelize.Op.ne]: userId
                },
                chatId: {
                    [Sequelize.Op.in]: chatIdList
                }
            }
        });

        res.status(200).json(count);
    } catch (error) {
        console.error('Error counting received messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}