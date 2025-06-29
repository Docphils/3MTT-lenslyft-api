const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// POST /api/auth/register
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  console.log("Register request:", req.body); // ✅ Debug

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: "Username too short" });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      passwordHash: hashed,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({
      message: "Registration failed",
      error: err.message,
    });
  }
};


// POST /api/auth/login
exports.loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if (!user)
            return res.status(400).json({message: "Invalid credentials"});

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch)
            return res.status(400).json({message: "Invalid credentials"});

        const token = generateToken(user._id);

        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
        });
    } catch (err) {
        res.status(500).json({message: "Login failed", error: err.message});
    }
};
