const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const promoteUser = async () => {
    try {
        await connectDB();
        const email = 'sabarnodas365@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User ${email} not found!`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`Success! User ${email} is now an ADMIN.`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

promoteUser();
