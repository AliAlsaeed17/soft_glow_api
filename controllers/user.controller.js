const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

const loginUser = async (req, res) => {
  try {
    const { name, email, role, password} = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return res.status(403).json({ message: 'Invalid username or password' });
    }
    bcrypt.compare(password, existingUser.password, async (err, result) => {
        if(err) { res.status(400).json({ message: 'Invalid password' }); }
        const token = jwt.sign(
            { 
                name: existingUser.name, 
                email: existingUser.email,
                role: existingUser.role,
            },
            config.key, 
            {},);
        res.json({ 
            user: {
                name: existingUser.userName, 
                email: existingUser.email ,
                role: existingUser.role,
            }, 
            token: token});
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, role, password} = req.body;
    console.log(password);
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    bcrypt.hash(password, 10, async(hash, err) => {
        if(err) { res.status(400).json({ message: 'Error in password' }); }
        const user = new User({
            name: name,
            email: email,
            role: role,
            password: hash,
        }).save();
        const token = jwt.sign(
            {name: user.name, email: user.email, role: user.role},
            config.key, 
            {},);
        res.json({
            msg: 'success',
            token: token,
        });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error occurred during user registration' });
  }
};

const getUserById = async (req, res) => {
    try {
        const result = await User.findOne({ _id: req.params.id }).exec();
        return res.json({userName: result.userName, email: result.email});
    } catch (err) {
        return res.status(500).json({ msg: err });
    }
};

const updateUser = async (req, res) => {
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
};

const deleteUser = async (req, res) => {
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
};

module.exports = { loginUser, registerUser, getUserById, updateUser, deleteUser };