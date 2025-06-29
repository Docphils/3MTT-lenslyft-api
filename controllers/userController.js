const User = require("../models/User");
const {getRecommendations: engine} = require("../utils/recommendationEngine");
const bcrypt = require("bcryptjs");

exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select("-passwordHash");
    res.json(user);
};

exports.toggleFavorite = async (req, res) => {
    const movieId = req.params.movieId;
    const user = await User.findById(req.user.id);

    const index = user.favorites.indexOf(movieId);
    if (index > -1) {
        user.favorites.splice(index, 1);
    } else {
        user.favorites.push(movieId);
    }

    await user.save();
    res.json({favorites: user.favorites});
};

exports.manageWatchlist = async (req, res) => {
    const {name, description, movies = []} = req.body;
    const user = await User.findById(req.user.id);

    const existing = user.watchlists.find((w) => w.name === name);
    if (existing) {
        existing.movies = movies;
        existing.description = description;
    } else {
        user.watchlists.push({name, description, movies});
    }

    await user.save();
    res.json(user.watchlists);
};

exports.getRecommendations = async (req, res) => {
    try {
        const movies = await engine(req.user.id);
        res.json(movies);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch recommendations",
            error: err.message,
        });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({_id: {$ne: req.user.id}}).select(
            "_id username bio"
        );
        res.json(users);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch users",
            error: err.message,
        });
    }
};

exports.addMovieToWatchlist = async (req, res) => {
    const {movieId} = req.params;
    const {listName} = req.body;

    if (!movieId || !listName) {
        return res
            .status(400)
            .json({message: "Movie ID and list name required"});
    }

    const user = await User.findById(req.user.id);

    const list = user.watchlists.find((wl) => wl.name === listName);
    if (!list) return res.status(404).json({message: "Watchlist not found"});

    if (!list.movies.includes(movieId)) {
        list.movies.push(movieId);
        await user.save();
        return res.status(200).json({message: "Movie added", watchlist: list});
    } else {
        return res.status(200).json({message: "Movie already in watchlist"});
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("_id username bio favorites watchlists")
            .lean();

        if (!user) return res.status(404).json({message: "User not found"});

        res.json(user);
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }
};

// GET /users/:id → Public profile
exports.getUserPublicProfile = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId)
            .select("_id username bio profileImage favorites watchlists")
            .lean();

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // Try to get preview movie from their last favorite or last watchlist
        const previewMovieId =
            user.favorites?.slice(-1)[0] ||
            user.watchlists?.slice(-1)[0]?.movies?.slice(-1)[0];

        if (previewMovieId) {
            const cachedMovie = await Movie.findOne({
                tmdbId: previewMovieId,
            }).lean();
            if (cachedMovie && cachedMovie.poster) {
                user.previewPoster = cachedMovie.poster;
            }
        }

        res.json(user);
    } catch (err) {
        console.error("Error fetching user public profile:", err.message);
        res.status(500).json({
            message: "Error fetching user",
            error: err.message,
        });
    }
};

exports.updateProfile = async (req, res) => {
    const {username, email, bio, profileImage, password} = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (username) user.username = username;
        if (email) user.email = email;
        if (bio !== undefined) user.bio = bio;
        if (profileImage !== undefined) user.profileImage = profileImage;

        if (password) {
            if (password.length < 6) {
                return res
                    .status(400)
                    .json({message: "Password must be at least 6 characters"});
            }
            user.passwordHash = await bcrypt.hash(password, 12);
        }

        await user.save();

        const updatedUser = await User.findById(user._id).select(
            "-passwordHash"
        );
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({
            message: "Failed to update profile",
            error: err.message,
        });
    }
};

exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file || !req.file.path) {
            return res.status(400).json({message: "No image provided"});
        }

        const user = await User.findById(req.user.id);
        user.profileImage = req.file.path; // cloudinary URL
        await user.save();

        const updated = await User.findById(req.user.id).select(
            "-passwordHash"
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({
            message: "Failed to upload image",
            error: err.message,
        });
    }
};
