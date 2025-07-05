const express = require("express");
const router = express.Router();
const AnimeLog = require("../models/AnimeLog");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, async (req, res) => {
  const { animeId, status, review, score } = req.body;

  if (!animeId || !status) {
    return res.status(400).json({ message: "animeId and status are required" });
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
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/", verifyToken, async (req, res) => {
  const userId = req.user._id;
  const { status, animeId, year, limit, sort } = req.query;

  try {
    const query = { userId };

    if (status) query.status = status;
    if (animeId) query.animeId = animeId;
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

    res.status(200).json(logs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching logs", error: err.message });
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
        .json({ message: "Log not found or not authorized" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({
      mesage: "Error updating log",
      error: err.message,
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
        .json({ message: "Log not found or not authorized" });

    res.json({ message: "Anime log deleted", deleted });
  } catch (err) {
    res.status(500).json({ message: "Error deleting log", error: err.message });
  }
});

module.exports = router;
