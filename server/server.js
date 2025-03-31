const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./database/db');
const signupRoute = require('./routes/signupRoute');
const loginRoute = require('./routes/loginRoute');
const { isAuthenticated } = require('./middleware/authMiddleware');
const categoryRoute = require('./routes/categoryRoute');
const homeRoute = require('./routes/homeRoute')
const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from the frontend
    credentials: true,  // Allow cookies/session handling
}));
app.use(express.json());

// Session management - Secure settings
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false, 
    saveUninitialized: false, 
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // Secure cookies only in production
        httpOnly: true, // Prevent client-side access to session cookie
        maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
    }
}));

// Routes
app.use('/signup', signupRoute);
app.use('/login', loginRoute);


app.use('/categories', isAuthenticated, categoryRoute);
app.use('/home', isAuthenticated, homeRoute);
// Fallback for any route not defined
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Page not found' });
});

// Global error handling
app.use((err, req, res, next) => {
    console.error('Error stack:', err.stack);
    if (err.statusCode) {
        res.status(err.statusCode).json({ message: err.message });
    } else {
        res.status(500).json({ message: 'Something went wrong!' });
    }
});

// Syncing database and starting the server
sequelize.sync()
    .then(() => {
        console.log('Database synced successfully');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error syncing database:', err);
        process.exit(1);
    });
