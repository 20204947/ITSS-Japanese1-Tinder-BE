const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MALE = 0;
const FEMALE = 1;
const OTHER = 2;

const User = sequelize.define('User', {
    userID: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    role: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    firstFavouriteID: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    secondFavouriteID: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    thirdFavouriteID: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    fourthFavouriteID: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    fifthFavouriteID: {
        type: DataTypes.BIGINT,
        allowNull: true
    }
}, {
    tableName: 'User', // Đảm bảo Sequelize sử dụng đúng tên bảng
    timestamps: false // Bỏ qua các cột mặc định như createdAt, updatedAt
});

module.exports = User;
