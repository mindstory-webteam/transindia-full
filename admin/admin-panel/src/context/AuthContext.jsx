import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, getMe } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ti_admin_token");
    const saved  = localStorage.getItem("ti_admin_user");
    if (token && saved) {
      setAdmin(JSON.parse(saved));
      // Verify token is still valid
      getMe()
        .then((res) => setAdmin(res.data.admin))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    const { token, admin } = res.data;
    localStorage.setItem("ti_admin_token", token);
    localStorage.setItem("ti_admin_user", JSON.stringify(admin));
    setAdmin(admin);
    return admin;
  };

  const logout = () => {
    localStorage.removeItem("ti_admin_token");
    localStorage.removeItem("ti_admin_user");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);