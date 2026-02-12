const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            }

            // Check if user exists with the same email (link accounts)
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // Link googleId to existing user
                user.googleId = profile.id;
                await user.save();
                return done(null, user);
            }

            // Create new user
            user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                password: '', // No password for Google users
                isVerified: true // Google emails are already verified
            });

            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }));

// Serialize user for session (though we use JWT, passport might need this structure if we used sessions)
// We will largely bypass session serialization for JWT response, but good to have.
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});
