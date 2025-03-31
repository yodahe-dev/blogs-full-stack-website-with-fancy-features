const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = User;
