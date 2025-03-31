const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require('./User');
const Post = require('./Post');

const PostLike = sequelize.define('PostLike', {
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    post_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'posts',
            key: 'post_id'
        }
    }
}, {
    tableName: 'postlikes',
    timestamps: false
});

// Associations
PostLike.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
PostLike.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

module.exports = PostLike;
