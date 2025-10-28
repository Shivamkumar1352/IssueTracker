import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../../utils/utils";
import axios from "axios";
import './login.css';
const Login = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate();

    const handleChange = (e)=>{
        const {name, value} = e.target;
        // console.log(name,value);
        const copyLoginInfo = {...loginInfo};
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
    e.preventDefault();
    const {email, password } = loginInfo;

    if (!email || !password) {
        return handleError('All fields are required');
    }

    try {
        const url = `${API_URL}/user/login`;
        const response = await axios.post(url, loginInfo);
        const result = response.data;
        console.log(result);
        const { message, success, jwtToken, name, user, error } = result;
        if (success) {
            handleSuccess(message);
            localStorage.setItem('token', jwtToken);
            localStorage.setItem('loggedInUser', name);
            localStorage.setItem('user', user._id); 
            
            setTimeout(() => {
                navigate('/home');
            }, 1000);
        } else {
            const joiMessage = error?.details?.[0]?.message;
            handleError(joiMessage || message || 'Login failed');
        }

    } catch (err) {
        // ✅ handle Axios errors correctly
        if (err.response && err.response.data) {
            const { error, message } = err.response.data;
            const joiMessage = error?.details?.[0]?.message;
            handleError(joiMessage || message || 'Login failed');
        } else {
            handleError(err.message || 'Something went wrong');
        }
    }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181818] text-white px-4 pt-20">
      <div className="w-full max-w-md bg-[#1f1f1f] rounded-2xl shadow-xl border border-[#b387f5]/30 p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#b387f5]">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
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
              value={loginInfo.email}
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
              value={loginInfo.password}
              className="bubble-input w-full bg-transparent border border-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:border-[#b387f5] transition-all"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#b387f5] text-black font-semibold hover:bg-[#a173e0] transition-all shadow-md"
          >
            Login
          </button>

          {/* Redirect */}
          <p className="text-sm text-center text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#b387f5] font-medium hover:underline"
            >
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login