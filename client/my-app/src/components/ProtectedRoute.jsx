import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const loginTimestamp = localStorage.getItem('loginTimestamp');
  const currentTime = new Date().getTime();

  // Check if user came from login page (within last 5 seconds)
  const isFromLogin = loginTimestamp && (currentTime - parseInt(loginTimestamp)) < 5000;

  if (!token || !isFromLogin) {
    // Either not logged in or trying to access directly via URL
    return <Navigate to="/login" replace />;
  }

  // Check if user is trying to access the correct dashboard based on their role
  const path = window.location.pathname;
  if (path === '/doctor-landingPage' && userRole !== 'doctor') {
    return <Navigate to="/login" replace />;
  }
  if (path === '/Patient-Dashbord' && userRole !== 'patient') {
    return <Navigate to="/login" replace />;
  }

  // Authorized and came from login, render component
  return children;
};

export default ProtectedRoute; 