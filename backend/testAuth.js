const nodemailer = require('nodemailer');

const test = async () => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'iembrandstore@gmail.com',
            pass: 'dknzveqhvyolxfql',
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
