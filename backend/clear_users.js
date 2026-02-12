const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Token = require('./models/Token');
const connectDB = require('./config/db');

dotenv.config();

const clearUsers = async () => {
    try {
        await connectDB();

        console.log('Deleting all users...');
        await User.deleteMany({});

        console.log('Deleting all verification tokens...');
        await Token.deleteMany({}); // Also clear tokens to be clean

        console.log('User database cleared successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

clearUsers();
