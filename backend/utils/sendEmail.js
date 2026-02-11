const nodemailer = require('nodemailer');

const sendEmail = async (options, credentials) => {
    // Determine credentials to use
    const emailUser = credentials?.user || process.env.EMAIL_USER;
    const emailPass = credentials?.pass || process.env.EMAIL_PASS;

    // Check for credentials
    if (!emailUser || !emailPass) {
        console.warn('WARNING: EMAIL_USER or EMAIL_PASS not set. Email not sent.');
        return;
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });

    // Define email options
    const mailOptions = {
        from: `BrandStore <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
