const mongoose = require('mongoose');

const ParrainSchema = new mongoose.Schema({
    parrainId: {
        type: String,
        unique:true,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },

    service:{
        type: String,
        required: true
    },

    speciality:{
        type: String,
        required: true
    },
})



const Parrain = mongoose.model('Parrain', ParrainSchema);
module.exports = Parrain;