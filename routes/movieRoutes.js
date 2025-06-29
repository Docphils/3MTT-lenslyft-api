const express = require('express');
const router = express.Router();
const {
  searchMovies,
  getMovieDetail,
} = require('../controllers/movieController');

router.get('/search', searchMovies);        // ?query=batman
router.get('/:id', getMovieDetail);         // TMDb ID

module.exports = router;
