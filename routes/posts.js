const express = require('express');
const Post = require('../models/post.model');
const middleware = require('../middleware');

const router = express.Router();

router.route('/:name').get(middleware.checkToken, async (req, res) => {
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