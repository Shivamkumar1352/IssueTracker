import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../utils/utils";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        // ✅ No token required for public GET
        const response = await axios.get(`${API_URL}/issues`);
        setIssues(response.data.issues || []);
      } catch (err) {
        handleError(
          err.response?.data?.message || "Failed to fetch issues. Try again."
        );
      }
    };

    fetchIssues();
  }, [API_URL]);

  const handleCardClick = (id) => {
    navigate(`/issue/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#181818] text-white px-4 pt-24">

      <h1 className="text-3xl font-bold text-center mb-10 text-[#b387f5]">
        Reported Issues
      </h1>

      {issues.length === 0 ? (
        <p className="text-center text-gray-400">No issues found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {issues.map((issue) => (
            <div
              key={issue._id}
              onClick={() => handleCardClick(issue._id)}
              className="cursor-pointer group relative bg-[#1f1f1f] border border-[#b387f5]/30 rounded-2xl overflow-hidden shadow-md hover:shadow-[#b387f5]/40 hover:scale-[1.02] transition-all duration-300"
            >
              <img
                src={issue.imageUrl || "/placeholder.jpg"}
                alt={issue.title}
                className="w-full h-48 object-cover group-hover:opacity-90 transition-all"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-[#b387f5] truncate">
                  {issue.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
