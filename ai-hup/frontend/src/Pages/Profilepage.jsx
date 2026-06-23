import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext.jsx";
import { apiRequest } from "../api.js";
import LumiaMascot from "../assets/Lumia-mascot.png";
 
const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 18px",
};
 
const labelStyle = {
  color: "var(--text-lo)",
  fontSize: "14px",
  fontWeight: 600,
};
 
const valueStyle = {
  color: "var(--text-hi)",
  fontSize: "14px",
};
 
function ProfilePage() {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
 
  useEffect(() => {
    apiRequest("/users/profile", { token })
      .then(setProfile)
      .catch((err) => setError(err.message));
  }, [token]);
 
  if (error) {
    return (
      <div className="login-container">
        <h1>My Profile</h1>
        <p className="form-error">{error}</p>
      </div>
    );
  }
 
  if (!profile) {
    return (
      <div className="login-container">
        <h1>My Profile</h1>
        <p>Loading...</p>
      </div>
    );
  }
 
  const isAdmin = profile.role === "admin";
 
  return (
    <div className="login-container">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
      
        <img
          src={LumiaMascot}
          alt="Lumia"
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <h1 style={{ margin: 0 }}>My Profile</h1>
        <p style={{ color: "var(--text-lo)", margin: 0, fontSize: "14px" }}>
          Welcome back to Lumia
        </p>
      </div>
 
      <div
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
        }}
      >
        <div style={rowStyle}>
          <span style={labelStyle}>Account ID</span>
          <span style={valueStyle}>{profile.id}</span>
        </div>
 
        <div style={{ ...rowStyle, borderTop: "1px solid var(--border-soft)" }}>
          <span style={labelStyle}>Email</span>
          <span style={valueStyle}>{profile.email}</span>
        </div>
 
        <div style={{ ...rowStyle, borderTop: "1px solid var(--border-soft)" }}>
          <span style={labelStyle}>Role</span>
          <span
            style={{
              padding: "4px 14px",
              borderRadius: "var(--radius-pill)",
              fontSize: "12px",
              fontWeight: 700,
              background: isAdmin ? "var(--grad-primary)" : "var(--surface-3)",
              color: isAdmin ? "#fff" : "var(--text-lo)",
            }}
          >
            {profile.role}
          </span>
        </div>
      </div>
    </div>
  );
}
 
export default ProfilePage;