const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JoinEvent = sequelize.define('JoinEvent', {
    joinEventID: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    userID: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    eventID: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    tableName: 'JoinEvent',
    timestamps: false
});

module.exports = JoinEvent;
