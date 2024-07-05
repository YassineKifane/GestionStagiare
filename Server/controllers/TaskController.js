const Task = require('../models/TaskModel');
const Intern = require('../models/StagiaireModel');

// Function to get tasks by intern id
exports.getTasksByInternId = async (req, res) => {
    try {
        const tasks = await Task.findAll({ where: { internId: req.params.internId } });
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

// Function to create a task
exports.createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json({ task });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

// Function to delete a task by id
exports.deleteTaskById = async (req, res) => {
    try {
        console.log(`Attempting to delete Task with ID: ${req.params.taskId}`);
        const task = await Task.destroy({ where: { id: req.params.taskId } });
        res.status(200).json({ task });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};


// Function to update a task by id
exports.updateTaskById = async (req, res) => {
    try {
        const task = await Task.update(req.body, { where: { id: req.params.taskId }, returning: true });
        res.status(200).json({ task: task[1][0] }); // Sequelize returns an array, updated instance is at index 1
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

// Function to delete all tasks by internId
exports.deleteAllTasksByInternId = async (req, res) => {
    try {
        const tasks = await Task.destroy({ where: { internId: req.params.internId } });
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

// Function to update a task statut by id
exports.updateTaskStatutById = async (req, res) => {
    try {
        const task = await Task.update({ statut: req.body.statut }, { where: { id: req.params.taskId }, returning: true });
        res.status(200).json({ task: task[1][0] });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

// Function to update a task completionPercentage by id
exports.updateTaskCompletionPercentageById = async (req, res) => {
    try {
        const task = await Task.update({ completionPercentage: req.body.completionPercentage }, { where: { id: req.params.taskId }, returning: true });
        res.status(200).json({ task: task[1][0] });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

// Function to get the number of tasks by status
exports.getNumberOfTasksByStatus = async (req, res) => {
    try {
        const { internId } = req.params;
        const statuses = ['todo', 'enCours', 'termine'];
        const numberOfTasksByStatus = {};

        for (const status of statuses) {
            const count = await Task.count({ where: { internId, statut: status } });
            numberOfTasksByStatus[status] = count;
        }

        res.status(200).json({ numberOfTasksByStatus });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

// Function to get the percentage of each status
exports.getPercentageOfStatus = async (req, res) => {
    try {
        const { internId } = req.params;
        const statuses = ['todo', 'enCours', 'termine'];
        const numberOfTasksByStatus = {};

        for (const status of statuses) {
            const count = await Task.count({ where: { internId, statut: status } });
            numberOfTasksByStatus[status] = count;
        }

        const totalTasks = Object.values(numberOfTasksByStatus).reduce((a, b) => a + b, 0);
        const percentageOfStatus = {};

        for (const status of statuses) {
            const numberOfTasks = numberOfTasksByStatus[status];
            const percentage = (numberOfTasks / totalTasks) * 100;
            percentageOfStatus[status] = percentage;
        }

        res.status(200).json(percentageOfStatus);
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

// Function to get the percentage of completion of all tasks of an intern
exports.getPercentageOfCompletionOfTasksById = async (req, res) => {
    try {
        const { internId } = req.params;
        const tasks = await Task.findAll({ where: { internId } });
        const numberOfTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.statut === 'termine').length;
        const percentageOfCompletion = (completedTasks / numberOfTasks) * 100;
        res.status(200).json(percentageOfCompletion);
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

// Function to get the percentage of completion of all tasks
exports.getPercentageOfCompletionOfAllTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({});
        const numberOfTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.statut === 'termine').length;
        const percentageOfCompletion = (completedTasks / numberOfTasks) * 100;
        res.status(200).json(percentageOfCompletion);
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

// Function to get the number of all tasks of an intern that has the parrainId from the request param
exports.getNumberOfAllTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({});
        const numberOfTasks = tasks.length;
        
        res.status(200).json(numberOfTasks);
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

