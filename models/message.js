const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
    messageID: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    matchingID: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    from: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    context: {
        type: DataTypes.BIGINT, // Nếu context là văn bản, nên chuyển thành DataTypes.TEXT
        allowNull: false
    }
}, {
    tableName: 'Message',
    timestamps: false
});

module.exports = Message;
