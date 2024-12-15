const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Matching = sequelize.define('Matching', {
    matchingID: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    userA: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    userB: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    status: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    messageID: {
        type: DataTypes.BIGINT,
        allowNull: true
    }
}, {
    tableName: 'Matching',
    timestamps: false
});

module.exports = Matching;
