const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', userController.profile);
router.post('/logout', userController.logout);
router.put("/profile", userController.updateProfile);
router.get('/getMatchingUsers', userController.getMatchingUsers);
router.post('/action', userController.likeOrDislike);
module.exports = router;
