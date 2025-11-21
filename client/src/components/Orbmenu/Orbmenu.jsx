import React, { useState } from "react";
import { FiHome, FiSettings, FiUpload, FiInfo, FiPhone, FiArrowUp } from "react-icons/fi";
import { FaBars } from "react-icons/fa";


function OrbMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden fixed bottom-6 right-6 z-[999]">
      {/* Buttons Container */}
      <div
        className={`flex flex-col items-end gap-3 mb-3 transition-all duration-300 ${
          open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* 1. Home */}
        <a href="/">
         <button className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center
          active:scale-90 transition">
          <FiHome className="text-purple-600 text-xl" />
        </button>
        </a>

        {/* 2. About */}
        <a href="#about">
            <button className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center
          active:scale-90 transition">
          <FiInfo className="text-purple-600 text-xl" />
        </button>
        </a>

        {/* 3. Services */}
        <a href="#services">
        <button className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center
          active:scale-90 transition">
          <FiSettings className="text-purple-600 text-xl" />
        </button>
        </a>

        {/* 4. Contact */}
        <a href="#contact">
            <button className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center
          active:scale-90 transition">
          <FiPhone className="text-purple-600 text-xl" />
        </button>
        </a>

        {/* 5. Upload */}
        <a href="/login">
            <button className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center
            active:scale-90 transition">
          <FiUpload className="text-purple-600 text-xl" />
        </button>
        </a>

        {/* 6. Back to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center
          active:scale-90 transition"
        >
          <FiArrowUp className="text-purple-600 text-xl" />
        </button>
      </div>

      {/* Main ORB */}
    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl
    transition-all duration-300
    bg-gradient-to-br from-purple-600 to-purple-400
    ${open ? "scale-110 rotate-90" : "scale-100"}`}>
  <button onClick={() => setOpen(!open)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center"> <FaBars className="w-5 h-5 text-blue-800" /> </button>
  </div>
</div>

  );
}

export default OrbMenu;
