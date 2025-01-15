const nodemailer = require('nodemailer');
const UserModel = require('../models/UserModel');
const forgetpwd = require('../models/forgetpwd');
const router = require('./Auth.routes');

const transport = nodemailer.createTransport({
    service: process.env.service,
    port: 465,

    auth:{
        user: process.env.email,
        pass: process.env.pass
    },
    tls:{rejectUnauthorized: false}
})

const generateOtp = ()=>{
    return Math.floor(1000 + Math.random() * 9000);
}

const sendOTP = async({to, subject, text}) => {
    const mails = {
        from: process.env.email,
        to: to,
        subject: subject,
        text: text
    };
    return transport.sendMail(mails);
}

router.get('/forgetpwd', async(req, res) => {
    res.render('forgetPassword')
})
router.post('/forgetpwd', async(req, res) => {
    
    try {
        const {Email} = req.body;
        if(!Email) return res.status(400).render('forgetPassword', {Msg: "pls provide an email"})

        const user = await UserModel.findOne(Email)
        if(!user) {
            return res.status(400).render('forgetPassword', {Msg: "no user with the email"});
        }
        const Otp = generateOtp();

        //save otp to db
        const pwdEntry = new forgetpwd({
            User_id: user._id,
            Otp: Otp
        });

        await pwdEntry.save();
        const EmailData = {
            to: Email,
            subject: "Password Reset OTP",
            text: `your otp for NotePad is ${Otp}, expires in 10min`
        }

        await sendOTP(EmailData);
        res.status(200).render('forgetPassword', {Msg: "otp sent to your email"})
    } catch (error) {
        console.log("error processing request",error);
        res.status(400).render('404');
    }
})

module.exports = router