const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const forgetPassword = new Schema({
    User_id:{
        type: String,
        required: true,
        unique: true
    },
    Otp:{
        type: Number,
        required: true,
        max:9999,
        min:1000
    },
    ExpiresAt:{
        type: Date,
        default: Date.null,
        expiresAt: "10m"
    }
}, {timestamps: true});


module.exports = mongoose.model('forgetPassword', forgetPassword);