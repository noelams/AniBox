// routes/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const bucket = require("../firebase");
const User = require("../models/User"); // 👈 Import the user model

const router = express.Router();

// Multer config
const upload = multer({ storage: multer.memoryStorage() });

// Upload image and save URL to user profile
router.post(
  "/upload-profile",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const userId = req.body.userId;
      if (!userId || !req.file) {
        return res.status(400).json({ error: "Missing userId or image" });
      }

      const fileName = `profileImages/${uuidv4()}${path.extname(
        req.file.originalname
      )}`;
      const file = bucket.file(fileName);

      const stream = file.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      stream.on("error", (err) => {
        console.error("Upload Error:", err);
        res.status(500).json({ error: "Upload failed" });
      });

      stream.on("finish", async () => {
        await file.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

        // 🔗 Save URL to MongoDB user
        await User.findByIdAndUpdate(userId, { profileImage: publicUrl });

        res
          .status(200)
          .json({ message: "Profile image updated", imageUrl: publicUrl });
      });

      stream.end(req.file.buffer);
    } catch (err) {
      console.error("Unexpected Error:", err);
      res.status(500).json({ error: "Unexpected error occurred" });
    }
  }
);

module.exports = router;
