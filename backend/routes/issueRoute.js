const express = require("express");
const router = express.Router();
const {
  createIssue,
  getAllIssues,
  getIssueById,
  upvoteIssue,
  downvoteIssue,
  addComment,        
  updateIssueStatus,
  deleteIssue,
} = require("../controllers/issueController");
const { protect } = require("../middlewares/auth");

// 🟢 Create issue
router.post("/", protect, createIssue);

// 🟡 Get all issues
router.get("/", getAllIssues);

// 🔵 Get single issue by ID
router.get("/:id", protect, getIssueById);

//delete
router.delete("/:id", protect, deleteIssue);

// 👍 Upvote
router.patch("/:id/upvote", protect, upvoteIssue);

// 👎 Downvote
router.patch("/:id/downvote", protect, downvoteIssue);

// 💬 Add comment
router.post("/:id/comment", protect, addComment); // 👈 NEW COMMENT ROUTE

// 🧩 Admin: Update status
router.patch("/:id/status", protect, updateIssueStatus); // Optional

module.exports = router;
