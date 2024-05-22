const MessageModel = require('../models/MessageModel');

exports.addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new MessageModel({ chatId, senderId, text });
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};


exports.getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await MessageModel.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};


// fonction to get latest message (use chatModel and MessageModel)

exports.getLatestMessage = async (req, res) => {
  const { chatId } = req.params;
  const latestMessage = await MessageModel.find({ chatId: chatId }).sort({ createdAt: -1 }).limit(1);
  res.status(200).json(latestMessage)
}


// function to count received messages based on a given user id (use chatModel and MessageModel)




