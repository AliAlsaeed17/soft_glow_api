const mongoose = require('mongoose');

const User = mongoose.Schema({ 
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    role: Number,
    password: {
        type: String,
        required: true,
    },
},{timestamp: true});

module.exports = mongoose.model('User',User);