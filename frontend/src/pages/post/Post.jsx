import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostIssue = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState({ lat: null, lng: null });

  const API_URL = import.meta.env.VITE_API_URL;
  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // 🧭 Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });

        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
              import.meta.env.VITE_GOOGLE_MAPS_API_KEY
            }`
          );
          const address =
            response.data.results[0]?.formatted_address || "Unknown location";
          setLocation(address);
        } catch (err) {
          console.error("Error getting address:", err);
        }
      });
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // 🖼️ Handle photo selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview("");
    }
  };

  // 🚀 Submit issue
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !photo) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again!");
        return;
      }

      // ⛅ Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", photo);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const cloudinaryRes = await axios.post(CLOUDINARY_URL, formData);
      const imageUrl = cloudinaryRes.data.secure_url;

      // 📝 Create issue object
      const issueData = {
        title,
        description,
        imageUrl,
        location: {
          lat: coords.lat,
          lng: coords.lng,
          address: location,
        },
      };

      // 🚀 Post issue to backend
      await axios.post(`${API_URL}/issues`, issueData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Issue posted successfully!");
      setTitle("");
      setDescription("");
      setPhoto(null);
      setPreview("");
    } catch (err) {
      console.error("Error posting issue:", err.response?.data || err.message);
      toast.error("Error posting issue");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181818] text-white px-4 pt-20">
      <div className="w-full max-w-md bg-[#1f1f1f] rounded-2xl shadow-xl border border-[#b387f5]/30 p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#b387f5]">
          Post a Local Issue
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm mb-2">
              Issue Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter issue title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bubble-input w-full bg-transparent border border-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:border-[#b387f5] transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm mb-2">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bubble-input w-full bg-transparent border border-gray-500 rounded-lg px-4 py-2 h-28 focus:outline-none focus:border-[#b387f5] transition-all resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="photo" className="block text-sm mb-2">
              Upload Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#b387f5] file:text-black hover:file:bg-[#a173e0] transition-all"
            />
          </div>

          {/* Preview */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg border border-[#b387f5]/40"
            />
          )}

          {/* Location */}
          <div className="text-sm text-gray-300 bg-[#2a2a2a] p-3 rounded-lg border border-gray-600">
            <strong className="text-[#b387f5]">📍 Location:</strong>{" "}
            {location ? location : "Fetching your location..."}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#b387f5] text-black font-semibold hover:bg-[#a173e0] transition-all shadow-md"
          >
            Submit Issue
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default PostIssue;
