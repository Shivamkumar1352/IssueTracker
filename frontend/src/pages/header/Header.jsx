import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './Header.css'; 
import { handleSuccess } from "../../utils/utils";



const navLinks = [
  { name: "Home", path: "/home" },
  { name: "Post", path: "/post" },
];

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    handleSuccess("Logged out successfully! 👋");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <>
      <header className="fixed top-0 left-0 bg-[#1f1f1f] h-16 w-full flex items-center justify-between px-10 text-white shadow-lg z-50">
        {/* Logo */}
        <div
          className="relative group cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <h1 className="text-2xl font-semibold tracking-wide text-white transition-colors duration-300 group-hover:text-[#B387F5]">
            Issue Tracker
          </h1>
          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#B387F5] transition-all duration-500 group-hover:w-full" />
        </div>

        {/* Navigation */}
        <nav className="flex gap-4 md:gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="relative inline-flex items-center px-3 py-1 group overflow-hidden rounded-lg"
            >
              {/* hover background (behind text) */}
              <span
                aria-hidden
                className="absolute inset-0 bg-[#B387F5]/20 rounded-lg transform scale-95 group-hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
              />
              {/* link label */}
              <span className="relative z-10 text-sm md:text-base transition-colors duration-200 group-hover:text-[#B387F5]">
                {link.name}
              </span>
            </Link>
          ))}

          {/* Logout button */}
          {token && (
            <button
              onClick={handleLogout}
              className="ml-2 inline-flex items-center px-4 py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
