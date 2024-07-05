const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');


// Define the Message model
const Message = sequelize.define('Message', {
  chatId: {
    type: DataTypes.STRING
  },
  senderId: {
    type: DataTypes.STRING
  },
  text: {
    type: DataTypes.STRING
  },
}, {
  timestamps: true,
});

module.exports = Message;

// Optionally, sync the model with the database
sequelize.sync()
  .then(() => {
    console.log('Message table has been created.');
  })
  .catch(error => {
    console.error('Error creating Message table:', error);
  });
