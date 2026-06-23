import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";
 
function RequireAuth({ children, adminOnly = false }) {
  const { user, loading } = useContext(AuthContext);
 
  if (loading) {
    return <p>Loading...</p>;
  }
 
  if (!user) {
    return <Navigate to="/login" replace />;
  }
 
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
 
  return children;
}
 
export default RequireAuth;