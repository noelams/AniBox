const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

const router = require("express").Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer disk storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Upload endpoint
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

      const filePath = `/uploads/${req.file.filename}`;

      await User.findByIdAndUpdate(userId, {
        profileImage: filePath,
      });

      res.status(200).json({
        message: "Profile image uploaded",
        imageUrl: filePath,
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

module.exports = router;
