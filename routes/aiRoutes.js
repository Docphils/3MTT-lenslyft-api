const express = require('express');
const router = express.Router();
const { handleAIQuery } = require('../controllers/aiController');
const aiRateLimiter = require('../middleware/rateLimiter');



router.post('/search', aiRateLimiter, handleAIQuery);

module.exports = router;
