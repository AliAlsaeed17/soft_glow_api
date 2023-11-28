const express = require('express');
//const bcrypt = require('bcrypt');
const User = require('../models/users.model');
const config = require('../config');
const middleware = require('../middleware');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.route('/:userName').get(middleware.checkToken, async (req, res) => {
    try {
      const result = await User.findOne({ userName: req.params.userName }).exec();
      const msg = {
        data: result,
        username: req.params.userName,
      };
      return res.json(msg);
    } catch (err) {
      console.error('Error occurred during user lookup:', err);
      return res.status(500).json({ msg: err });
    }
  });

router.route('/checkusername/:userName').get(async (req, res) => {
    try {
        const result = await User.findOne({ userName: req.params.userName });
        if (result === null) {
            res.json({ status: false });
        } else {
            res.json({ status: true });
        }
    } catch (err) {
        console.error('Error occurred during user lookup:', err);
        res.status(500).json({ msg: err });
    }
});

router.route('/login').post(async (req, res) => {
    try {
        const result = await User.findOne({ userName: req.body.userName }).exec();
        if (result === null) {
            return res.status(403).json({ msg: 'Incorrect Username' });
        }
        if (result.password === req.body.password) {
            let token = jwt.sign(
                { userName: req.body.userName },
                config.key,
                {}
            );
            res.json({
                token: token,
                msg: 'success'
            });
        } else {
            res.status(403).json({ msg: 'Incorrect Password' });
        }
    } catch (err) {
        res.status(500).json({ msg: err });
    }
});

router.route('/register').post(async (req,res) => {
    try {
        const user = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
        });
        await user.save();
        const token = jwt.sign(
            {userName: req.body.userName},
            config.key, 
            {},);
        res.json({
            token: token,
            msg: 'success',
        });
    } catch (err) {
        res.status(500).json({ msg: 'Error occurred during user registration' });
    }
});

module.exports = router;
