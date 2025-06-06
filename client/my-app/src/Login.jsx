import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const Handler = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/login", { email, password })
      .then((res) => {
        const { token, role, patientId, doctorId } = res.data;

        if (token && role) {
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          localStorage.setItem("userEmail", email);
          localStorage.setItem(
            "loginTimestamp",
            new Date().getTime().toString()
          );

          if (role === "patient" && patientId) {
            localStorage.setItem("patientId", patientId);
          } else if (role === "doctor" && doctorId) {
            localStorage.setItem("doctorId", doctorId);
          }

          if (role === "admin") {
            navigate("/AdminDashboard");
          } else if (role === "doctor") {
            navigate("/doctor-landingPage");
          } else if (role === "patient") {
            navigate("/Patient-Dashbord");
          } else {
            navigate("/dashboard");
          }
        }
      })
      .catch((err) => {
        alert("Login failed: " + err.response?.data?.message || "Server error");
        console.error(err);
      });
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-purple-500 to-blue-600 px-4 min-h-screen">
      <div className="bg-white shadow-2xl p-8 rounded-2xl w-full max-w-md">
        <h2 className="mb-6 font-bold text-gray-800 text-2xl md:text-3xl text-center">
          Login
        </h2>

        <form onSubmit={Handler} className="space-y-5">
          <div>
            <label className="block font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 shadow-lg p-3 rounded-lg w-full font-semibold text-white transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-gray-600 text-center">
          <a href="#" className="font-semibold text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </p>

        <p className="mt-2 text-gray-600 text-center">
          Don't have an account?{" "}
          <a
            href="#"
            className="font-semibold text-blue-500 hover:underline"
            onClick={() => navigate("/patient-register")}
          >
            Register here
          </a>
        </p>

        {/* Cool Back Home Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 shadow-md hover:shadow-xl px-4 py-2 rounded-full text-white hover:scale-105 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7m-7-7v18"
              />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
