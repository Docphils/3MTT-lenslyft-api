const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createReview,
  getReviewsForMovie,
  updateReview,
} = require('../controllers/reviewController');

router.get('/:movieId', getReviewsForMovie);
router.post('/', protect, createReview);
router.put("/:id", protect, updateReview);

module.exports = router;
