const express = require("express");
const router = express.Router();
const Issue = require("../models/issue");
const cloudinary = require("../config/cloudinary");
const { authenticate, authorize, protect } = require("../middlewares/auth");

router.post("/", protect, async (req, res) => {
  try {
    const issue = new Issue({
      user: req.user._id, // auto from token
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      location: req.body.location,
    });
    await issue.save();
    res.status(201).json({ message: "Issue created successfully", issue });
  } catch (err) {
    console.error("Error creating issue:", err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;