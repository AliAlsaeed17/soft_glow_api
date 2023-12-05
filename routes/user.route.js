const express = require('express');
const userController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/verify_token');

const router = express.Router();

router.route('/login').post(userController.loginUser);
router.route('/register').post(userController.registerUser);
router.route('/:id').get(verifyToken, userController.getUserById);
router.route('/update/:id').patch(verifyToken, userController.updateUser);
router.route('/delete/:id').delete(verifyToken, userController.deleteUser);

module.exports = router;
