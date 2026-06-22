import React, { useContext } from "react";
 
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";
import LumiaMascot from "../assets/Lumia-mascot.png";
 
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
      <style>{`nav h2.navbar-brand::before { content: none !important; display: none !important; }`}</style>
 
      <h2 className="navbar-brand" style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
        <img
          src={LumiaMascot}
          alt="Lumia"
          style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
        />
        Lumia
      </h2>
 
      <Link to="/">Home</Link>
      <Link to="/models">Models</Link>
      <Link to="/compare">Compare</Link>
      <Link to="/playground">Playground</Link>
      <Link to="/chatbot">Chatbot</Link>
      {isAdmin && <Link to="/create">Add Model</Link>}
      {isAdmin && <Link to="/admin">Admin</Link>}
      <Link to="/benchmark">Benchmark</Link>
 
      {user ? (
        <>
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
 
export default Navbar;