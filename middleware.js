const jwt = require('jsonwebtoken');
const config = require('./config');
const router = require('./routes/user');

const checkToken = (req,res,next) => {

    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ status: false, msg: 'Token is not provided' });
    }

    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(403).json({ status: false, msg: 'Invalid token format' });
    }

    const tokenValue = tokenParts[1];
    jwt.verify(tokenValue, config.key, (err, decoded) => {
        if (err) {
            return res.status(403).json({ status: false, msg: 'Token is invalid' });
        } else {
            req.decoded = decoded;
            next();
        }
    });
}

module.exports = {
    checkToken,
};