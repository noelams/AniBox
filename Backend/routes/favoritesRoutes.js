const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const Favorite = require("../models/Favorite");

router.post("/", verifyToken, async (req, res) => {
  const { animeId } = req.body;
  const userId = req.user.id;
  if (!animeId) {
    return res.status(400).json({ message: "animeId required" });
  }
  try {
    const favorite = new Favorite({
      userId,
      animeId,
      addedAt,
    });
    const savedFavorite = await favorite.save();
    res.status(200).json(savedFavorite);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
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

    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
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
        .json({ message: "Log not found or not authorized" });

    res.json({ message: "Favorite removed", deleted });
  } catch (err) {
    res.status(500).json({ message: "Error deleting log", error: err.message });
  }
});

module.exports = router;
