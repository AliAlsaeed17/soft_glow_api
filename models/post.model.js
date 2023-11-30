const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Post  = Schema({
    userName: String,
    title: String,
    body: String,
    coverImage: {
        type: String,
        default: '',
    },
    like: {
        type: Number,
        default: 0,
    },
    share: {
        type: Number,
        default: 0,
    },
    comment: {
        type: Number,
        default: 0,
    },
},{timestamp: true});

module.exports = mongoose.model('Post',Post);