const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User'); 

const router = express.Router();
router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            user_id: uuidv4(),
            username,
            email,
            password_hash: hashedPassword,
            role_id: '9276a7a0-0e00-11f0-894f-40b03495ba25'
        });

        res.status(201).json({ message: 'User registered successfully', user_id: newUser.user_id });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
/*


*/