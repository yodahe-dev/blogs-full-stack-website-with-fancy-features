const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication token is missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findByPk(decoded.user_id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

const isAdminOrSubAdmin = (req, res, next) => {
    const allowedRoles = ['9271e44a-0e00-11f0-894f-40b03495ba25', '9276a62a-0e00-11f0-894f-40b03495ba25'];
    if (!allowedRoles.includes(req.user.role_id)) {
        return res.status(403).json({ message: 'Access denied. Admins or Sub-admins only.' });
    }
    next();
};

module.exports = { isAuthenticated, isAdminOrSubAdmin };
