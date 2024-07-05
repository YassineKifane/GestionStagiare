const Intern = require('../models/StagiaireModel');
const Chat = require('../models/ChatModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });
const Sequelize = require('sequelize');
const { Op } = require('sequelize'); 


// Get all interns that have the parent ID
exports.getInternsByParentId = async (req, res) => {
    try {
        const interns = await Intern.findAll({ where: { parrainId: req.params.parrainId } });
        res.status(200).json(interns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new intern
exports.createIntern = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const intern = await Intern.create({
            internId: req.body.internId,
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,
            StageDuration: req.body.StageDuration,
            joinDate: req.body.joinDate,
            EndDate: req.body.EndDate,
            age: req.body.age,
            etablissement: req.body.etablissement,
            service: req.body.service,
            speciality: req.body.speciality,
            parrainId: req.body.parrainId,
            img: req.body.img
        });

        // Create chat
        const chat = await Chat.create({
            members: [req.body.parrainId, req.body.internId]
        });

        res.status(201).json({ message: 'Intern created successfully', intern, chat });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get intern by ID
exports.getInternById = async (req, res) => {
    try {
        // Log the internId parameter
        console.log('Requested internId:', req.params.internId);
        
        // Attempt to find the intern by the provided ID
        const intern = await Intern.findOne({ where: { internId: req.params.internId } });

        // Check if an intern was found
        if (!intern) {
            // Log the case where no intern was found
            console.log('Intern not found with internId:', req.params.internId);
            return res.status(404).json({ message: 'Intern not found' });
        }

        // Respond with the found intern
        res.json(intern);
    } catch (error) {
        // Log the error message for troubleshooting
        console.error('Error retrieving intern:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// Get all interns
exports.getInterns = async (req, res) => {
    try {
        const interns = await Intern.findAll();
        res.json(interns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update intern
exports.updateIntern = async (req, res) => {
    try {
        const intern = await Intern.findOne({ where: { internId: req.params.internId } });
        if (!intern) {
            return res.status(404).json({ message: 'Intern not found' });
        }

        await intern.update(req.body);

        res.json(intern);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete intern
exports.deleteIntern = async (req, res) => {
    try {
        const { internId } = req.params;
        console.log(`Received request to delete intern with ID: ${internId}`);

        const intern = await Intern.findOne({ where: { internId } });
        if (!intern) {
            console.error(`Intern with ID ${internId} not found.`);
            return res.status(404).json({ message: 'Intern not found' });
        }

        await intern.destroy();
        console.log(`Intern with ID ${internId} deleted successfully.`);
        res.status(200).json({ message: 'Intern deleted successfully' });
    } catch (error) {
        console.error('Error deleting intern:', error.message);
        res.status(500).json({ message: 'Error deleting intern' });
    }
};



// Delete intern and their chat
exports.deleteInternAndChat = async (req, res) => {
    try {
        const intern = await Intern.findOne({ where: { internId: req.params.internId } });
        if (!intern) {
            console.error(`Intern with ID ${req.params.internId} not found.`);
            return res.status(404).json({ message: 'Intern not found' });
        }

        await intern.destroy();
        console.log(`Intern with ID ${req.params.internId} deleted successfully.`);

        try {
            const chat = await Chat.findOne({ where: { members: { [Op.like]: `%${req.params.internId}%` } } });
            if (chat) {
                await chat.destroy();
                console.log(`Chat with members containing ID ${req.params.internId} deleted successfully.`);
            } else {
                console.log(`No chat found with members containing ID ${req.params.internId}.`);
            }
        } catch (chatError) {
            console.error('Error deleting chat:', chatError);
            return res.status(500).json({ message: 'Error deleting chat' });
        }

        res.json({ message: 'Intern and chat deleted successfully' });
    } catch (error) {
        console.error('Error deleting intern:', error);
        res.status(500).json({ message: 'Error deleting intern', error: error.message });
    }
};



// Check intern credentials
exports.checkIntern = async (req, res) => {
    try {
        const intern = await Intern.findOne({ where: { email: req.body.email } });
        if (!intern || !await bcrypt.compare(req.body.password, intern.password)) {
            return res.status(401).json('Invalid credentials');
        }

        const token = jwt.sign({ internId: intern.internId }, process.env.MY_SECRET, { expiresIn: '1h' });

        res.json({ intern, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Count interns by parrain ID
exports.countInternsByParrainId = async (req, res) => {
    try {
        const count = await Intern.count({ where: { parrainId: req.params.parrainId } });
        res.json(count);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
