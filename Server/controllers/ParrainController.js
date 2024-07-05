const Parrain = require('../models/ParrainModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: "../.env" });

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
            message: err.message
        });
    }
}

exports.checkParrain = async (req, res) => {
    try {
        const parrain = await Parrain.findOne({ where: { email: req.body.email, password: req.body.password } });
        if (!parrain) {
            return res.status(404).json('Parrain not found');
        }

        const token = jwt.sign({ parrainId: parrain.parrainId }, process.env.MY_SECRET, { expiresIn: '2h' });

        res.json({ parrain, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateParrain = async (req, res) => {
    try {
        const parrain = await Parrain.findOne({ where: { parrainId: req.params.parrainId } });
        if (!parrain) {
            return res.status(404).json({ message: 'Parrain not found' });
        }

        await parrain.update(req.body);

        res.json(parrain);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getParrain = async (req, res) => {
    try {
        const parrain = await Parrain.findOne({ where: { parrainId: req.params.parrainId } });
        if (!parrain) {
            return res.status(404).json({ message: 'Parrain not found' });
        }
        res.json(parrain);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
