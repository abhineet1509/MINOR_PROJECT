import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import registerImage from "../assets/Loginimg.jpg";
import { AppContext } from "../context/AppContext.jsx";
import { useContext } from "react";
const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");  
  const { backendUrl } = useContext(AppContext);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("❌ All fields are required!");
      return;
    }

    if (password.length < 6) {
      toast.error("❌ Password must be at least 6 characters!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("❌ Passwords do not match!");
      return;
    }

    try {
      console.log("📤 Sending:", { name, email, password });

      const response = await fetch(backendUrl +'/api/auth/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),  
      });
      
      const data = await response.json();
      console.log("📥 Server Response:", data);

      if (response.ok) {
        toast.success(" Registration successful!");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");  
      } else {
        toast.error(data.error || " Registration failed");
      }
    } catch (error) {
      toast.error("❌ Server error! Try again later.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white overflow-y-auto">
    <div className="flex-1 hidden lg:flex justify-center items-center">
      <img 
        src={registerImage} 
        alt="Register" 
        className="w-3/4 max-w-[500px] rounded-xl" 
      />
    </div>
  
    {/* Right Side - Form */}
    <div className="flex-1 flex justify-center items-start lg:items-center p-6 lg:p-10">
      <div className="w-[90%] max-w-[400px] bg-white text-center mt-10 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-4 text-left">
            <label className="font-medium block mb-1 text-gray-600">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              autoComplete="off"
              className="w-full p-1 border-b-2 border-gray-300 bg-transparent focus:border-blue-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
  
          {/* Email Input */}
          <div className="mb-4 text-left">
            <label className="font-medium block mb-1 text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              className="w-full p-1 border-b-2 border-gray-300 bg-transparent focus:border-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
  
          {/* Password Input */}
          <div className="mb-4 text-left">
            <label className="font-medium block mb-1 text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full p-1 border-b-2 border-gray-300 bg-transparent focus:border-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
  
          {/* Confirm Password Input */}
          <div className="mb-4 text-left">
            <label className="font-medium block mb-1 text-gray-600">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-1 border-b-2 border-gray-300 bg-transparent focus:border-blue-500 focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
  
          <button
            type="submit"
            className="w-full text-white bg-blue-700 rounded hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-3 text-center mb-4 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Sign Up
          </button>
        </form>
  
        <p className="text-sm text-gray-500 mt-4">
          Already have an account?
          <Link to="/login" className="text-blue-500 font-medium hover:underline ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  </div>
  
  );
};

export default RegisterPage;
