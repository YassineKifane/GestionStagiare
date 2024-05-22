const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const StagiaireSchema = new mongoose.Schema({
    internId: {
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
    StageDuration:{
        type: String,
        required: true
    },
    joinDate:{
        type: Date,
        required: true
    },
    EndDate:{
        type: Date,
        required: true
    },

    age:{
        type: Number,
        required: true
    },

    etablissement:{
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

    parrainId: {
        type: String,
        required: true
    },
    img: {
        type: String,
        default: 'default.jpg'
    },

    // created_at: Date,

})


    

// StagiaireSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();

//     // Hash the password with cost of 12
//     this.password = await bcrypt.hash(this.password, 12);

// });


const Stagiaire = mongoose.model('Stagiaire', StagiaireSchema);
module.exports = Stagiaire;