const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
let _msc = require("multer-storage-cloudinary");
const CloudinaryStorage = _msc.CloudinaryStorage || _msc.default || _msc; // support multiple exports
const cloudinary = require("cloudinary");
const path = require("path");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");
require("dotenv").config();

const router = require("express").Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profileImages",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

router.post(
  "/upload-profile",
  verifyToken,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("Multer/Cloudinary error:", err);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const userId = req.body.userId;
      const type = req.body.profileOrCover;

      if (!userId || !req.file) {
        return res.status(400).json({ error: "Missing userId or image" });
      }

      if (type === "profile") {
        await User.findByIdAndUpdate(userId, {
          profileImage: req.file.path,
        });
      } else {
        await User.findByIdAndUpdate(userId, {
          coverImage: req.file.path,
        });
      }

      res.status(200).json({
        message: "Profile image uploaded to Cloudinary",
        imageUrl: req.file.secure_url || req.file.path,
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  },
);

module.exports = router;
