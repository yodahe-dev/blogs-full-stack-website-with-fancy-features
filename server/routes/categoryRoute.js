// routes/categoryRoute.js
const express = require('express');
const Category = require('../models/Category');
const { isAuthenticated } = require('../middleware/authMiddleware');  // Ensure authentication middleware is available
const router = express.Router();

// Create a new category
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = await Category.create({
            name,
            user_id: req.user.user_id // assuming the authenticated user is attached to the req object
        });
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a category
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        category.name = name;
        await category.save();
        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a category
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.destroy();
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
