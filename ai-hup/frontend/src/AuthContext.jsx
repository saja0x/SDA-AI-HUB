import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { apiRequest } from "./api.js";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    apiRequest("/users/me", { token })
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
    fetchedRef.current = false;
    apiRequest("/users/me", { token: data.access_token })
      .then(setUser)
      .catch(() => {});
  }

  async function register(email, password, role, username) {
    await apiRequest("/auth/register", {
      method: "POST",
      body: { username, email, password, role },
    });
    await login(email, password);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    fetchedRef.current = false;
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