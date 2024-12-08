const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Action = sequelize.define('Action', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    userID: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    targetUserID: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    action: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'Action',
    timestamps: false
});

module.exports = Action;
