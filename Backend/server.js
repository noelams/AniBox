const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const animeLogRoutes = require("./routes/animeLogRoutes");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
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

app.use("/api/auth", authRoutes);
app.use("/api/anime-log", animeLogRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

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
