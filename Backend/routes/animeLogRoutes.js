const express = require("express");
const router = express.Router();
const AnimeLog = require("../models/AnimeLog");
const verifyToken = require("../middleware/authMiddleware");
const Favorite = require("../models/Favorites");

router.post("/", verifyToken, async (req, res) => {
  const { animeId, status, review, score } = req.body;
  console.log("request body:", req.body);

  if (!status) {
    return res.status(400).json({ message: "status  required", ok: false });
  }
  if (!animeId) {
    return res.status(400).json({ message: "animeId required", ok: false });
  }
  try {
    const log = new AnimeLog({
      userId: req.user._id,
      animeId,
      status,
      review,
      score,
    });
    const savedLog = await log.save();
    res.status(201).json({ savedLog, message: "Log Saved", ok: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error", error: error.message, ok: false });
  }
});

router.get("/", verifyToken, async (req, res) => {
  const userId = req.user._id;
  const { status, animeId, year, limit, sort } = req.query;

  try {
    // If animeId is provided, fetch one specific log
    if (animeId) {
      const query = { userId, animeId };

      if (status) query.status = status;

      const log = await AnimeLog.findOne(query);
      if (!log) {
        return res.status(404).json({ message: "Log not found", ok: false });
      }

      const favorite = await Favorite.findOne({ userId, animeId });

      return res.status(200).json({
        log: { ...log.toObject(), isFavorite: !!favorite },
        message: "Log fetched successfully",
        ok: true,
      });
    }

    // Else, fetch multiple logs
    const query = { userId };

    if (status) query.status = status;

    if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${parseInt(year) + 1}-01-01`);
      query.createdAt = { $gte: start, $lt: end };
    }

    let logsQuery = AnimeLog.find(query);

    if (sort === "desc") {
      logsQuery = logsQuery.sort({ createdAt: -1 });
    }

    if (limit) {
      logsQuery = logsQuery.limit(parseInt(limit));
    }

    const logs = await logsQuery;

    const favorites = await Favorite.find({ userId });
    const favoriteIds = new Set(favorites.map((f) => f.animeId));

    const logsWithFavorites = logs.map((log) => ({
      ...log.toObject(),
      isFavorite: favoriteIds.has(log.animeId),
    }));

    res.status(200).json({
      logs: logsWithFavorites,
      message: "Logs fetched successfully",
      ok: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching logs",
      error: err.message,
      ok: false,
    });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await AnimeLog.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated)
      return res
        .status(404)
        .json({ message: "Log not found or not authorized", ok: false });
    res.json({ message: "Log Updated", updated, ok: true });
  } catch (err) {
    res.status(500).json({
      message: "Error updating log",
      error: err.message,
      ok: false,
    });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await AnimeLog.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted)
      return res
        .status(404)
        .json({ message: "Log not found or not authorized", ok: false });

    res.json({ message: "Anime log deleted", deleted, ok: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting log", error: err.message, ok: false });
  }
});

module.exports = router;
