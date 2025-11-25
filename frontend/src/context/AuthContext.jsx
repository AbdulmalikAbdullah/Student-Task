import { createContext, useState, useEffect } from "react";
import api from "../api/axiosConfig.js"

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load existing token user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchUser();
  }, []);

  // Fetch logged-in user info
  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  };

  // Login
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    // Save token
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);

    return res.data;
  };

  // Register
  const register = async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}