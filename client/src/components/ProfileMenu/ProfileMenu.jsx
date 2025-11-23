// src/components/ProfileMenu/ProfileMenu.jsx
import React, { useEffect, useRef, useState } from "react";
import { FiEdit, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onDoc(e) {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const avatarLetter = (user?.name?.[0] || "U").toUpperCase();

  return (
    <div className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-12 h-12 rounded-full focus:outline-none transform-gpu hover:scale-105 transition-transform duration-200
                   bg-gradient-to-br from-indigo-600/40 to-sky-600/30 shadow-lg backdrop-blur-sm flex items-center justify-center"
        aria-label="Open profile panel"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="avatar"
            className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-400/40"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-700 to-sky-500 flex items-center justify-center text-white font-bold text-lg">
            {avatarLetter}
          </div>
        )}
      </button>

      {/* Sliding panel */}
      <div
        ref={panelRef}
        className={`fixed left-0 top-16 w-screen z-50 pointer-events-none transition-all duration-350 ${
          open ? "opacity-100 translate-y-2 pointer-events-auto" : "opacity-0 -translate-y-6"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(.16,.9,.3,1)" }}
      >
        <div className="mx-auto w-[min(1200px,96%)] rounded-2xl overflow-hidden shadow-2xl
                        bg-gradient-to-b from-neutral-900/70 to-neutral-900/60 border border-white/5
                        backdrop-blur-2xl p-6 transform-gpu">
          <div className="flex items-center gap-6">
            {/* Big avatar */}
            <div className="relative">
              <div className="w-36 h-36 rounded-full flex items-center justify-center overflow-hidden
                              bg-gradient-to-tr from-indigo-600/30 to-sky-400/10 ring-1 ring-white/5">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-extrabold text-white">
                    {avatarLetter}
                  </div>
                )}
              </div>

              {/* edit pencil */}
              <button
                onClick={() => navigate("/profile/edit-photo")}
                className="absolute -right-2 -bottom-2 bg-indigo-600/80 hover:bg-indigo-500 text-white p-2 rounded-full shadow-md"
                title="Edit photo"
              >
                <FiEdit />
              </button>
            </div>

            {/* user info */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-white">
                    {user?.name || "Unnamed User"}
                  </h3>
                  <p className="text-sm text-indigo-200/90">{user?.email || "—"}</p>
                </div>

                <div className="text-right">
                  <div className="text-sm text-indigo-200/60">Joined</div>
                  <div className="text-sm font-medium text-indigo-100">
                    {user?.joinedDate || "—"}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-white/3 border border-white/5">
                  <div className="text-xs text-indigo-200/60">Phone</div>
                  <div className="font-medium text-white">{user?.phone || "—"}</div>
                </div>

                <div className="p-3 rounded-lg bg-white/3 border border-white/5">
                  <div className="text-xs text-indigo-200/60">Location</div>
                  <div className="font-medium text-white">
                    {user?.city ? `${user.city}, ${user.state || ""}` : "—"}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/3 border border-white/5">
                  <div className="text-xs text-indigo-200/60">Occupation</div>
                  <div className="font-medium text-white">{user?.occupation || "—"}</div>
                </div>
              </div>

              <div className="mt-4 flex gap-3 items-center">
                <button
                  onClick={() => navigate("/profile/edit-details")}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-semibold shadow-md"
                >
                  Edit Profile
                </button>

                <button
                  onClick={() => { logout(); setTimeout(() => window.location.reload(), 50); }}
                  className="px-3 py-2 rounded-lg border border-white/8 text-white flex items-center gap-2"
                  title="Logout"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* bio / about */}
          <div className="mt-5 border-t border-white/5 pt-4 text-indigo-100/80">
            <p className="line-clamp-3">{user?.bio || "No bio provided yet."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
