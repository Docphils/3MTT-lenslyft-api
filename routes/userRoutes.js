const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require('../middleware/upload');
const {
    getProfile,
    toggleFavorite,
    manageWatchlist,
    addMovieToWatchlist,
    getUserById,
    getRecommendations,
    getAllUsers,
    getUserPublicProfile,
    updateProfile,
    uploadProfileImage,
} = require("../controllers/userController");

router.get("/profile", protect, getProfile);
router.post("/favorites/:movieId", protect, toggleFavorite);
router.post("/watchlists", protect, manageWatchlist);
router.get("/recommendations", protect, getRecommendations);
router.get("/all", protect, getAllUsers);
router.get("/:id", protect, getUserById);

router.post("/watchlists/add/:movieId", protect, addMovieToWatchlist);
router.get("/:id", protect, getUserPublicProfile);
router.put("/profile", protect, updateProfile);
router.post('/profile/upload', protect, upload.single('image'), uploadProfileImage);


module.exports = router;
