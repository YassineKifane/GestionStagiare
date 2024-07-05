const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Parrain = sequelize.define('Parrain', {
    parrainId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    fname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    service: {
        type: DataTypes.STRING,
        allowNull: false
    },
    speciality: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Parrain;
