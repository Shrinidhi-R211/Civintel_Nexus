import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

function Navbar1() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">Civintel Nexus</div>

      {/* Hamburger (mobile only) */}
      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Desktop Nav Links */}
      <ul className="nav-links">
        <li onClick={closeMenu}>
          <Link to="/home">Home</Link>
        </li>
        <li onClick={closeMenu}>
          <Link to="/noise">Noise</Link>
        </li>
        <li onClick={closeMenu}>
          <Link to="/air">Air</Link>
        </li>
        <li onClick={closeMenu}>
          <Link to="/weather">Weather</Link>
        </li>
        <li onClick={closeMenu}>
          <Link to="/ai_predict">Prediction</Link>
        </li>
      </ul>

      {/* Mobile Dropdown */}
      <ul className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <li onClick={closeMenu}>
          <Link to="/home">Home</Link>
        </li>
        <li onClick={closeMenu}>
          <Link to="/noise">Noise</Link>
        </li>
        <li onClick={closeMenu}>
          <Link to="/air">Air</Link>
        </li>
        <li onClick={closeMenu}>
          <Link to="/weather">Weather</Link>
        </li>
        <li onClick={closeMenu}>
          <Link to="/ai_predict">Prediction</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar1;
