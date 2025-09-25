const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const animeLogRoutes = require("./routes/animeLogRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes");
const profileRoutes = require("./routes/profileRoutes");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Connected Successfully to MongoDB");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1); // exits the process if theDB connection fails
  }
};

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AniBox API is running...");
});

const authRoutes = require("./routes/authRoutes");
const uploadRoute = require("./routes/upload");

app.use("/api", uploadRoute);
app.use("/api/auth", authRoutes);
app.use("/api/anime-log", animeLogRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

// const path = require("path");

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//test user
// token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjM4ZTUyN2ViNTY5ZjQ1NWIyZWEyYiIsImlhdCI6MTc1MTM1NDk2MiwiZXhwIjoxNzUxOTU5NzYyfQ.7lNXY63zzIae6E62M2xKz6JMk1VG5PRi2rmoTT47Kb4

// "user": {
//   "_id": "68638e527eb569f455b2ea2b",
//   "username": "test4",
//   "email": "noel4@example.com",
//   "createdAt": "2025-07-01T07:29:22.603Z",
//   "updatedAt": "2025-07-01T07:29:22.603Z",
//   "__v": 0
// }
