const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { toggleFollow } = require('../controllers/socialController');

router.post('/:targetId', protect, toggleFollow);

module.exports = router;
