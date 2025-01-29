const express = require('express')
const UserModel = require('../../models/UserModel');
const forgetpwd = require('../../models/forgetpwd');
const { generateOtp, Sendmail } = require('../../utils/mailer');
const bcrypt = require('bcryptjs')
const router = express.Router();



router.get('/forgetpwd', async(req, res) => {
    res.render('forgetPassword',{Msg:""})
});
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
            User_id: user.id,
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
            
        res.status(200).render('resetPwd', {Msg: ""})
    } catch (error) {
        console.log("error processing request",error);
        res.status(400).render('404');
    }
});

router.get('/resetPwd', async(req, res) => {
    res.render('resetPwd', {Msg:""});
});

router.post('/resetPwd', async (req, res) => {
    try {
        const { Otp, Password } = req.body;

        // Check if OTP exists in database
        const otpEntry = await forgetpwd.findOne({ Otp });
        if (!otpEntry) {
            return res.status(400).render('resetPwd', { Msg: "Invalid OTP" });
        }

        // Validate OTP expiry
        const otpAge = Date.now() - new Date(otpEntry.ExpiresAt).getTime();
        if (otpAge > 10 * 60 * 1000) { // 10 minutes
            return res.status(400).render('resetPwd', { Msg: "OTP expired" });
        }

        // Ensure password length is sufficient
        if (Password.length < 4) {
            return res.status(400).render('resetPwd', { Msg: "Password must be at least 4 characters long" });
        }

        // Hash the new password
        const hashedPwd = bcrypt.hashSync(Password, 10);

        // Update the user’s password in the UserModel
        await UserModel.findByIdAndUpdate(otpEntry.User_id, { Password: hashedPwd });

        // Delete the OTP entry from `forgetpwd` collection
        await forgetpwd.deleteOne({ _id: otpEntry._id });

        // Redirect to login page
        res.status(200).render('login', { Msg: "Password reset successful. Please log in." });

    } catch (error) {
        console.log("Error processing request:", error);
        res.status(500).render('resetPwd', { Msg: "An error occurred while processing your request" });
    }
});


module.exports = router;