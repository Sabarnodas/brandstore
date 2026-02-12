const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Token = require('../models/Token');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    let { email, password } = req.body;

    // Sanitize input
    email = email ? email.trim().toLowerCase() : '';
    password = password ? password.trim() : '';

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (user) {
            const isMatch = await user.matchPassword(password);

            if (isMatch) {
                if (!user.isVerified) {
                    return res.status(401).json({
                        message: 'Email not verified. Please verify your email before logging in.',
                        email: user.email,
                        notVerified: true
                    });
                }
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    addresses: user.addresses || [],
                    token: generateToken(user._id),
                });
                return;
            }
        }

        res.status(401).json({ message: 'Invalid email or password' });

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    let { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Sanitize inputs
    name = name.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    // Validate name length
    if (name.length < 2 || name.length > 100) {
        return res.status(400).json({ message: 'Name must be between 2 and 100 characters' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password strength: at least 8 chars, one uppercase, one lowercase, one number, one special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character'
        });
    }

    try {
        let user = await User.findOne({ email });

        if (user) {
            if (user.isVerified) {
                return res.status(400).json({ message: 'User already exists' });
            }
            // User exists but not verified - delete old token if any and proceed to send new link
            await Token.findOneAndDelete({ userId: user._id });
        } else {
            // Create New User
            user = await User.create({
                name,
                email,
                password,
                isVerified: false
            });
        }

        if (user) {
            // Generate Verification Token
            const token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString('hex')
            }).save();

            const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/users/${user._id}/verify/${token.token}`;

            // Send Verification Email
            try {
                // Log URL for testing in terminal
                console.log(`[DEBUG] Verification URL for ${user.email}: ${url}`);

                await sendEmail({
                    email: user.email,
                    subject: 'Verify your BrandStore Account',
                    message: `Please verify your email by clicking the link: ${url}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                            <h2 style="color: #333;">Welcome to BrandStore!</h2>
                            <p>Thank you for registering. Please click the link below to verify your email address:</p>
                            <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a>
                            <p>This link will expire in 1 hour.</p>
                            <p>If you didn't request this, please ignore this email.</p>
                        </div>
                    `
                });

                res.status(201).json({
                    message: 'Verification link sent to email. Please verify your account.',
                    email: user.email,
                    debugLink: url // For development convenience
                });
            } catch (emailError) {
                console.error('Email sending failed:', emailError.message);
                res.status(201).json({
                    message: 'Account created, but failed to send verification email.',
                    warning: 'Check backend console for verification link.',
                    email: user.email,
                    debugLink: url
                });
            }
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Verify email with link
// @route   GET /api/auth/:id/verify/:token
// @access  Public
router.get('/:id/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send({ message: "Invalid link" });

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send({ message: "Invalid link" });

        user.isVerified = true;
        await user.save();
        await token.deleteOne();

        res.status(200).send({ message: "Email verified successfully" });
    } catch (error) {
        console.error('Email verification error:', error.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
