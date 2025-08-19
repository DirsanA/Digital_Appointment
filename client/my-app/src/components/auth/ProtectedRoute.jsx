import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || !role) {
          setIsAuthenticated(false);
          return;
        }

        // Verify token with backend
        const response = await axios.get("http://localhost:5000/verify-token", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.valid) {
          setIsAuthenticated(true);
          setUserRole(role);
        } else {
          setIsAuthenticated(false);
          // Clear invalid auth data
          localStorage.clear();
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        setIsAuthenticated(false);
        localStorage.clear();
      }
    };

    verifyAuth();
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is trying to access the correct dashboard based on their role
  const path = window.location.pathname;

  // Handle role-based access control
  if (path === "/doctor-landingPage" && userRole !== "doctor") {
    return <Navigate to="/login" replace />;
  }
  if (path === "/Patient-Dashbord" && userRole !== "patient") {
    return <Navigate to="/login" replace />;
  }
  if (path === "/AdminDashboard" && userRole !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // Additional check: Ensure patient accounts are verified
  if (userRole === "patient") {
    const loginTimestamp = localStorage.getItem("loginTimestamp");
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - parseInt(loginTimestamp);

    // If login was more than 5 minutes ago, verify account status
    if (timeDiff > 5 * 60 * 1000) {
      // You might want to add an API call here to verify account status
      // For now, we'll just let it through since token is valid
    }
  }

  // Authorized, render component
  return children;
};

export default ProtectedRoute;
