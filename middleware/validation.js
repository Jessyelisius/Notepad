const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');


const ValidateToken = async(req, res, next ) => {
    let token;

    const AuthHeaders = req.headers.authorization || req.headers.Authorization
    if(!AuthHeaders) return res.redirect('/404', {Msg: "no auth header"});

    if(AuthHeaders && AuthHeaders.startsWith('Bearer')){
        token = AuthHeaders.split(' ')[1]
    }else if(req.cookies?.token){
        token = res.cookies.token;
    }

    //validate the token
    if(!token){
        console.log('invalid token format');
       return res.redirect('login');
    }

    jwt.verify(token, process.env.JWT_SECRET_TOKEN, async(err, decoded) => {
        if(err){
            console.log('token expired or not valid', err.Msg);
            res.redirect('login')
        }

        //optional decoding user in db
        const user = await UserModel.findById(decoded.user.id)
        if(!user)return res.redirect('404')

        req.user = decoded.user;
        next();
    })
    
}

module.exports = ValidateToken;