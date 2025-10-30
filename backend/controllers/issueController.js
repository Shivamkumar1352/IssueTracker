const Issue = require('../models/issue');

const createIssue = async (req, res) => {
  try {
    const issue = new Issue({
      user: req.user._id, // from protect middleware
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
};

const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate("user", "name email"); // optional populate
    res.status(200).json({ success: true, count: issues.length, issues });
  } catch (err) {
    console.error("Error fetching issues:", err);
    res.status(500).json({ error: err.message });
  }
};

const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate("user", "name email");
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.status(200).json({ issue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const upvoteIssue = async (req, res) => {
  try {
    const userId = req.user._id;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    const hasUpvoted = issue.upvotes.includes(userId);
    const hasDownvoted = issue.downvotes.includes(userId);

    if (hasUpvoted) {
      // 🟡 Remove upvote
      issue.upvotes.pull(userId);
    } else {
      // 🟢 Add upvote
      issue.upvotes.push(userId);
      // 🔴 Remove downvote if previously downvoted
      if (hasDownvoted) issue.downvotes.pull(userId);
    }

    await issue.save();
    res.status(200).json({ success: true, message: "Vote updated", issue });
  } catch (err) {
    console.error("Error updating upvote:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Downvote Issue (toggle)
const downvoteIssue = async (req, res) => {
  try {
    const userId = req.user._id;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    const hasUpvoted = issue.upvotes.includes(userId);
    const hasDownvoted = issue.downvotes.includes(userId);

    if (hasDownvoted) {
      // 🟡 Remove downvote
      issue.downvotes.pull(userId);
    } else {
      // 🔴 Add downvote
      issue.downvotes.push(userId);
      // 🟢 Remove upvote if previously upvoted
      if (hasUpvoted) issue.upvotes.pull(userId);
    }

    await issue.save();
    res.status(200).json({ success: true, message: "Vote updated", issue });
  } catch (err) {
    console.error("Error updating downvote:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};



module.exports = { createIssue, getAllIssues, getIssueById, upvoteIssue, downvoteIssue };