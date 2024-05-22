const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  fileSize: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  }
}, {
    timestamps: true 
  });

const File = mongoose.model('File', DocumentSchema);

module.exports = File;
