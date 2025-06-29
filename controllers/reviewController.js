const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  const { movieId, rating, reviewText } = req.body;
  const user = req.user;

  const existing = await Review.findOne({ user: user.id, movieId });
  if (existing) return res.status(400).json({ message: 'Already reviewed' });

  const review = await Review.create({
    user: user.id,
    movieId,
    rating,
    reviewText,
  });

  res.status(201).json(review);
};

exports.getReviewsForMovie = async (req, res) => {
  const reviews = await Review.find({ movieId: req.params.movieId }).populate('user', '_id username');
  res.json(reviews);
};

// controllers/reviewController.js
exports.updateReview = async (req, res) => {
  const { rating, reviewText } = req.body;
  const userId = req.user.id;
  const reviewId = req.params.id;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this review." });
    }

    // Update only if new values are passed
    if (rating) review.rating = rating;
    if (reviewText) review.reviewText = reviewText;

    await review.save();

    res.status(200).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update review." });
  }
};
