import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";
 
// يحمي أي صفحة تحتاج تسجيل دخول. مرّري adminOnly={true} لو الصفحة لازم
// تكون لأدمن بس (مثل لوحة التحكم وفورم إضافة موديل).
//
// تغيير: ضفنا فحص "loading" أول شي (مطابق لـProtectedRoute بملف الأستاذ).
// وقت الريفرش فيه لحظة قصيرة عندنا فيها توكن بس لسا ما تأكدنا منه مع
// الباكند - بدون هذا الفحص، المستخدم كان ينرمى لـ/login لجزء ثانية
// بكل مرة يرفرش، حتى لو هو فعلاً مسجل دخول.
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