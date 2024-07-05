const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the Document (File) model
const File = sequelize.define('File', {
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileSize: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  documentType: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
  sender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receiver: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, // Automatic timestamps for createdAt and updatedAt
});

module.exports = File;

// Optionally, sync the model with the database
sequelize.sync()
  .then(() => {
    console.log('File table has been created.');
  })
  .catch(error => {
    console.error('Error creating File table:', error);
  });
