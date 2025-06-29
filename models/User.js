const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: String,
    movies: [String], // TMDb movie IDs
    createdAt: {type: Date, default: Date.now},
});

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 30,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        bio: {type: String, default: ""},
        profileImage: {type: String, default: ""},
        favorites: [String], // TMDb movie IDs
        watchlists: [watchlistSchema],
        followers: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        following: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    },
    {timestamps: true}
);

module.exports = mongoose.model("User", userSchema);
