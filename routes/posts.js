const express = require('express');
const Post = require('../models/post.model');
const {verifyToken} = require('../middlewares/verify_token');

const router = express.Router();

router.route('/:name').get(verifyToken, async (req, res) => {
    try {
      const result = await Post.find({ userName: req.params.name });
      if (!result || result.length === 0) {
        return res.json({ data: [] });
      }
      return res.json({ data: result });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  });

module.exports = router;