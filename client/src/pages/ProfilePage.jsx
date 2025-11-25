// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { FiEdit, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [localAvatar, setLocalAvatar] = useState(null);

  useEffect(() => {
    setLocalAvatar(localStorage.getItem("user_profile_image"));
  }, []);

  const avatarToShow = localAvatar || user?.avatarUrl || null;
  const avatarLetter = (user?.name?.[0] || "U").toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-900 p-8">
      <div className="mx-auto my-10 w-[min(1100px,96%)]">
        <div className="rounded-2xl p-6 bg-gradient-to-b from-transparent to-neutral-900/60 border border-white/5 backdrop-blur-lg shadow-2xl">
          
          <div className="flex gap-6 items-start">
            
            {/* Avatar */}
            <div className="relative">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-600/30 to-sky-400/10 ring-1 ring-white/5">
                {avatarToShow ? (
                  <img
                    src={avatarToShow}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-extrabold text-white">
                    {avatarLetter}
                  </div>
                )}
              </div>

              {/* Edit button */}
              <button
                onClick={() => navigate("/profile/edit-photo")}
                className="absolute -right-2 -bottom-2 bg-indigo-600/85 hover:bg-indigo-500 text-white p-2 rounded-full shadow-md cursor-pointer"
              >
                <FiEdit />
              </button>
            </div>

            {/* User info */}
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-white">
                {user?.name || "Unnamed User"}
              </h1>
              <p className="mt-1 text-indigo-200">{user?.email || "—"}</p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/3 border border-white/5">
                  <div className="text-xs text-indigo-200/60">Phone</div>
                  <div className="font-medium text-white">{user?.phone || "—"}</div>
                </div>

                <div className="p-4 rounded-lg bg-white/3 border border-white/5">
                  <div className="text-xs text-indigo-200/60">Location</div>
                  <div className="font-medium text-white">
                    {user?.city ? `${user.city}, ${user.state || ""}` : "—"}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/3 border border-white/5">
                  <div className="text-xs text-indigo-200/60">Occupation</div>
                  <div className="font-medium text-white">{user?.occupation || "—"}</div>
                </div>

                <div className="p-4 rounded-lg bg-white/3 border border-white/5">
                  <div className="text-xs text-indigo-200/60">Joined</div>
                  <div className="font-medium text-white">{user?.joinedDate || "—"}</div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => navigate("/profile/edit-details")}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-semibold shadow-md"
                >
                  Edit Profile
                </button>

                <button
                  onClick={() => {
                    logout();
                    setTimeout(() => navigate("/"), 60);
                  }}
                  className="px-3 py-2 rounded-lg border border-white/8 text-white flex items-center gap-2"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6 border-t border-white/5 pt-4">
            <h4 className="text-sm text-indigo-200/70 mb-2">About</h4>
            <p className="text-indigo-100/80">
              {user?.bio || "No bio yet. Click edit to add one."}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
