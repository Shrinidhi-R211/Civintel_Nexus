import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className="
        fixed top-0 left-0 w-full z-50 
        bg-[rgba(30,0,50,0.9)] 
        px-4 sm:px-6 md:px-10 lg:px-16 xl:px-28 2xl:px-40
        py-4
        flex justify-between items-center 
        shadow-lg
      "
    >
      {/* Logo */}
      <div
        className="
          text-white font-bold
          text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl
        "
      >
        Civintel Nexus
      </div>

      {/* Hamburger (only mobile & small tablets) */}
      <div
        className="
          text-white cursor-pointer
          text-2xl xs:text-3xl sm:text-3xl
          md:hidden
        "
        onClick={toggleMenu}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Desktop Nav */}
      <ul
        className="
          hidden
          md:flex
          gap-6 lg:gap-10 xl:gap-12 
          text-white font-medium
          text-base sm:text-lg lg:text-xl
        "
      >
        <li className="hover:scale-125 transition"><Link to="/">Home</Link></li>
        <li className="hover:scale-125 transition"><Link to="/noise">Noise</Link></li>
        <li className="hover:scale-125 transition"><Link to="/air">Air</Link></li>
        <li className="hover:scale-125 transition"><Link to="/weather">Weather</Link></li>
        <li className="hover:scale-125 transition"><Link to="/ai_predict">Prediction</Link></li>
      </ul>

      {/* Mobile Dropdown */}
      <ul
        className={`
          md:hidden 
          fixed top-[70px] right-0 
          bg-[rgba(30,0,50,0.95)] 
          w-48 xs:w-56 sm:w-64 
          h-[calc(100vh-70px)] 
          flex flex-col items-center
          gap-6 xs:gap-8 sm:gap-10 
          pt-8 xs:pt-10 sm:pt-12
          transform transition-all duration-300
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <li className="text-white text-lg sm:text-xl" onClick={closeMenu}>
          <Link to="/">Home</Link>
        </li>
        <li className="text-white text-lg sm:text-xl" onClick={closeMenu}>
          <Link to="/noise">Noise</Link>
        </li>
        <li className="text-white text-lg sm:text-xl" onClick={closeMenu}>
          <Link to="/air">Air</Link>
        </li>
        <li className="text-white text-lg sm:text-xl" onClick={closeMenu}>
          <Link to="/weather">Weather</Link>
        </li>
        <li className="text-white text-lg sm:text-xl" onClick={closeMenu}>
          <Link to="/ai_predict">Prediction</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
