const express = require('express');
const router = express.Router();

const userController = require('../controllers/posts_controller');

router.post('/create', userController.create);

module.exports = router;