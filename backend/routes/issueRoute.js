const express = require("express");
const router = express.Router();
const { createIssue, getAllIssues, getIssueById, upvoteIssue, downvoteIssue} = require("../controllers/issueController");
const { protect } = require("../middlewares/auth");


router.post("/", protect, createIssue);

router.get("/", getAllIssues);

router.get("/:id", protect, getIssueById);

router.patch("/:id/upvote", protect, upvoteIssue);

router.patch("/:id/downvote", protect, downvoteIssue);

module.exports = router;
