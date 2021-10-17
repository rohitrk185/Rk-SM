const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('Router loaded');


router.get('/', homeController.home);
// router.get('/profile', homeController.profile);
// router.get('/posts', homeController.posts);
router.use('/users', require('./posts'));
router.use('/users', require('./users'));



module.exports = router;