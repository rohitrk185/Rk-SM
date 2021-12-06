const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/posts_controller');

router.post('/create', passport.checkAuthentication, userController.create);

module.exports = router;