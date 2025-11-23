// src/pages/HomePage.jsx
import React from "react";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import logo from "./images/civintel_nexus_logo.png";
import styles from "./HomePage.module.css";
import Orbmenu from "../components/Orbmenu/Orbmenu";

// new imports
import useAuth from "../hooks/useAuth";
import ServicesSection from "../components/ServicesSection/ServicesSection";
import ProfileMenu from "../components/ProfileMenu/ProfileMenu";

export default function HomePage() {
  const { isLoggedIn, user, login, logout } = useAuth();

  // For convenience during dev: if the user is not logged in,
  // show a subtle dev helper in the hero to trigger the dummy login.
  // Remove or hide in production.
  const triggerDemoLogin = () => {
    login({ name: "Demo User", email: "demo@civintel.local" });
  };

  return (
    <div className={styles.wrapper}>
      {/* Fixed Navbar */}
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          <div className={styles.navInner1}>
            <a href="/" className={styles.brand}>
              <img src={logo} alt="Civintel Nexus Logo" className={styles.logoImg} />
              <span className={styles.logoText}>Civintel Nexus</span>
            </a>
          </div>

          <div className={styles.navInner2}>
            <nav className={styles.navLinks}>
              <a href="#home" className={styles.navLink}>Home</a>
              <a href="#about" className={styles.navLink}>About</a>
              <a href="#services" className={styles.navLink}>Services</a>
              <a href="#contact" className={styles.navLink}>Contact</a>

              {/* Replace the Login link with either ProfileMenu or Login */}
              {isLoggedIn ? (
                <div style={{ display: "inline-flex", alignItems: "center" }}>
                  <ProfileMenu user={user} onLogout={logout} />
                </div>
              ) : (
                <a href="/login" className={styles.navLink}>Login</a>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main content with offset to account for fixed navbar */}
      <main className={styles.main}>
        {/* HERO */}
        <section id="home" className={styles.hero}>
          <div className={styles.heroOverlay} />
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>Civintel Nexus</h1>
            <p className={styles.heroSubtitle}>
              Professional environmental intelligence — air, noise, weather, and AI-driven insights for better decisions.
            </p>
            <div className={styles.heroCtas}>
              <a href="#about" className={styles.primaryBtn}>Explore Project</a>
              <a href="#services" className={styles.ghostBtn}>Our Services</a>
            </div>

            {/* dev helper - remove when ready */}
            {!isLoggedIn && (
              <div style={{ marginTop: 16 }}>
                <button
                  onClick={triggerDemoLogin}
                  style={{
                    borderRadius: 10,
                    padding: "8px 12px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "linear-gradient(90deg,#6e4bff,#3aa0ff)",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 700,
                    boxShadow: "0 10px 30px rgba(60,40,140,0.12)",
                  }}
                >
                  Demo Login (no backend)
                </button>
              </div>
            )}
          </div>
        </section>

        <hr className={styles.separator} />

        {/* ABOUT */}
        <section id="about" className={styles.aboutSection}>
          <div className={styles.aboutInner}>
            <div className={styles.aboutText}>
              <h2 className={styles.sectionTitle}>About the Project</h2>
              <ul className={styles.futuristicBullets}>
                <li><span className={styles.bulletMark} /> Approximate Real-time air & noise monitoring</li>
                <li><span className={styles.bulletMark} /> Approximate weather insights for any location</li>
                <li><span className={styles.bulletMark} /> Data-driven environmental analysis</li>
                <li><span className={styles.bulletMark} /> AI predictions (coming soon)</li>
                <li><span className={styles.bulletMark} /> Built for research & civic awareness</li>
              </ul>
            </div>
          </div>
        </section>

        <hr className={styles.separator} />

        {/* SERVICES - swapped for ServicesSection component */}
        <ServicesSection isLoggedIn={isLoggedIn} />

        <hr className={styles.separator} />

        {/* CONTACT + Footer */}
        <footer id="contact" className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerAbout}>
              <a href="/" className={styles.brand}>
                <img src={logo} alt="Civintel Nexus Logo" className={styles.logoImg2} />
              </a>
              <p className={styles.footerDesc}>Civintel Nexus — environmental intelligence for healthier communities.</p>
            </div>

            <div className={styles.footerContact}>
              <h3>Contact Us</h3>
              <p className={styles.contactLine}><strong>Email:</strong> contact@civintelnexus.com</p>
              <p className={styles.contactLine}><strong>Phone:</strong> +91 87489 24512</p>
              <div className={styles.socials}>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialBtn}><FaInstagram /></a>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className={styles.socialBtn}><FaTwitter /></a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.socialBtn}><FaLinkedin /></a>
              </div>
            </div>

            <div className={styles.footerLinks}>
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Privacy Policy</a>
              <a href="/terms" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Terms</a>
            </div>
          </div>

          <div className={styles.copyRow}>
            <span>© {new Date().getFullYear()} Civintel Nexus. All rights reserved.</span>
          </div>
        </footer>
      </main>

      <Orbmenu />
    </div>
  );
}
