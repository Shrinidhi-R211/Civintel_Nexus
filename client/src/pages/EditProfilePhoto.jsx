// src/pages/EditPhoto.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditPhoto() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(() => {
    return localStorage.getItem('user_profile_image') || null;
  });

  const [selectedFile, setSelectedFile] = useState(null);

  // ==========================
  //   OPEN FILE DIALOG
  // ==========================
  const triggerFilePicker = () => {
    fileInputRef.current.click();
  };

  // ==========================
  //   HANDLE IMAGE SELECTION
  // ==========================
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // ==========================
  //   SAVE IMAGE (WITH COMPRESSION)
  // ==========================
  const handleSave = async () => {
    if (!selectedFile) {
      alert('Please choose an image first.');
      return;
    }

    // COMPRESS BEFORE SAVING
    const compressed = await compressImage(selectedFile);

    try {
      localStorage.setItem('user_profile_image', compressed);
    } catch {
      alert('Image too large even after compression!');
      return;
    }
    // ================
    // Dummy save
    // ================

    // ================================
    // BACKEND READY (uncomment later)
    // ================================
    /*
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      await axios.put("/api/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      */
    navigate('/profile');
  };

  // ==========================
  //   COMPRESS IMAGE FUNCTION
  // ==========================
  const compressImage = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX = 480; // good balance

          let { width, height } = img;

          if (width > MAX) {
            height = (MAX / width) * height;
            width = MAX;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressed = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressed);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-900 p-8 flex justify-center">
      <div className="w-[min(600px,95%)] bg-neutral-900/60 p-6 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* ======================
            FUTURISTIC BG LAYERS
        ======================= */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute w-[300px] h-[300px] -top-12 -left-16 bg-indigo-600/40 blur-3xl rounded-full animate-pulse"></div>
          <div className="absolute w-[250px] h-[250px] -bottom-16 -right-10 bg-sky-500/40 blur-3xl rounded-full animate-pulse"></div>
        </div>

        {/* ======================
            PAGE TITLE
        ======================= */}
        <h1 className="text-3xl font-extrabold text-white mb-6 relative z-10">
          Update Profile Photo
        </h1>

        {/* ======================
             GITHUB-SIZE PREVIEW
        ======================= */}
        <div className="flex justify-center mb-6 relative z-10">
          <div className="w-48 h-48 rounded-full overflow-hidden bg-neutral-800 border border-white/10 shadow-2xl">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/40">
                No Image Selected
              </div>
            )}
          </div>
        </div>

        {/* ======================
             IMAGE UPLOAD ZONE
        ======================= */}
        <div
          onClick={triggerFilePicker}
          className="border border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-all cursor-pointer rounded-xl p-6 text-center relative z-10"
        >
          <p className="text-indigo-200">Click to choose an image</p>
          <p className="text-xs text-indigo-300/60">(JPG, PNG allowed)</p>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* ======================
             BUTTONS
        ======================= */}
        <div className="flex justify-end gap-3 mt-6 relative z-10">
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-semibold shadow-md hover:scale-[1.02] transition-all"
          >
            Save Photo
          </button>
        </div>
      </div>
    </div>
  );
}
