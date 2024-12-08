const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Favourites = sequelize.define('Favourites', {
    favouriteID: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    favouriteName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Favourite',
    timestamps: false
});

module.exports = Favourites;
