const Parrain = require('../models/ParrainModel');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config({ path: "../config.env" });

exports.createParrain = async (req, res) => {
    try {
        const parrain = await Parrain.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                parrain
            }
        });


    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}


// function to check parrain by email and password
exports.checkParrain = async (req, res) => {
    try {
        const parrain = await Parrain.findOne({ email: req.body.email, password: req.body.password });
        if (!parrain) {
            return res.status(404).json('Parrain not found');
        }
        

        const token = jwt.sign({ parrainId: parrain.parrainId }, process.env.MY_SECRET, { expiresIn: '2h' });
        
       res.json({parrain, token});

        console.log(token);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// function to update parrain by id
exports.updateParrain = async (req, res) => {
    try {
        const parrain = await Parrain.findOneAndUpdate({ parrainId: req.params.parrainId }, req.body, { new: true });
        if (!parrain) {
            return res.status(404).json({ message: 'parrain not found' });
        }
        res.json(parrain);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// function to get parrain by id
exports.getParrain = async (req, res) => {
    try {
        const parrain = await Parrain.findOne({ parrainId: req.params.parrainId });
        if (!parrain) {
            return res.status(404).json({ message: 'parrain not found' });
        }
        res.json(parrain);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}




