const nodemailer = require('nodemailer');

const test = async () => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'test@gmail.com',
            pass: 'testpass',
        },
    });

    try {
        await transporter.verify();
        console.log('Server is ready to take our messages');
    } catch (error) {
        console.log('Authentication failed:', error.message);
    }
};

test();
