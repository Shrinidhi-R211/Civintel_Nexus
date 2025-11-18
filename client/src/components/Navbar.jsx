import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="logo">Civintel Nexus</div>
      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li className="text-white text-xl opacity-95 hover:scale-125 duration-300"><Link to="/">Home</Link></li>
        <li className="text-white text-xl opacity-95 hover:scale-125 duration-300"><Link to="/noise">Noise</Link></li>
        <li className="text-white text-xl opacity-95 hover:scale-125 duration-300"><Link to="/air">Air</Link></li>
        <li className="text-white text-xl opacity-95 hover:scale-125 duration-300"><Link to="/weather">Weather</Link></li>

      </ul>
    </nav>
  );
}

export default Navbar;
