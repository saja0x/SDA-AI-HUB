import React, { useContext } from "react";
 
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";
 
function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
 
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
      <Link to="/create">Add Model</Link>
      <Link to="/admin">Admin</Link>
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