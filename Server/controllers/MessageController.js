const MessageModel = require('../models/MessageModel');

// Function to add a message
exports.addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  try {
    const message = await MessageModel.create({ chatId, senderId, text });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Function to get messages by chatId
exports.getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await MessageModel.findAll({ where: { chatId } });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Function to get the latest message by chatId
exports.getLatestMessage = async (req, res) => {
  const { chatId } = req.params;
  try {
    const latestMessage = await MessageModel.findOne({
      where: { chatId },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(latestMessage);
  } catch (error) {
    res.status(500).json(error);
  }
};
