import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleError, handleSuccess } from "../../utils/utils";

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });
  const [comment, setComment] = useState("");

  // Fetch issue by ID
  const fetchIssue = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/issues/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssue(res.data.issue);
      setVotes({
        upvotes: res.data.issue.upvotes.length,
        downvotes: res.data.issue.downvotes.length,
      });
    } catch {
      handleError("Failed to load issue details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [API_URL, id]);

  // Handle Upvote/Downvote
  const handleVote = async (type) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${API_URL}/issues/${id}/${type}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVotes({ upvotes: res.data.upvotes, downvotes: res.data.downvotes });
      handleSuccess("Vote updated!");
    } catch {
      handleError("Error updating vote");
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!comment.trim()) return handleError("Comment cannot be empty");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/issues/${id}/comment`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleSuccess("Comment added!");
      setComment("");
      setIssue((prev) => ({
        ...prev,
        comments: res.data.comments, // updated comments from backend
      }));
    } catch {
      handleError("Failed to add comment");
    }
  };

  if (loading)
    return <div className="text-center text-gray-400 mt-20">Loading...</div>;

  if (!issue)
    return <div className="text-center text-red-400 mt-20">Issue not found.</div>;

  return (
    <div className="min-h-screen bg-[#181818] text-white px-4 pt-24 pb-16">
      <button
        onClick={() => navigate("/home")}
        className="text-[#b387f5] underline mb-6 hover:text-[#a173e0]"
      >
        ← Back to Issues
      </button>

      <div className="max-w-4xl mx-auto bg-[#1f1f1f] p-8 rounded-3xl border border-[#b387f5]/30 shadow-xl">
        <h1 className="text-4xl font-bold text-[#b387f5] mb-3">{issue.title}</h1>
        <p className="text-gray-400 mb-2">
          Posted by <span className="text-[#b387f5]">{issue.user?.name}</span> •{" "}
          {new Date(issue.createdAt).toLocaleDateString()}
        </p>

        <p className="text-gray-400 mb-2">
          <span className="text-[#b387f5] font-semibold">Category:</span>{" "}
          {issue.category || "N/A"}
        </p>
        <p className="text-gray-400 mb-4">
          <span className="text-[#b387f5] font-semibold">Severity:</span>{" "}
          {issue.severity || "N/A"}
        </p>

        <img
          src={issue.imageUrl}
          alt={issue.title}
          className="w-full h-[350px] rounded-xl mb-6 border border-[#b387f5]/20 object-cover"
        />
        <p className="text-gray-200 mb-8">{issue.description}</p>

        {/* 🗺️ Map */}
        {issue.location?.lat && (
          <div className="rounded-lg overflow-hidden border border-[#b387f5]/30 mb-8">
            <iframe
              width="100%"
              height="320"
              loading="lazy"
              style={{ border: 0 }}
              src={`https://www.google.com/maps/embed/v1/place?key=${
                import.meta.env.VITE_GOOGLE_MAPS_API_KEY
              }&q=${issue.location.lat},${issue.location.lng}`}
            ></iframe>
          </div>
        )}

        {/* 👍👎 Votes */}
        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={() => handleVote("upvote")}
            className="bg-green-600 px-6 py-2 rounded-full font-semibold"
          >
            👍 {votes.upvotes}
          </button>
          <button
            onClick={() => handleVote("downvote")}
            className="bg-red-600 px-6 py-2 rounded-full font-semibold"
          >
            👎 {votes.downvotes}
          </button>
        </div>

        {/* 💬 Comments Section */}
        <div className="border-t border-[#b387f5]/20 pt-6">
          <h2 className="text-2xl font-semibold text-[#b387f5] mb-4">
            Comments
          </h2>

          {/* Add comment input */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="grow px-4 py-2 bg-transparent border border-gray-600 rounded-lg focus:border-[#b387f5]"
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-[#b387f5] text-black rounded-lg hover:bg-[#a173e0]"
            >
              Post
            </button>
          </div>

          {/* Display comments */}
          {issue.comments?.length > 0 ? (
            issue.comments.map((c, i) => (
              <div
                key={i}
                className="border-b border-gray-700 py-3 flex flex-col"
              >
                <span className="text-[#b387f5] font-semibold">
                  {c.user?.name || "Anonymous"}
                </span>
                <span className="text-gray-300 text-sm">{c.text}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
