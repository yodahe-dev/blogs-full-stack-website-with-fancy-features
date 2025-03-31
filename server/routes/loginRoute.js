const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware to check if the session is properly set up
const session = require('express-session');
router.use(session({
    secret: 'your_secret_key', 
    resave: false, 
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if you're using HTTPS
}));

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the stored password hash
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Role mapping
        const roleMap = {
            '9271e44a-0e00-11f0-894f-40b03495ba25': 'admin',
            '9276a62a-0e00-11f0-894f-40b03495ba25': 'subadmin',
            '9276a7a0-0e00-11f0-894f-40b03495ba25': 'user'
        };

        const role = roleMap[user.role_id] || 'user'; // Default to 'user' if role_id doesn't match

        // Set session data
        req.session.user = {
            user_id: user.user_id,  // Assuming 'user_id' is the correct field name
            user_role: role,
        };

        // Generate JWT token
        const token = jwt.sign(
            { user_id: user.user_id, role }, // Assuming 'user_id' is the correct field name
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Return successful response
        res.status(200).json({ message: 'Login successful', token, role });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
