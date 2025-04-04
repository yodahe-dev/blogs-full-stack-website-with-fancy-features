const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require('./User');
const Category = require('./Category');

const Post = sequelize.define('Post', {
    post_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    thumbnail_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    category_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'categories',
            key: 'category_id'
        }
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
    tableName: 'posts',
    timestamps: false
});

// Associations
Post.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Post.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

module.exports = Post;
