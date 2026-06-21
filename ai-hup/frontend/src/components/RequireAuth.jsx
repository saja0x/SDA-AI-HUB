import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";

// يحمي أي صفحة تحتاج تسجيل دخول (مثل لوحة الأدمن).
// لو ما فيه مستخدم مسجّل دخول بالـ AuthContext، يرجّعه لصفحة /login.
function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequireAuth;