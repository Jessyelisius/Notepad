const express = require('express');
const bcrypt = require('bcryptjs');
const UserModel = require('../../models/UserModel');
const  jwt  = require('jsonwebtoken');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('register', {Msg: ""});
});


router.post('/', async (req, res) => {
    try {
        const { FirstName, LastName, Email, Password } = req.body;

        // Validate required fields
        if (!FirstName || !LastName || !Email || !Password) {
            return res.status(400).render('register', { Msg: "All fields are required" });
        }

        // password length
        if (Password.length < 4) {
            return res.status(400).render('register', { Msg: "Password must be at least 4 characters long" });
        }

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ Email });
        if (existingUser) {
            return res.status(400).render('register', { Msg: "User is already a registered member" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Create a new user
        await UserModel.create({
            FirstName,
            LastName,
            Email,
            Password: hashedPassword,
        });

        // Redirect to login page on success
        res.render('login', {Msg:""});

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).render('register', { Msg: "An error occurred. Please try again later." });
    }
});


module.exports = router;