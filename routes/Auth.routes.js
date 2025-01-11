const express = require('express');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');
const { jwt } = require('jsonwebtoken');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('register');
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
        res.redirect('/login');

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).render('register', { Msg: "An error occurred. Please try again later." });
    }
});


router.get('/login', (req, res) => {
    res.render('login')
});

router.post('/login', async(req, res) => {
try {
    const {Email, Password} = req.body;

    const user = await UserModel.findOne({Email})
    if(!user) return res.render('login', {Msg: 'User is not found'});

    const pwdValid = bcrypt.compareSync(Input.Password, Password);
    if(!pwdValid) return res.render('login', {Msg: 'incorrect password'});

    //generate a jwt token
    const token = jwt.sign({
        user:{
            id: user.id,
            Email: user.Email
        }
    }, process.env.JWT_SECRET_TOKEN,{ExpiresIn:'1hr'});

    //set token as cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.SESSION_SECRET,
        maxAge: 3600000 //token expiry 1hr
    });

    res.redirect('index')

} catch (error) {
    console.log('error while login in');
    res.render('login',{Msg: "server erroe"});
}
});

router.post('/forgetpwd', async, (req, res) => {
    try {
        
    } catch (error) {
        
    }
})



module.exports = router;