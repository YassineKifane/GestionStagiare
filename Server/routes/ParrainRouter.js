const express = require('express');
const router = express.Router();
const ParrainController = require('../controllers/ParrainController');
const auth = require('../middlewares/Auth');


router.post('/add',auth.verifyToken, ParrainController.createParrain);
router.put('/update/:parrainId',auth.verifyToken, ParrainController.updateParrain);
router.get('/:parrainId',auth.verifyToken, ParrainController.getParrain);
router.post('/check', ParrainController.checkParrain);

module.exports = router;
