const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");
require("dotenv").config();

const router = require("express").Router();

cloudinary.config({
  cloud_name: "dxo6mbjkc",
  api_key: "443218383167334",
  api_secret: "yZXqLOHjR0fUGyqdjcjh13A7v_4",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profileImages",
    allowed_formats: ["jpg, jpeg, png"],
  },
});

const upload = multer({ storage });

router.post(
  "/upload-profile",
  verifyToken,
  upload.single("image"),
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
        imageUrl: req.file.path,
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

module.exports = router;
