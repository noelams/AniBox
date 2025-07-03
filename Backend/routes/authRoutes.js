const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

router.get("/", verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

const { registerUser, loginUser } = require("../controller/authController");

router.post("/signup", registerUser);

router.post("/login", loginUser);

router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
