const axios = require("axios");
const Movie = require("../models/Movie");
require("dotenv").config();

const TMDB_API = process.env.TMDB_API_KEY;

exports.searchMovies = async (req, res) => {
    const query = req.query.q || req.query.query;

    try {
        const {data} = await axios.get(
            `https://api.themoviedb.org/3/search/movie`,
            {
                params: {
                    api_key: TMDB_API,
                    query,
                },
            }
        );
        res.json(data.results);
    } catch (err) {
        res.status(500).json({message: "Search failed", error: err.message});
    }
};

exports.getMovieDetail = async (req, res) => {
    const id = req.params.id;

    if (!id || id === "undefined" || typeof id !== "string") {
        return res.status(400).json({message: "Invalid movie ID"});
    }

    try {
        let movie = await Movie.findOne({tmdbId: id});
        if (movie) {
            movie.lastAccessed = new Date();
            await movie.save();
            return res.json(movie);
        }

        const [detailRes, videoRes, creditRes] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
                params: {api_key: TMDB_API},
            }),
            axios.get(`https://api.themoviedb.org/3/movie/${id}/videos`, {
                params: {api_key: TMDB_API},
            }),
            axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
                params: {api_key: TMDB_API},
            }),
        ]);

        const detail = detailRes.data;
        const videos = videoRes.data.results || [];
        const credits = creditRes.data.cast || [];

        const trailer = videos.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
        );

        const movieData = {
            tmdbId: id,
            title: detail.title || "Unknown Title",
            overview: detail.overview || "No overview available.",
            poster: detail.poster_path || "",
            backdrop: detail.backdrop_path || "",
            trailerUrl: trailer
                ? `https://youtube.com/watch?v=${trailer.key}`
                : "",
            genres: (detail.genres || []).map((g) => g.name),
            releaseDate: detail.release_date || "",
            cast: credits.slice(0, 5).map((c) => c.name),
        };

        try {
            await Movie.create(movieData);
        } catch (err) {
            console.warn("Failed to cache movie:", err.message);
        }

        res.json(movieData);
    } catch (err) {
        console.error("getMovieDetail error:", err.message);
        res.status(500).json({
            message: "Failed to load movie details",
            error: err.message,
        });
    }
};
