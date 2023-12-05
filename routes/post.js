const express = require('express');
const Post = require('../models/post.model');
const verifyToken = require('../middlewares/verify_token');
const multer = require('multer');
const path = require('path');
const { json } = require('express/lib/response');

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

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 6,
    },
});

router.route('/add').post(verifyToken, upload.single('img'), async (req, res) => {
    try {
      const { userName, title ,body} = req.body;
      const post = Post({
        userName: userName,
        title: title,
        body: body,
        coverImage: req.file.path,
      });
      const result = await post.save();
      res.json({
        userName: result.userName,
        title: result.title,
        body: result.body,
        coverImage: result.coverImage,
      });
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  });

router.route('/update/:id').patch(verifyToken,upload.single('img') ,async (req, res) => {
    try {
      const { userName, title ,body} = req.body;
      const updatedPost = await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { 
            userName: userName, 
            title: title, 
            body: body, 
            coverImage: req.file.path,
        }},
        { new: true }
      );
      if (updatedPost) {
        res.json({ 
          msg: 'Post successfully updated.', 
          user: {
            userName: userName, 
            title: title, 
            body: body,
            coverImage: req.file.path,
        },
      });
      } else {
        res.status(404).json({ msg: 'Post not found' });
      }
    } catch (error) {
      res.status(500).json({ msg: error });
    }
});

router.route('/delete/:id').delete(verifyToken, async (req, res) => {
    try {
      const result = await Post.findOneAndDelete({_id: req.params.id });
      if (result) {
        return res.json({ msg: 'Post deleted' });
      } else {
        return res.json({ msg: 'Post not deleted' });
      }
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
});

module.exports = router;