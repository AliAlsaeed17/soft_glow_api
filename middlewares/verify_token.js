const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyToken = async (req, res, next) => {
    try {
      const token = req.headers['authorization'];
      if (!token) {
        return res.status(403).json({ status: false, msg: 'Token is not provided' });
      }
      const tokenParts = token.split(' ');
      if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(403).json({ status: false, msg: 'Invalid token format' });
      }
      const tokenValue = tokenParts[1];
      
      try {
        const decoded = jwt.verify(tokenValue, config.key);
        req.decoded = decoded;
        next();
      } catch (err) {
        return res.status(403).json({ status: false, msg: 'Token is invalid' });
      }
    } catch (error) {
      return res.status(500).json({ status: false, msg: 'Error processing token' });
    }
  };

module.exports = verifyToken;