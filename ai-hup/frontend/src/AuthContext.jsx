import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "./api.js";
 
export const AuthContext = createContext(null);
 
// تغيير كبير: قبل كذا حالة تسجيل الدخول كانت تُخزّن مباشرة (إيميل ودور
// جايين من رد /login نفسه). الحين، نفس أسلوب ملف الأستاذ بالضبط:
// نخزن التوكن بس بـ localStorage، وبعدها نتحقق منه ونجيب بيانات
// المستخدم (id, email, role) من /users/me - هذا يضمن دايمًا إن بيانات
// المستخدم المعروضة محدّثة وحقيقية من السيرفر، مو بس "محفوظة" بالمتصفح.
function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
 
  // true لين نتأكد من التوكن المحفوظ وقت فتح الصفحة. بدون هذا، أي
  // صفحة محمية كانت بترمي المستخدم لـ/login لجزء ثانية بكل ريفرش،
  // قبل ما يخلص طلب /users/me.
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
 
    apiRequest("/users/me", { token })
      .then(setUser)
      .catch(() => {
        // التوكن منتهي أو تالف - نمسحه عشان الموقع يعامل الزائر كمسجل خروج
        localStorage.removeItem("token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);
 
  async function login(email, password) {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token); // يشغّل الـ useEffect فوق، اللي يجيب بيانات المستخدم
  }
 
  async function register(email, password, role) {
    await apiRequest("/auth/register", {
      method: "POST",
      body: { email, password, role },
    });
    // التسجيل ما يرجع توكن مباشرة، فنسجل دخول بعده تلقائيًا
    await login(email, password);
  }
 
  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }
 
  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export function useAuth() {
  return useContext(AuthContext);
}
 
export default AuthProvider;