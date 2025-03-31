const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware for session setup (not strictly needed with JWT, but kept for your reference)
const session = require('express-session');
router.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Ensure secure cookie settings in production with HTTPS
}));

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare provided password with stored password hash
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Role mapping based on user role_id
        const roleMap = {
            '9271e44a-0e00-11f0-894f-40b03495ba25': 'admin',
            '9276a62a-0e00-11f0-894f-40b03495ba25': 'subadmin',
            '9276a7a0-0e00-11f0-894f-40b03495ba25': 'user'
        };

        const role = roleMap[user.role_id] || 'user'; // Default to 'user' if role_id is unrecognized

        // Generate JWT token
        const token = jwt.sign(
            { user_id: user.user_id, role }, // Payload with user info
            process.env.JWT_SECRET,           // Secret for signing JWT
            { expiresIn: '1h' }              // Token expiration time
        );

        // Optionally set session data if you still want session-based info:
        req.session.user = {
            user_id: user.user_id,
            user_role: role,
        };

        // Return successful response with the JWT token and role
        res.status(200).json({
            message: 'Login successful',
            token,
            role,
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
