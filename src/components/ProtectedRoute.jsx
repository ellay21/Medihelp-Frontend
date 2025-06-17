import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (decoded.exp < currentTime) {
        console.log("Token expired");
        return false;
      }
      
      // Additional checks can be added here (issuer, audience, etc.)
      return true;
      
    } catch (error) {
      console.error("Invalid token:", error);
      return false;
    }
  };

  // If no token or invalid token, redirect to login
  if (!token || !isTokenValid(token)) {
    // Optional: Clear invalid tokens
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;