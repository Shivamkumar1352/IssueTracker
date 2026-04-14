import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../utils/utils";

const PostIssue = () => {
  const navigate = useNavigate();
  const [title, setTitle]         = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto]         = useState(null);
  const [preview, setPreview]     = useState("");
  const [address, setAddress]     = useState("");
  const [coords, setCoords]       = useState({ lat: null, lng: null });
  const [category, setCategory]   = useState("Other");
  const [severity, setSeverity]   = useState("Low");

  const API_URL                  = import.meta.env.VITE_API_URL;
  const CLOUDINARY_URL           = import.meta.env.VITE_CLOUDINARY_URL;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        try {
          const res = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
          );
          const result = res.data.results[0];
          const formattedAddress = result?.formatted_address || "Unknown location";
          const addressComponents = result?.address_components || [];
          const getPart = (type) =>
            addressComponents.find((c) => c.types.includes(type))?.long_name || "";
          setAddress(formattedAddress);
          setCoords((prev) => ({
            ...prev,
            city:    getPart("locality"),
            state:   getPart("administrative_area_level_1"),
            country: getPart("country"),
          }));
        } catch {
          handleError("Failed to fetch address");
        }
      });
    }
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !photo) {
      handleError("All fields are required!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) return handleError("Unauthorized. Please log in.");

      const formData = new FormData();
      formData.append("file", photo);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const uploadRes = await axios.post(CLOUDINARY_URL, formData);
      const imageUrl  = uploadRes.data.secure_url;

      await axios.post(
        `${API_URL}/issues`,
        { title, description, imageUrl, category, severity,
          location: { lat: coords.lat, lng: coords.lng, address, city: coords.city, state: coords.state, country: coords.country } },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      handleSuccess("Issue created successfully!");
      setTimeout(() => navigate("/home"), 1200);
    } catch (err) {
      handleError(err.response?.data?.message || "Failed to create issue");
    }
  };

  const inputStyle = {
    background: "var(--bg-elevated)",
    border: "1px solid var(--border-medium)",
    color: "var(--text-primary)",
  };
  const focusIn  = (e) => e.target.style.borderColor = "var(--saffron)";
  const focusOut = (e) => e.target.style.borderColor = "var(--border-medium)";

  const severityColors = {
    Low: "var(--teal-lt)", Medium: "var(--gold-lt)", High: "var(--saffron-lt)", Critical: "var(--crimson-lt)",
  };

  return (
    <div
      className="min-h-screen flex justify-center items-start px-4 pt-24 pb-12"
      style={{ background: "var(--bg-base)" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-8 relative overflow-hidden"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-medium)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* Tricolor top bar */}
        <div className="tricolor-bar absolute top-0 left-0 right-0" />

        {/* Heading */}
        <div className="text-center mb-7 mt-2">
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--saffron-lt)" }}
          >
            Post a Local Issue
          </h2>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            समस्या दर्ज करें — Report a civic problem
          </p>
          <div className="kolam-divider w-24 mx-auto mt-3" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <input
            type="text"
            placeholder="Issue Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none"
            style={inputStyle}
            onFocus={focusIn} onBlur={focusOut}
          />

          {/* Description */}
          <textarea
            placeholder="Describe the issue…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 text-sm h-28 resize-none focus:outline-none"
            style={inputStyle}
            onFocus={focusIn} onBlur={focusOut}
          />

          {/* Category & Severity row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={inputStyle}
                onFocus={focusIn} onBlur={focusOut}
              >
                {["Road","Electricity","Water","Garbage","Public Safety","Other"].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={inputStyle}
                onFocus={focusIn} onBlur={focusOut}
              >
                {["Low","Medium","High","Critical"].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              {/* colour indicator */}
              <div
                className="h-0.5 rounded mt-1.5 transition-all"
                style={{ background: severityColors[severity], opacity: 0.8 }}
              />
            </div>
          </div>

          {/* Photo upload */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full rounded-lg px-4 py-2 text-sm"
              style={{
                ...inputStyle,
              }}
            />
          </div>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-52 rounded-xl object-cover"
              style={{ border: "1px solid var(--border-medium)" }}
            />
          )}

          {/* Location */}
          <p
            className="text-xs rounded-lg px-4 py-2.5"
            style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}
          >
            📍 {address || "Fetching your location…"}
          </p>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-85"
            style={{
              background: "var(--saffron)",
              color: "#FFF5E8",
              boxShadow: "var(--shadow-glow-saffron)",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.5px",
            }}
          >
            Submit Issue
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostIssue;

