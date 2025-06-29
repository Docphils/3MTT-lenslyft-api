const User = require('../models/User');
const Review = require('../models/Review');
const axios = require('axios');
const TMDB_API = process.env.TMDB_API_KEY;

/**
 * Get movie recommendations for a user based on favorites, follows, and genres
 */
exports.getRecommendations = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) return [];

  // 1. Extract genres from favorites in cache
  const Movie = require('../models/Movie');
  const cachedFavorites = await Movie.find({ tmdbId: { $in: user.favorites } });

  const genreCount = {};
  cachedFavorites.forEach(movie => {
    movie.genres.forEach(g => {
      genreCount[g] = (genreCount[g] || 0) + 1;
    });
  });

  const topGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);

  // 2. Map genre names to TMDb IDs
  const { data: genreData } = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API}`);
  const genreMap = genreData.genres.reduce((map, g) => {
    map[g.name] = g.id;
    return map;
  }, {});

  const genreIds = topGenres.map(name => genreMap[name]).filter(Boolean);

  // 3. Get movies by genre
  let genreResults = [];
  for (let id of genreIds) {
    const { data } = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
      params: {
        api_key: TMDB_API,
        with_genres: id,
        sort_by: 'popularity.desc',
      },
    });
    genreResults = [...genreResults, ...data.results.slice(0, 5)];
  }

  // 4. Get movies liked by followed users
  const followed = await User.find({ _id: { $in: user.following } });
  const followedFavs = [...new Set(followed.flatMap(u => u.favorites))];

  const followedMovies = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
    params: {
      api_key: TMDB_API,
    },
  });

  const fallbackResults = followedMovies.data.results.slice(0, 10);

  // Combine and deduplicate
  const recommended = [...genreResults, ...fallbackResults].filter(
    (movie, index, self) =>
      index === self.findIndex(m => m.id === movie.id)
  );

  return recommended.slice(0, 12);
};
