const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const AnimeLog = require("../models/AnimeLog");
const Favorites = require("../models/Favorites");

router.get("/", verifyToken, async (req, res) => {
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
      Favorites.find({ userId }),
      Favorites.find({ userId }).sort({ addedAt: -1 }).limit(4),
    ]);

    res.status(200).json({
      watchlistCount: watchlist.length,
      totalWatchedCount: totalWatched.length,
      watchedThisYearCount: watchedThisYear.length,
      favoritesCount: favorites.length,
      favorites: favorites,
      recentFavorites: recentFavorites,
      _id: userId,
      profileImage: req.user.profileImage,
      coverImage: req.user.coverImage,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load profile stats", error: err.message });
  }
});

module.exports = router;

data = {
  _id: "68641e31b9abd2c44eddad43",
  coverImage:
    "https://res.cloudinary.com/dxo6mbjkc/image/upload/v1752759601/profileImages/wtr06hxudrrzlduejd9f.jpg",
  favorites: [
    {
      __v: 0,
      _id: "689e244fba29df8a69ff6fc5",
      addedAt: "2025-08-14T18:00:47.492Z",
      animeId: "21",
      userId: "68641e31b9abd2c44eddad43",
    },
    {
      __v: 0,
      _id: "68aeb384b6b327699033496e",
      addedAt: "2025-08-27T07:28:11.375Z",
      animeId: "52807",
      userId: "68641e31b9abd2c44eddad43",
    },
  ],
  favoritesCount: 2,
  profileImage:
    "https://res.cloudinary.com/dxo6mbjkc/image/upload/v1752753401/profileImages/wilduvlodlzknl19vdch.jpg",
  recentFavorites: [
    {
      __v: 0,
      _id: "68aeb384b6b327699033496e",
      addedAt: "2025-08-27T07:28:11.375Z",
      animeId: "52807",
      userId: "68641e31b9abd2c44eddad43",
    },
    {
      __v: 0,
      _id: "689e244fba29df8a69ff6fc5",
      addedAt: "2025-08-14T18:00:47.492Z",
      animeId: "21",
      userId: "68641e31b9abd2c44eddad43",
    },
  ],
  totalWatchedCount: 0,
  watchedThisYearCount: 0,
  watchlistCount: 14,
};
