const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

const loginUser = async (req, res) => {
  try {
    const { email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email, and password are required' });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return res.status(403).json({ message: 'Invalid email or password' });
    }
    bcrypt.compare(password, existingUser.password, async (err, result) => {
        if(!result) { res.status(400).json({ message: 'Invalid password' }); }
        else {
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
        }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, role, password} = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    bcrypt.hash(password, 10, async(err, hash) => {
        if(err) { res.status(400).json({ message: 'Error in password' }); }
        else {
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
            res.status(200).json({
                msg: 'success',
                token: token,
            });
        }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error occurred during user registration' });
  }
};

const getUserById = async (req, res) => {
    try {
        const result = await User.findOne({ _id: req.params.id }).exec();
        return res.json({
            name: result.name, 
            email: result.email,
            role: result.role,
        });
    } catch (err) {
        return res.status(500).json({ msg: err });
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, email, role, password} = req.body;
        if (!password) {
            return res.status(400).json({ message: 'Password required' });
        }
        bcrypt.hash(password, 10, async(err, hash) => {
            if(err) { res.status(400).json({ message: 'Invalid password' }); }
            else {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: req.params.id },
                    { $set: { name:  name, email: email, role: role, password: hash } },
                    { new: true }
                  );
                if (updatedUser) {
                    res.json({ 
                      msg: 'User successfully updated.', 
                      user: {
                        name: updatedUser.name,
                        email: updatedUser.email,
                         role: updatedUser.role 
                       } ,
                  });
                } else {
                    res.status(404).json({ msg: 'User not found' });
                }
            }
        });
    } catch (err) {
        res.status(500).json({ msg: err });
    }
};

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete(
          { _id: req.params.id });
        if (deletedUser) {
          res.json({ msg: 'User deleted successfully', name: deletedUser.name });
        } else {
          res.status(404).json({ msg: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

module.exports = { loginUser, registerUser, getUserById, updateUser, deleteUser };