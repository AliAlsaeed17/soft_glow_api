const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
});

exports = mongoose.model('User',User);