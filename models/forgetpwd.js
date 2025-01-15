const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const forgetPassword = new Schema({
    user_id:{
        type: String,
        required: true
    },
    otp:{
        type: Number,
        required: true
    },
    Date:{
        type: Date.now,
        required: true,
        expiresAt: Date.now()
    }
}, {timestamps: true});


module.exports = mongoose.model('forgetPassword', forgetPassword);