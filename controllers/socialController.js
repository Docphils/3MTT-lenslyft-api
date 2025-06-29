// controllers/socialController.js
const User = require('../models/User');

exports.toggleFollow = async (req, res) => {
  const userId = req.user.id;
  const targetId = req.params.targetId;

  if (userId === targetId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  const user = await User.findById(userId);
  const targetUser = await User.findById(targetId);

  if (!targetUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const isFollowing = user.following.includes(targetId);

  if (isFollowing) {
    user.following.pull(targetId);
    targetUser.followers.pull(userId);
  } else {
    user.following.addToSet(targetId);
    targetUser.followers.addToSet(userId);
  }

  await user.save();
  await targetUser.save();

  res.json({
    following: user.following,
    followers: user.followers,
  });
};
