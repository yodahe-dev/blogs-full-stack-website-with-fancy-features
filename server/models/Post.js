const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Post = sequelize.define('Post', {
    post_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
            notNull: { msg: 'User ID is required' },
            isUUID: { msg: 'User ID must be a valid UUID' }
        }
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Title cannot be empty' },
            len: [1, 100]
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Content cannot be empty' },
            len: [1, 100000]
        }
    },
    thumbnail_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['user_id'] },
    ]
});

module.exports = Post;
