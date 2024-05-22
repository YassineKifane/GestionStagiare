
const Intern = require('../models/StagiaireModel');
const Chat = require('../models/ChatModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: "../config.env" });

// get all interns that has the parent id
exports.getInternsByParentId = async (req, res) => {
    try {
        const interns = await Intern.find({ parrainId: req.params.parrainId });
        res.status(200).json(interns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// exports.getAllInterns = async (req, res) => {
//     try {
//         const interns = await Intern.find();
//         res.status(200).json(interns);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }




exports.createIntern = async (req, res) => {
    console.log(req.body);
    const intern = new Intern({
        internId: req.body.internId,
        fname: req.body.fname, 
        lname: req.body.lname,  
        email: req.body.email,
        password: req.body.password,
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

   

    try {
        const newIntern = await intern.save();
        // create chat
        const chat = await Chat.create({
            members: [intern.parrainId, intern.internId]
        });

        res.status(201).json({ message: 'Intern created successfully', newIntern, chat });

        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}



exports.getInternById = async (req, res) => {
    try {
        const intern = await Intern.findOne({ internId: req.params.internId });
        if (!intern) {
            return res.status(404).json({ message: 'Intern not found' });
        }
        res.json(intern);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



exports.updateIntern = async (req, res) => {
    try {
        const intern = await Intern.findOneAndUpdate({ internId: req.params.internId }, req.body, { new: true });
        if (!intern) {
            return res.status(404).json({ message: 'Intern not found' });
        }
        res.json(intern);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.deleteIntern = async (req, res) => {
    try {
        const intern = await Intern.findOneAndDelete({ internId: req.params.internId });
        if (!intern) {
            return res.status(404).json({ message: 'Intern not found' });
        }
        res.json({ message: 'Intern deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


// function to delete inten and his chat
exports.deleteInternAndChat = async (req, res) => {
    try {
        const intern = await Intern.findOneAndDelete({ internId: req.params.internId });
        if (!intern) {
            return res.status(404).json({ message: 'Intern not found' });
        }
        const chat = await Chat.findOneAndDelete({
            members: { $in: [req.params.internId] }
        });
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.json({ message: 'Intern and chat deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.checkIntern = async (req, res) => {
    try {
        const intern = await Intern.findOne({ email: req.body.email, password: req.body.password });
        if (!intern) {
            return res.status(404).json('intern not found');
        }
        const token = jwt.sign({ internId: intern.internId }, process.env.MY_SECRET, { expiresIn: '1h' });
        
        res.json({intern, token});
      
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}




// function to get the number of inters by parrain id
exports.countInternsByParrainId = async (req, res) => {
    try {
        const count = await Intern.countDocuments({ parrainId: req.params.parrainId });
        res.json(count);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}




















