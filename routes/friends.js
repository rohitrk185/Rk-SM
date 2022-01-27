const express = require('express');
const router = express.Router();

const friendsController = require('../controllers/friends_controller');


router.get('/toggleFriend', friendsController.toggleFriend);


module.exports = router;