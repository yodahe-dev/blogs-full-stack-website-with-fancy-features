const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./database/db');  // Ensure you have your Sequelize setup here
const signupRoute = require('./routes/signupRoute');
const loginRoute = require('./routes/loginRoute');
const { isAuthenticated } = require('./middleware/authMiddleware');
const categoryRoute = require('./routes/categoryRoute');

const app = express();

app.use(cors());
app.use(express.json());

// Session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Routes
app.use('/signup', signupRoute);
app.use('/login', loginRoute);
app.use('/categories', categoryRoute);


// Fallback route for non-existing paths
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Page not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Syncing database and starting server
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
