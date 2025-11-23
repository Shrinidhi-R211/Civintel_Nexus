// src/components/ServicesSection/ServicesSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
// Reuse the existing HomePage CSS module so look/feel stays identical
import homeStyles from "../../pages/HomePage.module.css";

/**
 * ServicesSection
 * - isLoggedIn: boolean
 * - classNameOverride: optional string to append to wrapper
 */
export default function ServicesSection({ isLoggedIn }) {
  const navigate = useNavigate();

  function handleCardClick(e, targetPath) {
    e.preventDefault();
    if (!isLoggedIn) {
      // redirect to login until backend is ready
      navigate("/login");
      return;
    }
    navigate(targetPath);
  }

  return (
    <section id="services" className={homeStyles.servicesSection}>
      <div className={homeStyles.servicesHead}>
        <h2 className={homeStyles.sectionTitle}>Our Services </h2>
        <p className={homeStyles.sectionSubtle}>
          Click a card to visit the dedicated tool page.
        </p>
      </div>

      <div className={homeStyles.cardsWrapper}>
        <a
          href="/noise"
          onClick={(e) => handleCardClick(e, "/noise")}
          className={`${homeStyles.card} ${homeStyles.cardNoise}`}
          aria-label="Noise Monitoring"
        >
          <div className={homeStyles.cardContent}>
            <div className={homeStyles.cardLabel}>Noise Monitoring</div>
          </div>
        </a>

        <a
          href="/air"
          onClick={(e) => handleCardClick(e, "/air")}
          className={`${homeStyles.card} ${homeStyles.cardAir}`}
          aria-label="Air Monitoring"
        >
          <div className={homeStyles.cardContent}>
            <div className={homeStyles.cardLabel}>Air Monitoring</div>
          </div>
        </a>

        <a
          href="/weather"
          onClick={(e) => handleCardClick(e, "/weather")}
          className={`${homeStyles.card} ${homeStyles.cardWeather}`}
          aria-label="Weather Details"
        >
          <div className={homeStyles.cardContent}>
            <div className={homeStyles.cardLabel}>Weather Details</div>
          </div>
        </a>

        <a
          href="/ai_predict"
          onClick={(e) => handleCardClick(e, "/ai_predict")}
          className={`${homeStyles.card} ${homeStyles.cardAI}`}
          aria-label="AI Prediction"
        >
          <div className={homeStyles.cardContent}>
            <div className={homeStyles.cardTag}>Coming Soon</div>
            <div className={homeStyles.cardLabel}>AI Prediction</div>
          </div>
        </a>
      </div>
    </section>
  );
}
