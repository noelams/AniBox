const mongoose = require("mongoose");

const animeLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  animeId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["watched", "watching", "want to watch"],
    required: true,
  },
  review: {
    type: String,
    default: "",
  },
  score: {
    type: Number,
    min: 1,
    max: 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AnimeLog", animeLogSchema);
