const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('blogs', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 10, // Max connections
        min: 0,  // Min connections
        acquire: 30000, // Max time (ms) to get a connection
        idle: 10000  // Max idle time before closing connection
    }
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
testConnection();

module.exports = sequelize;
