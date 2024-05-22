const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/MessageController');


router.post('/',MessageController.addMessage);
router.get('/:chatId', MessageController.getMessages);
router.get('/latest/:chatId', MessageController.getLatestMessage);

module.exports = router;