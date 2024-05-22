const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/DocumentController');

router.post('/add', DocumentController.createDocument);
// router.get('/get/sender/:senderId', DocumentController.getAllDocumentsBySenderId);
// router.get('/get/receiver/:receiverId', DocumentController.getAllDocumentsByReceiverId);
router.delete('/delete/:id', DocumentController.deleteDocumentById);

router.get('/get/sender/:senderId/receiver/:receiverId', DocumentController.getAllDocumentsBySenderAndReceiverId);

// for analytics purposes
router.get('/count/:receiverId',DocumentController.getNumberOfDocumentsByReceiverId);

router.get('/files/percentage',DocumentController.getPercentageOfFileType);

module.exports = router;