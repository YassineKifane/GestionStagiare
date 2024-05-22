const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');

router.post('/', ChatController.createChat);
router.get('/:userId', ChatController.userChats);
router.get('/find/:firstId/:secondId', ChatController.findChat);
router.get('/count/:userId', ChatController.countReceivedMessages);



module.exports = router;