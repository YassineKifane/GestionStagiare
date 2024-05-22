const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');


router.post('/add', TaskController.createTask);
router.get('/:internId',TaskController.getTasksByInternId);
router.delete('/delete/:taskId', TaskController.deleteTaskById);
router.delete('/delete/intern/:internId', TaskController.deleteAllTasksByInternId);
router.put('/update/:taskId', TaskController.updateTaskById);
router.put('/update/statut/:taskId', TaskController.updateTaskStatutById);
router.put('/update/percentage/:taskId',TaskController.updateTaskCompletionPercentageById);
// for analytics purposes
router.get('/count/:internId', TaskController.getNumberOfTasksByStatus);
router.get('/count/get/percentage', TaskController.getPercentageOfCompletionOfAllTasks);
router.get('/count/get/percentage/:internId', TaskController.getPercentageOfCompletionOfTasksById);
router.get('/count/all/:parrainId',TaskController.getNumberOfAllTasks);
router.get('/count/status/percentage/:internId', TaskController.getPercentageOfStatus);

module.exports = router;