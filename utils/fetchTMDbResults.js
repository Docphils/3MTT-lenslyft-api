const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';

/**
 * Hardcoded genre mapping (can be fetched dynamically if preferred)
 */
const GENRE_MAP = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  'Science Fiction': 878,
  'TV Movie': 10770,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

/**
 * Fetches movies from TMDb using genre IDs and keywords.
 * @param {Object} parsed { genres: [], keywords: [] }
 * @returns {Promise<Array>} list of movie objects
 */
const fetchTMDbResults = async (parsed) => {
  const { genres } = parsed;

  const genreIds = genres
    .map((g) => GENRE_MAP[g.trim()])
    .filter(Boolean)
    .join(',');

  const url = `${TMDB_BASE}/discover/movie`;
  const params = {
    api_key: TMDB_API_KEY,
    language: 'en-US',
    sort_by: 'popularity.desc',
    include_adult: false,
    with_genres: genreIds,
    page: 1,
  };

  try {
    const res = await axios.get(url, { params });
    return res.data.results.slice(0, 10); // Return top 10
  } catch (err) {
    console.error('TMDb fetch error:', err.message);
    return [];
  }
};


module.exports = { fetchTMDbResults };
