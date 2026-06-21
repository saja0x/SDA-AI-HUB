import React, { useContext } from "react";
 
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";
 
// تغيير: روابط "Add Model" و"Admin" الحين تطلع بس لو المستخدم مسجل دخول
// ودوره "admin" فعليًا - قبل كذا كانت تطلع للجميع حتى لو ما يقدرون يستخدمونها.
function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
 
  const handleLogout = () => {
    logout();
    navigate("/");
  };
 
  return (
    <nav>
      <h2>Lumia</h2>
 
      <Link to="/">Home</Link>
      <Link to="/models">Models</Link>
      <Link to="/compare">Compare</Link>
      <Link to="/playground">Playground</Link>
      <Link to="/chatbot">Chatbot</Link>
      {isAdmin && <Link to="/create">Add Model</Link>}
      {isAdmin && <Link to="/admin">Admin</Link>}
      <Link to="/benchmark">Benchmark</Link>
 
      {user ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
 
export default Navbar;