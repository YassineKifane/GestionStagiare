const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the Chat model
const Chat = sequelize.define('Chat', {
  members: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('members');
      return JSON.parse(rawValue);
    },
    set(value) {
      this.setDataValue('members', JSON.stringify(value));
    },
  },
}, {
  timestamps: true, // Automatic timestamps for createdAt and updatedAt
});

module.exports = Chat;

// Optionally, sync the model with the database
sequelize.sync()
  .then(() => {
    console.log('Chat table has been created.');
  })
  .catch(error => {
    console.error('Error creating Chat table:', error);
  });
