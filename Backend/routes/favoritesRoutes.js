const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const Favorite = require("../models/Favorites");

router.post("/", verifyToken, async (req, res) => {
  const { animeId } = req.body;
  const Favorites = await Favorite.find({ userId: req.user._id, animeId });
  if (Favorites.length > 0) {
    return res
      .status(400)
      .json({ message: "Anime already in favorites", ok: false });
  }
  const userId = req.user.id;
  if (!animeId) {
    return res.status(400).json({ message: "animeId required", ok: false });
  }

  try {
    const favorite = new Favorite({
      userId,
      animeId,
    });
    const savedFavorite = await favorite.save();
    res.status(200).json({ savedFavorite, ok: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: err.message, ok: false });
  }
});

router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { limit, animeId } = req.query;
  try {
    let query = Favorite.find({ userId });
    if (animeId) {
      query = query.where({ animeId });
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const favorites = await query;

    res.status(200).json({ favorites, ok: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: err.message, ok: false });
  }
});

router.delete("/:animeId", verifyToken, async (req, res) => {
  try {
    const deleted = await Favorite.findOneAndDelete({
      animeId: req.params.animeId,
      userId: req.user._id,
    });

    if (!deleted)
      return res
        .status(404)
        .json({ message: "Log not found or not authorized", ok: false });

    res.json({ message: "Favorite removed", deleted, ok: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting log", error: err.message, ok: false });
  }
});

module.exports = router;
