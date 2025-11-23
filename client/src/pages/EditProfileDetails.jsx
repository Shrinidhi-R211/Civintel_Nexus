// src/pages/EditProfileDetails.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSave, FiX } from "react-icons/fi";
import useAuth from "../hooks/useAuth";

export default function EditProfileDetails() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    city: user?.city || "",
    state: user?.state || "",
    country: user?.country || "",
    occupation: user?.occupation || "",
    bio: user?.bio || "",
    dob: user?.dob || "",
  });

  const [saving, setSaving] = useState(false);

  const onChange = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      // If backend: call update API (uncomment below)
      // await axios.put('/api/user/update', form);
      await updateUser(form);
      navigate("/profile");
    } catch (err) {
      console.error("Save profile failed", err);
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-900 p-8">
      <div className="mx-auto w-[min(900px,96%)]">
        <div className="rounded-2xl p-6 bg-gradient-to-b from-transparent to-neutral-900/60 border border-white/5 backdrop-blur-lg shadow-2xl">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <p className="text-sm text-indigo-200/80 mt-1">Make changes and press Save to commit.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-xs text-indigo-200">Full name</div>
              <input value={form.name} onChange={onChange("name")}
                className="mt-1 block w-full rounded-lg bg-neutral-900 border border-white/6 p-3 text-white outline-none focus:ring-2 focus:ring-indigo-500" />
            </label>

            <label className="block">
              <div className="text-xs text-indigo-200">Phone</div>
              <input value={form.phone} onChange={onChange("phone")}
                className="mt-1 block w-full rounded-lg bg-neutral-900 border border-white/6 p-3 text-white outline-none focus:ring-2 focus:ring-indigo-500" />
            </label>

            <label className="block">
              <div className="text-xs text-indigo-200">City</div>
              <input value={form.city} onChange={onChange("city")}
                className="mt-1 block w-full rounded-lg bg-neutral-900 border border-white/6 p-3 text-white outline-none focus:ring-2 focus:ring-indigo-500" />
            </label>

            <label className="block">
              <div className="text-xs text-indigo-200">State</div>
              <input value={form.state} onChange={onChange("state")}
                className="mt-1 block w-full rounded-lg bg-neutral-900 border border-white/6 p-3 text-white outline-none focus:ring-2 focus:ring-indigo-500" />
            </label>

            <label className="block">
              <div className="text-xs text-indigo-200">Country</div>
              <input value={form.country} onChange={onChange("country")}
                className="mt-1 block w-full rounded-lg bg-neutral-900 border border-white/6 p-3 text-white outline-none focus:ring-2 focus:ring-indigo-500" />
            </label>

            <label className="block">
              <div className="text-xs text-indigo-200">Occupation</div>
              <input value={form.occupation} onChange={onChange("occupation")}
                className="mt-1 block w-full rounded-lg bg-neutral-900 border border-white/6 p-3 text-white outline-none focus:ring-2 focus:ring-indigo-500" />
            </label>

            <label className="block sm:col-span-2">
              <div className="text-xs text-indigo-200">Date of birth</div>
              <input type="date" value={form.dob} onChange={onChange("dob")}
                className="mt-1 block w-full rounded-lg bg-neutral-900 border border-white/6 p-3 text-white outline-none focus:ring-2 focus:ring-indigo-500" />
            </label>

            <label className="block sm:col-span-2">
              <div className="text-xs text-indigo-200">Bio</div>
              <textarea value={form.bio} onChange={onChange("bio")}
                className="mt-1 block w-full rounded-lg bg-neutral-900 border border-white/6 p-3 text-white outline-none focus:ring-2 focus:ring-indigo-500" rows="4" />
            </label>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-semibold flex items-center gap-2"
            >
              <FiSave /> {saving ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="px-3 py-2 rounded-lg border border-white/8 text-white flex items-center gap-2"
            >
              <FiX /> Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
