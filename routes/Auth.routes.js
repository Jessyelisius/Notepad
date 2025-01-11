const express = require('express');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');
const { jwt } = require('jsonwebtoken');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('register');
});

router.post('/', async(req, res) => {
    try {
        const collect = req.body;
        if(!collect.FirstName)return res.status(400).render('register',{Msg: "Firstname is required"});
        if(!collect.LastName)return res.status(400).render('register',{Msg: "Lastname is required"});
        if(!collect.Email)return res.status(400).render('register',{Msg: "Email is required"});
        if(!collect.Password.length<4)return res.status(400).render('register',{Msg: "Password is short"});
        collect.Password = bcrypt.hashSync(collect.Password, 5);

        let existingUser = await UserModel.findOne({Email: collect.Email})
        if(existingUser)return res.render('register',{Msg: "user is a registered member"})
         
        await UserModel.create(collect);
        res.redirect('login');
    
    } catch (error) {
        console.log(error);
        res.status(400).render('register', {Msg: "Error creating user"});
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



module.exports = router;