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
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  // ✅ Fetch issue by ID
  useEffect(() => {
    const fetchIssue = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(`${API_URL}/issues/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const issueData = res.data.issue;
        setIssue(issueData);

        const userId = JSON.parse(atob(token.split(".")[1]))._id;
        setUpvoted(issueData.upvotes.includes(userId));
        setDownvoted(issueData.downvotes.includes(userId));
      } catch (err) {
        handleError("Failed to load issue details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [API_URL, id, navigate]);

  // 🗳️ Handle Upvote
  const handleUpvote = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleError("Please login to vote");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.patch(`${API_URL}/issues/${id}/upvote`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssue(res.data.issue);
      setUpvoted(res.data.issue.upvotes.includes(JSON.parse(atob(token.split(".")[1]))._id));
      setDownvoted(res.data.issue.downvotes.includes(JSON.parse(atob(token.split(".")[1]))._id));
      handleSuccess("Vote updated!");
    } catch (err) {
      handleError("Error updating vote");
      console.error(err);
    }
  };

  // 🗳️ Handle Downvote
  const handleDownvote = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleError("Please login to vote");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.patch(`${API_URL}/issues/${id}/downvote`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssue(res.data.issue);
      setUpvoted(res.data.issue.upvotes.includes(JSON.parse(atob(token.split(".")[1]))._id));
      setDownvoted(res.data.issue.downvotes.includes(JSON.parse(atob(token.split(".")[1]))._id));
      handleSuccess("Vote updated!");
    } catch (err) {
      handleError("Error updating vote");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 text-lg">
        Loading issue details...
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400 text-lg">
        Issue not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#181818] to-[#111111] text-white px-6 pt-24 pb-16">
      {/* 🔙 Back button */}
      <button
        onClick={() => navigate("/home")}
        className="text-[#b387f5] underline mb-6 hover:text-[#a173e0] transition-all duration-200"
      >
        ← Back to Issues
      </button>

      {/* 📰 Issue Card */}
      <div className="max-w-4xl mx-auto bg-[#1f1f1f]/90 rounded-3xl border border-[#b387f5]/30 shadow-xl shadow-[#b387f5]/10 p-8 backdrop-blur-sm">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-[#b387f5] mb-3 leading-tight">
          {issue.title}
        </h1>

        <p className="text-gray-400 text-sm mb-6">
          Posted by{" "}
          <span className="text-[#b387f5] font-medium">{issue.user?.name}</span>{" "}
          •{" "}
          {new Date(issue.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        {/* Image */}
        {issue.imageUrl && (
          <div className="overflow-hidden rounded-xl mb-6 border border-[#b387f5]/20">
            <img
              src={issue.imageUrl}
              alt={issue.title}
              className="w-full h-[350px] object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* Description */}
        <p className="text-gray-200 leading-relaxed text-lg mb-8 tracking-wide">
          {issue.description}
        </p>

        {/* 🗺️ Google Map with Pin + Directions */}
        {issue.location?.lat && issue.location?.lng && (
          <div className="rounded-xl overflow-hidden border border-[#b387f5]/30 shadow-md shadow-[#b387f5]/10 mb-8">
            <iframe
              title="map"
              width="100%"
              height="320"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/place?key=${
                import.meta.env.VITE_GOOGLE_MAPS_API_KEY
              }&q=${issue.location.lat},${issue.location.lng}&zoom=15`}
            ></iframe>

            <div className="flex justify-center py-4 bg-[#1c1c1c]">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${issue.location.lat},${issue.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#b387f5] hover:bg-[#a173e0] text-white px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg hover:shadow-[#b387f5]/30 transition-all duration-300"
              >
                📍 Get Directions
              </a>
            </div>
          </div>
        )}

        {/* 🗳️ Upvote/Downvote Buttons */}
        <div className="flex gap-6 justify-center mt-6">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold text-lg transition-all duration-300 ${
              upvoted
                ? "bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/30"
                : "bg-[#2a2a2a] hover:bg-green-700 text-gray-200"
            }`}
          >
            👍 {issue.upvotes.length}
          </button>

          <button
            onClick={handleDownvote}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold text-lg transition-all duration-300 ${
              downvoted
                ? "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/30"
                : "bg-[#2a2a2a] hover:bg-red-700 text-gray-200"
            }`}
          >
            👎 {issue.downvotes.length}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
