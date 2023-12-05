const express = require('express');
const Profile = require('../models/profile.model');
const {verifyToken} = require('../middlewares/verify_token');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer Configugeration
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,path.join(__dirname, '../uploads'));
    },
    filename: (req,file,cb) => {
        cb(null,  Date.now() +'.jpg');
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 6,
    },
    // fileFilter: fileFilter,
});

router.route('/add').post(verifyToken, async (req, res) => {
    try {
      const profile = new Profile({
        userName: req.body.userName,
        name: req.body.name,
        profession: req.body.profession,
        DOB: req.body.DOB,
        titleline: req.body.titleline,
        about: req.body.about,
      });
      await profile.save();
      return res.json({ msg: 'Profile Successfully Saved' });
    } catch (error) {
      return res.status(400).json({ msg: error.message });
    }
});

router.route('/update/:id').patch(verifyToken, async (req, res) => {
    try {
      let profile = await Profile.findOne({ _id: req.params.id });
      if (profile === null) {
        profile = {};  // Initialize profile if not found
      }
      const updatedProfile = await Profile.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            name: req.body.name || profile.name,
            profession: req.body.profession || profile.profession,
            DOB: req.body.DOB || profile.DOB,
            titleline: req.body.titleline || profile.titleline,
            about: req.body.about || profile.about,
          },
        },
        { new: true }
      );
      if (updatedProfile === null) {
        return res.json({ data: [] });
      } else {
        return res.json({ data: updatedProfile });
      }
    } catch (error) {
      return res.status(500).json({ err: error });
    }
  });

router.route('/:id').get(verifyToken, async (req, res) => {
    try {
      const result = await Profile.findOne({ _id: req.params.id });
      if (result === null) {
        return res.json({ status: false, user: {} });
      } else {
        return res.json({ status: true, profile: {
            userName: result.userName,
            name: result.name,
            profession: result.profession,
            DOB: result.DOB,
            titleline: result.titleline,
            about: result.about,
          } });
      }
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
});

module.exports = router