import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    // Check credentials (replace with your real auth later)
    if (email === "pat@gmail.com" && password === "pat") {
      navigate("/client"); // redirect on success
    }
  }

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-purple-500 to-blue-600 px-4 min-h-screen">
      <div className="bg-white shadow-2xl p-8 rounded-2xl w-full max-w-md">
        {/* Title */}
        <h2 className="mb-6 font-bold text-gray-800 text-2xl md:text-3xl text-center">
          Login
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              name="email"
              placeholder="Enter your email"
              className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              name="password"
              placeholder="Enter your password"
              className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 shadow-lg p-3 rounded-lg w-full font-semibold text-white transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Forgot Password */}
        <p className="mt-4 text-gray-600 text-center">
          <a href="#" className="font-semibold text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </p>

        {/* Don't have an account? */}
        <p className="mt-2 text-gray-600 text-center">
          Don't have an account?{" "}
          <a href="#" className="font-semibold text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
