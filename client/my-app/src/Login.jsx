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
          localStorage.setItem("loginTimestamp", new Date().getTime().toString());
          
          // Store IDs based on role
          if (role === "patient" && patientId) {
            localStorage.setItem("patientId", patientId);
          } else if (role === "doctor" && doctorId) {
            localStorage.setItem("doctorId", doctorId);
          }

          // Redirect based on role
          if (role === "admin") {
            navigate("/AdminDashboard");
          } else if (role === "doctor") {
            navigate("/doctor-landingPage");
          } else if (role === "patient") {
            navigate("/Patient-Dashbord");
          } else {
            // fallback if role is unknown
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
      </div>
    </div>
  );
};

export default Login;
