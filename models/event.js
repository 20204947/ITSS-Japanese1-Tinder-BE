const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
    eventID: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    eventName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eventTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    eventDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'Event',
    timestamps: false
});

module.exports = Event;
