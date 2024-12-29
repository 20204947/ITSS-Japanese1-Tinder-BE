const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');
const eventController = require('../controllers/eventController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', userController.profile);
router.post('/logout', userController.logout);
router.put("/profile", userController.updateProfile);
router.get('/getMatchingUsers', userController.getMatchingUsers);
router.post('/action', userController.likeOrDislike);
router.get('/event/get', eventController.getEvent);
router.post('/event/create', eventController.createEvent);
router.put('/event/update', eventController.updateEvent);
router.put('/event/unlink', eventController.unlinkEvent);

// Thêm route để lấy danh sách những người đã matching
router.post("/matching", userController.getMatchedUsers);

// Thêm các route cho tin nhắn
router.post("/messages", messageController.saveMessage);
router.get("/messages/:matchingID", messageController.getMessagesByMatchingID);
module.exports = router;
