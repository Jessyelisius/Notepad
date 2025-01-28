const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const ValidateToken = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        const AuthHeaders = req.headers.authorization || req.headers.Authorization;
        if (AuthHeaders && AuthHeaders.startsWith('Bearer')) {
            token = AuthHeaders.split(' ')[1];
        } else if (req.cookies?.token) {
            // Check for token in cookies
            token = req.cookies.token;
        }

        // If no token, redirect to login
        if (!token) {
            console.error('No token provided');
            return res.redirect('/auth/login'); // Redirect to login
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET_TOKEN, async (err, decoded) => {
            if (err) {
                console.error('Token verification failed:', err.message);
                return res.redirect('/auth/login'); // Redirect to login if token invalid
            }

            // Optional: Fetch user from DB to validate
            const user = await UserModel.findById(decoded.user.id); // `id` should match how it's encoded
            if (!user) {
                console.error('User not found in database');
                return res.redirect('/auth/login');
            }

            // Attach user to request for future use
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Error in ValidateToken middleware:', error.message);
        return res.redirect('/auth/login'); // Redirect on error
    }
};

module.exports = ValidateToken;
