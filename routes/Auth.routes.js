const express = require('express');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');
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
         
        await UserModel.create(collect);
        res.redirect('login');
    
    } catch (error) {
        console.log(error);
        res.status(400).render('register', {Msg: "Error creating user"});
    }
});

router.get('/login', (req, res) => {
    res.render('login')
})
// router.post('/login', async(req, res) => {
// try {
//     const Input = req.body;
//     if(!Input)return res.render('login',{Msg: "login credentials not valid"});

// } catch (error) {
    
// }
// });

module.exports = router;