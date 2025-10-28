import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../../utils/utils";
import axios from "axios";
import './signup.css';

const Signup = () => {

  const API_URL = import.meta.env.VITE_API_URL;
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    })
    const navigate = useNavigate();

    const handleChange = (e)=>{
        const {name, value} = e.target;
        console.log(name,value);
        const copySignupInfo = {...signupInfo};
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    }

    const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;

    if (!name || !email || !password) {
        return handleError('All fields are required');
    }

    try {
        const url = `${API_URL}/user/signup`;
        const response = await axios.post(url, signupInfo);
        const result = response.data;

        const { message, success, error } = result;
        if (success) {
            handleSuccess(message);
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } else {
            const joiMessage = error?.details?.[0]?.message;
            handleError(joiMessage || message || 'Signup failed');
        }

    } catch (err) {
        // ✅ handle Axios errors correctly
        if (err.response && err.response.data) {
            const { error, message } = err.response.data;
            const joiMessage = error?.details?.[0]?.message;
            handleError(joiMessage || message || 'Signup failed');
        } else {
            handleError(err.message || 'Something went wrong');
        }
    }
};


  return (
<div className="min-h-screen flex items-center justify-center bg-[#181818] text-white px-4 pt-20">
  <div className="w-full max-w-md bg-[#1f1f1f] rounded-2xl shadow-xl border border-[#b387f5]/30 p-8">
    <h1 className="text-3xl font-bold text-center mb-6 text-[#b387f5]">Signup</h1>

    <form onSubmit={handleSignup} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm mb-2">
          Name
        </label>
        <input
          onChange={handleChange}
          type="text"
          name="name"
          autoFocus
          placeholder="Enter your name"
          value={signupInfo.name}
          className="bubble-input w-full bg-transparent border border-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:border-[#b387f5] transition-all"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm mb-2">
          Email
        </label>
        <input
          onChange={handleChange}
          type="email"
          name="email"
          placeholder="Enter your email"
          value={signupInfo.email}
          className="bubble-input w-full bg-transparent border border-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:border-[#b387f5] transition-all"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm mb-2">
          Password
        </label>
        <input
          onChange={handleChange}
          type="password"
          name="password"
          placeholder="Enter your password"
          value={signupInfo.password}
          className="bubble-input w-full bg-transparent border border-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:border-[#b387f5] transition-all"
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-[#b387f5] text-black font-semibold hover:bg-[#a173e0] transition-all shadow-md"
      >
        Signup
      </button>

      {/* Redirect */}
      <p className="text-sm text-center text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-[#b387f5] font-medium hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  </div>
</div>

  )
}

export default Signup
