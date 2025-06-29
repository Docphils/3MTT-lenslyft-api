const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    tmdbId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    overview: String,
    poster: String,
    backdrop: String,
    trailerUrl: String,
    genres: [String],
    releaseDate: String,
    cast: [String],
    averageRating: { type: Number, default: 0 },
    lastAccessed: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
