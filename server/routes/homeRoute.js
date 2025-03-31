const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Import Post model
const User = require('../models/User'); // Import User model
const PostLike = require('../models/PostLike'); // Import PostLike model
const SavedPost = require('../models/SavedPost'); // Import SavedPost model
const Category = require('../models/Category'); // Import Category model
const Sequelize = require('sequelize');  // Import Sequelize for querying
// Middleware to simulate authentication (replace with your actual middleware)
const authenticateUser = (req, res, next) => {
    req.user = { user_id: 'some-logged-in-user-id' };  // Example, replace with actual logic
    next();
};

// Route to fetch posts, excluding the current user's own posts
router.get('/home', async (req, res) => {
    try {
        // Get the user ID from the request (set by authentication middleware)
        const userId = req.user.user_id;

        // Fetch posts, exclude the current user's own posts
        const posts = await Post.findAll({
            where: { user_id: { [Sequelize.Op.ne]: userId } }, // Exclude current user's posts
            include: [
                { 
                    model: User, 
                    as: 'user', 
                    attributes: ['username']  // Include post owner's username
                },
                { 
                    model: Category, 
                    as: 'category', 
                    attributes: ['name']  // Include category name
                },
                { 
                    model: PostLike, 
                    where: { user_id: userId }, 
                    required: false,  // Include even if no like exists
                    attributes: ['created_at'] 
                },
                { 
                    model: SavedPost, 
                    where: { user_id: userId }, 
                    required: false,  // Include even if no save exists
                    attributes: ['created_at'] 
                }
            ],
            order: [['created_at', 'DESC']],  // Order by creation date (LIFO)
        });

        return res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ message: 'Error fetching posts' });
    }
});

// Route to like a post
router.post('/like', authenticateUser, async (req, res) => {
    const { postId } = req.body;  // Post ID to be liked

    try {
        // Ensure the user hasn't already liked the post
        const existingLike = await PostLike.findOne({
            where: { user_id: req.user.user_id, post_id: postId }
        });

        if (existingLike) {
            return res.status(400).json({ message: 'Post already liked' });
        }

        // Create a new like record
        await PostLike.create({
            user_id: req.user.user_id,
            post_id: postId
        });

        return res.status(201).json({ message: 'Post liked' });
    } catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).json({ message: 'Error liking post' });
    }
});

// Route to save a post
router.post('/save', authenticateUser, async (req, res) => {
    const { postId } = req.body;  // Post ID to be saved

    try {
        // Ensure the user hasn't already saved the post
        const existingSave = await SavedPost.findOne({
            where: { user_id: req.user.user_id, post_id: postId }
        });

        if (existingSave) {
            return res.status(400).json({ message: 'Post already saved' });
        }

        // Create a new save record
        await SavedPost.create({
            user_id: req.user.user_id,
            post_id: postId
        });

        return res.status(201).json({ message: 'Post saved' });
    } catch (error) {
        console.error('Error saving post:', error);
        return res.status(500).json({ message: 'Error saving post' });
    }
});

module.exports = router;
