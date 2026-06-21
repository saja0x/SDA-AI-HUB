import React, { useContext } from "react";
 
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";
 
// تغيير: ضفنا عرض إيميل المستخدم المسجل دخول (فكرة من ملف الأستاذ) -
// يعطي تأكيد بصري واضح "أنتِ مسجلة دخول بهذا الحساب".
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
        <>
          <span style={{ color: "var(--text-faint)", fontSize: "13px", marginInlineEnd: "8px" }}>
            {user.email}
          </span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
 
export default Navbar;