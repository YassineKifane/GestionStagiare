const express = require('express');
const router = express.Router();
const StagiaireController = require('../controllers/StagiaireController');
const auth = require('../middlewares/Auth');

router.get('/:parrainId',auth.verifyToken, StagiaireController.getInternsByParentId);
router.post('/add',auth.verifyToken, StagiaireController.createIntern);
router.get('/intern/:internId',auth.verifyToken, StagiaireController.getInternById);
router.put('/update/:internId',auth.verifyToken, StagiaireController.updateIntern);
router.delete('/delete/:internId',auth.verifyToken, StagiaireController.deleteInternAndChat);
router.get('/count/:parrainId',auth.verifyToken, StagiaireController.countInternsByParrainId);
router.post('/check', StagiaireController.checkIntern);


module.exports = router;










