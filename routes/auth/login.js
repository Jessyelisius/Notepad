const UserModel = require('../../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const router = require('express').Router();


router.get('/login', (req, res) => {
    res.render('login', {Msg:" "})
});

router.post('/login', async(req, res) => {
try {
    const {Email, Password} = req.body;

    const user = await UserModel.findOne({Email})
    if(!user) return res.render('login', {Msg: 'User is not found'});

    const pwdValid = bcrypt.compareSync(Password, user.Password);
    if(!pwdValid) return res.render('login', {Msg: 'incorrect password'});

    //generate a jwt token
    const token = jwt.sign({
        user:{
            id: user.id,
            Email: user.Email
        }
    }, process.env.JWT_SECRET_TOKEN,{expiresIn:'1hr'});

    //set token as cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.SESSION_SECRET,
        maxAge: 3600000 //token expiry 1hr
    });

    res.redirect('/home');

} catch (error) {
    console.log('error while trying to login',error);
    res.render('login',{Msg: "server error"});
}
});

module.exports = router;