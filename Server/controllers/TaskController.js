const Task = require('../models/TaskModel');
const Intern = require('../models/StagiaireModel');


// create a function to get tasks by intern id:
exports.getTasksByInternId = async (req, res) => {
    try {
        const tasks = await Task.find({ internId: req.params.internId });
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

// create a function to create a task:
exports.createTask = async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json({ task });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

// create a function to delete a task by id:
exports.deleteTaskById = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.taskId);
        res.status(200).json({ task });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

// create a function to update a task by id:
exports.updateTaskById = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
        res.status(200).json({ task });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}


// create a function to delete all tasks by internId:
exports.deleteAllTasksByInternId = async (req, res) => {
    try {
        const tasks = await Task.deleteMany({ internId: req.params.internId });
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}


// create a function to update a task statut by id
exports.updateTaskStatutById = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.taskId, { statut: req.body.statut }, { new: true });
        res.status(200).json({ task });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

// create a function to update a task completionPercentage by id
exports.updateTaskCompletionPercentageById = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.taskId, { completionPercentage: req.body.completionPercentage }, { new: true });
        res.status(200).json({ task });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}






// exports.getNumberOfTasksByStatut = async (req, res) => {
//     try {
//         const { internId, statut } = req.params;
//         const tasks = await Task.find({ internId, statut });
//         const numberOfTasks = tasks.length; // Get the number of tasks
//         res.status(200).json({ numberOfTasks });
//     } catch (error) {
//         res.status(500).json({ msg: error });
//     }
// }



exports.getNumberOfTasksByStatus = async (req, res) => {
    try {
        const { internId } = req.params;
        const statuses = ['todo', 'enCours', 'termine']; // Define the statuses
        const numberOfTasksByStatus = {}; // Object to store the number of tasks for each status

        // Loop through each status
        for (const status of statuses) {
            const tasks = await Task.find({ internId, statut: status });
            const numberOfTasks = tasks.length;
            numberOfTasksByStatus[status] = numberOfTasks; // Store the number of tasks for the current status
        }

        res.status(200).json({ numberOfTasksByStatus });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}


// function to get the percentage of each status
exports.getPercentageOfStatus = async (req, res) => {
    try {
        const { internId } = req.params;
        const statuses = ['todo', 'enCours', 'termine']; // Define the statuses
        const numberOfTasksByStatus = {}; // Object to store the number of tasks for each status

        // Loop through each status
        for (const status of statuses) {
            const tasks = await Task.find({ internId, statut: status });
            const numberOfTasks = tasks.length;
            numberOfTasksByStatus[status] = numberOfTasks; // Store the number of tasks for the current status
        }

        const totalTasks = Object.values(numberOfTasksByStatus).reduce((a, b) => a + b, 0); // Calculate the total number of tasks
        const percentageOfStatus = {}; // Object to store the percentage of tasks for each status

        // Loop through each status and calculate the percentage
        for (const status of statuses) {
            const numberOfTasks = numberOfTasksByStatus[status];
            const percentage = (numberOfTasks / totalTasks) * 100;
            percentageOfStatus[status] = percentage; // Store the percentage of tasks for the current status
        }
        res.status(200).json( percentageOfStatus);
}
    catch (error) {
        res.status(500).json({ msg: error });
    }
}


// a function to get the percentage of completion of all tasks of an intern
exports.getPercentageOfCompletionOfTasksById = async (req, res) => {
    try {
        const { internId } = req.params;
        const tasks = await Task.find({ internId });
        const numberOfTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.statut === 'termine').length;
        const percentageOfCompletion = (completedTasks / numberOfTasks) * 100;
        res.status(200).json(percentageOfCompletion);
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}


exports.getPercentageOfCompletionOfAllTasks = async (req, res) => {
    try {
        
        const tasks = await Task.find({});
        const numberOfTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.statut === 'termine').length;
        const percentageOfCompletion = (completedTasks / numberOfTasks) * 100;
        res.status(200).json(percentageOfCompletion);
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}










// function to get the number of all tasks of an intern that has the parrainId from the request param
exports.getNumberOfAllTasks = async (req, res) => {
    try {
        console.log(req.params.parrainId);
        // Fetch all tasks
        const tasks = await Task.find();
        
        
        let numberOfTasks = 0;

        // Iterate through each task
        for (const task of tasks) {
            // Fetch the intern associated with the task
            const intern = await Intern.findOne({ internId: task.internId });
            
            // Check if the intern exists and has the provided parrainId
            if (intern && intern.parrainId === req.params.parrainId) {
                numberOfTasks++;
            }
        }

        res.status(200).json(numberOfTasks);
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}
