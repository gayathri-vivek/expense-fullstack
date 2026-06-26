import React, { createContext, useContext, useState } from "react";
import { login as apiLogin, register as apiRegister } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const res = await apiLogin({ email, password });
    const { token, name, email: userEmail } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ name, email: userEmail }));
    setUser({ name, email: userEmail });
  };

  const register = async (name, email, password) => {
    const res = await apiRegister({ name, email, password });
    const { token, email: userEmail } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ name, email: userEmail }));
    setUser({ name, email: userEmail });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
