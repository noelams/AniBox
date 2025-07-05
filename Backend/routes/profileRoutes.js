const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const AnimeLog = require("../models/AnimeLog");
const Favorite = require("../models/Favorite");

router.get("/profile", verifyToken, async (req, res) => {
  const userId = req.user._id;
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(`${currentYear}-01-01`);
  const startOfNextYear = new Date(`${currentYear + 1}-01-01`);

  try {
    const [
      watchlist,
      totalWatched,
      watchedThisYear,
      favorites,
      recentFavorites,
    ] = await Promise.all([
      AnimeLog.find({ userId, status: "want to watch" }),
      AnimeLog.find({ userId, status: "watched" }),
      AnimeLog.find({
        userId,
        status: "watched",
        createdAt: { $gte: startOfYear, $lt: startOfNextYear },
      }),
      Favorite.find({ userId }),
      Favorite.find({ userId }).sort({ addedAt: -1 }).limit(4),
    ]);

    res.status(200).json({
      watchlistCount: watchlist.length,
      totalWatchedCount: totalWatched.length,
      watchedThisYearCount: watchedThisYear.length,
      favoritesCount: favorites.length,
      recentFavorites: recentFavorites,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load profile stats", error: err.message });
  }
});

module.exports = router;
