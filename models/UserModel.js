const mongoose = require('mongoose');

const Schema = mongoose.Schema

const UserSchema = new Schema({
    FirstName:{
        type: String,
        required: true
    },
    LastName:{
        type: String,
        required: true
    },
    Email:{
        type: String,
        required: [true, "email is required"]
    },
    Password:{
        type: String,
        required: [true,"password is required"]
    }
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);