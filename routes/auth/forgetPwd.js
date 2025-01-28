const express = require('express')
const UserModel = require('../../models/UserModel');
const forgetpwd = require('../../models/forgetpwd');
const { generateOtp, Sendmail } = require('../../utils/mailer');
const bcrypt = require('bcryptjs')
const router = express.Router();



router.get('/forgetpwd', async(req, res) => {
    res.render('forgetPassword')
})
router.post('/forgetpwd', async(req, res) => {
    
    try {
        const {Email} = req.body;
        if(!Email) return res.status(400).render('forgetPassword', {Msg: "pls provide an email"})

        const user = await UserModel.findOne({Email})
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
        await Sendmail(Email, "Password Reset Using OTP", `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background-color: #f9f9f9;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 30px auto;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding-bottom: 20px;
                    }
                    .header h1 {
                        margin: 0;
                        color: #1eb2a6; /* Updated color */
                    }
                    .content {
                        padding: 20px;
                        text-align: center;
                    }
                    .content p {
                        margin: 15px 0;
                        font-size: 16px;
                    }
                    .otp-code {
                        font-size: 24px;
                        font-weight: bold;
                        color: #1eb2a6; /* Updated color */
                        margin: 20px 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        font-size: 14px;
                        color: #777;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset</h1>
                    </div>
                    <div class="content">
                        <p>Hi there,</p>
                        <p>We received a request to reset your password for your Notepad account.</p>
                        <p>If you made this request, use the OTP below to reset your password:</p>
                        <div class="otp-code">${Otp}</div>
                        <p>This OTP will expire in 10 minutes. If you didn’t request this, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Notepad App. All Rights Reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            `);
            
        res.status(200).render('forgetPassword', {Msg: "otp sent to your email"})
    } catch (error) {
        console.log("error processing request",error);
        res.status(400).render('404');
    }
});

router.post('/resetPwd', async(req,res)=>{
    try {
        const {Otp, Password } = req.body;

        const user = await forgetpwd.findOne({User_id:req.user._id});
        if(!user){
            return res.status(400).render('resetPwd',{Msg: "user not found"})
        }
        //validate otp
        if(!Otp || Otp !== user.Otp){
            return res.status(400).render('resetPwd',{Msg: "invalid otp"})
        }
        //if otp is expired
       const otpAge = Date.now() - user.ExpiresAt;
       if(otpAge > 10 * 10* 1000){
            return res.status(400).render('resetPwd',{Msg: "otp expired"})
       }

        // password length
        if (Password.length < 4) {
            return res.status(400).render('resetPwd', { Msg: "Password must be at least 4 characters long" });
        }
       const pwd = bcrypt.hashSync(Password, 10);
       user.Password = pwd;
       user.Otp = undefined;
       user.ExpiresAt = undefined;
       await user.save()
       res.status(200).render('login')
       
    } catch (error) {
        console.log("error processing request",error);
        res.status(500).render('resetPwd', { Msg: "An error occurred while processing your request" });    }
})

module.exports = router;