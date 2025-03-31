// models/Category.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');  // Ensure you have the Sequelize instance

const Category = sequelize.define('Category', {
    category_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        }
    }
}, {
    tableName: 'categories',
    timestamps: false
});

module.exports = Category;
