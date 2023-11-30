const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/users.model');
const config = require('../config');
const middleware = require('../middleware');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.route('/login').post(async (req, res) => {
    try{
        const { userName, password ,email} = req.body;
        const existingUser = await User.findOne({ userName });
        if (!existingUser) {
            return res.status(403).json({ message: 'Invalid username or password' });
        }
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
            return res.status(403).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ userName , email}, config.key);
        res.json({ 
            user: {userName: existingUser.userName, 
                email: existingUser.email}, 
            token: token});
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

router.route('/register').post(async (req,res) => {
    try {
        const { userName, password ,email} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            userName: userName,
            email: email,
            password: hashedPassword,
        });
        await user.save();
        const token = jwt.sign(
            {userName: user.userName, email: user.email},
            config.key, 
            {},);
        res.json({
            msg: 'success',
            token: token,
        });
    } catch (err) {
        res.status(500).json({ msg: 'Error occurred during user registration' });
    }
});

router.route('/:id').get(middleware.checkToken, async (req, res) => {
    try {
      const result = await User.findOne({ _id: req.params.id }).exec();
      return res.json({userName: result.userName, email: result.email});
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  });

router.route('/update/:id').patch(middleware.checkToken, async (req, res) =>  {
    try {
        const { userName, password ,email} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.findOneAndUpdate(
          { _id: req.params.id },
          { $set: { userName:  userName, email: email, password: hashedPassword } },
          { new: true }
        );
        if (updatedUser) {
          res.json({ 
            msg: 'User successfully updated.', 
            user: {userName: req.body.userName, email, email: req.body.email} ,
        });
        } else {
          res.status(404).json({ msg: 'User not found' });
        }
      } catch (err) {
        res.status(500).json({ msg: err });
      }
});

router.route('/delete/:id').delete(middleware.checkToken, async (req, res) => {
    try {
      const deletedUser = await User.findOneAndDelete(
        { _id: req.params.id });
      if (deletedUser) {
        res.json({ msg: 'User deleted successfully', userName: deletedUser.userName });
      } else {
        res.status(404).json({ msg: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  });

module.exports = router;
