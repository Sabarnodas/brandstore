const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const checkUsers = async () => {
    try {
        await connectDB();
        const users = await User.find({});
        console.log('Current Users in DB:');
        users.forEach(u => {
            console.log(`- Email: ${u.email}, Role: ${u.role}, Verified: ${u.isVerified}`);
        });
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

checkUsers();
