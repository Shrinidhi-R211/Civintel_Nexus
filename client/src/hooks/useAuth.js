// src/hooks/useAuth.js
import { useState, useEffect } from "react";
// import axios from "axios"; // uncomment when backend is ready

const LOCAL_KEY = "civ_user";

export default function useAuth(initialUser = null) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : initialUser;
    } catch {
      return initialUser;
    }
  });
  const isLoggedIn = Boolean(user);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(LOCAL_KEY, JSON.stringify(user));
      else localStorage.removeItem(LOCAL_KEY);
    } catch (e) {
      console.error("useAuth localStorage error", e);
    }
  }, [user]);

  // Dummy login for dev/demo
  const login = (payload = { name: "Demo User", email: "demo@civintel.local" }) => {
    setUser((u) => ({ ...payload, ...(u || {}) }));
  };

  const logout = () => {
    setUser(null);
  };

  // Update user locally; call backend when available
  const updateUser = async (patch) => {
    const updated = { ...(user || {}), ...patch };
    setUser(updated);

    // Backend-ready example (commented)
    // try {
    //   const res = await axios.put("/api/user/update", updated);
    //   setUser(res.data);
    // } catch (err) {
    //   console.error("Failed to update user on server", err);
    // }

    return updated;
  };

  // For setting the user from server payload
  const setUserFromServer = (payload) => {
    setUser(payload);
  };

  // Upload avatar to backend (commented). For now we only store base64 or URL in user.avatarUrl
  const uploadAvatar = async (fileOrBase64) => {
    // If backend: create FormData and post
    // const form = new FormData();
    // form.append("avatar", fileInputFile);
    // const res = await axios.post("/api/user/avatar", form, { headers: { "Content-Type": "multipart/form-data" } });
    // setUser((u) => ({ ...u, avatarUrl: res.data.avatarUrl }));

    // For now: set avatarUrl to base64 or file URL passed as param
    const updated = { ...(user || {}), avatarUrl: fileOrBase64 };
    setUser(updated);
    return updated;
  };

  return {
    isLoggedIn,
    user,
    login,
    logout,
    updateUser,
    uploadAvatar,
    setUserFromServer,
  };
}
