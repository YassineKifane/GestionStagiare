const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');


// Define the Tache (Task) model
const Tache = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  statut: {
    type: DataTypes.ENUM('todo', 'enCours', 'termine'),
    defaultValue: 'todo',
  },
  internId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'stagiaires', // Assumes you have a 'Stagiaire' model/table
      key: 'internId',
    },
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  completionPercentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

module.exports = Tache;

// Optionally, sync the model with the database
sequelize.sync()
  .then(() => {
    console.log('Tache table has been created.');
  })
  .catch(error => {
    console.error('Error creating Tache table:', error);
  });
