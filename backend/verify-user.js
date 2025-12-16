
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const verify = async () => {
    try {
        const email = 'admin@eshop.com';
        const password = 'admin123';

        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found');
        } else {
            console.log('User found:', user.email);
            console.log('Stored hashed password:', user.password);

            const isMatch = await user.matchPassword(password);
            console.log('Password match result:', isMatch);
        }

    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
};

verify();
