import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext.jsx";
import { apiRequest } from "../api.js";
 
// صفحة بروفايل بسيطة لأي مستخدم مسجل دخول (مو أدمن بس). تجيب بياناتها
// من /users/profile - مسار محمي بتسجيل الدخول فقط (بدون شرط الأدمن)،
// عشان تثبت إن "محمي" و"أدمن بس" شيئين مختلفين بالموقع.
function ProfilePage() {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
 
  useEffect(() => {
    apiRequest("/users/profile", { token })
      .then(setProfile)
      .catch((err) => setError(err.message));
  }, [token]);
 
  return (
    <div className="login-container">
      <h1>My Profile</h1>
 
      {error && <p className="form-error">{error}</p>}
 
      {profile ? (
        <>
          <p>{profile.message}</p>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "16px", lineHeight: 2 }}>
            <li><strong>Account ID:</strong> {profile.id}</li>
            <li><strong>Email:</strong> {profile.email}</li>
            <li><strong>Role:</strong> {profile.role}</li>
          </ul>
        </>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
}
 
export default ProfilePage;