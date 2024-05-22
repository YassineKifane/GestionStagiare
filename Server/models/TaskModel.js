const mongoose = require('mongoose');

// Define schema for Tache
const tacheSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    statut: {
        type: String,
        enum: ['todo','enCours', 'termine'],
        default: 'todo'
    },
    internId: {
        type: String,
        ref: 'Stagiaire',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    completionPercentage:{
        type: Number,
        default: 0
    }
    // Add any other fields as needed
}, { timestamps: true }); // Automatic timestamps for createdAt and updatedAt

// Create Tache model
const Tache = mongoose.model('Task', tacheSchema);

module.exports = Tache;
