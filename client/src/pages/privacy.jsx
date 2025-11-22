import React, { useEffect } from "react";
import { Link } from "react-router-dom";

// ANIMATED + ADVANCED Privacy Policy Page
export default function PrivacyPolicy({
  projectName = "SmartEnvMonitor",
  contactEmail = "privacy@smartenvmonitor.example",
}) {
  const lastUpdated = "November 21, 2025";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main
      className="
      min-h-screen 
      bg-gradient-to-br from-[#0a0f1f] via-[#0e1328] to-[#05070d]
      text-slate-100 
      p-4 sm:p-6 md:p-10 lg:p-16 
      animate-fadeIn
    "
    >
      {/* Floating Header Card */}
      <div
        className="
        max-w-6xl mx-auto 
        mb-12 
        bg-white/5 backdrop-blur-xl 
        rounded-3xl shadow-2xl 
        border border-white/10 
        transition-all duration-300 
        hover:shadow-purple-500/20 hover:border-purple-400/30
        animate-slideDown
      "
      >
        <header className="px-6 py-8 sm:px-10 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300">
                How {projectName} collects, uses, and protects your data.
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-400">Last updated</p>
              <p className="text-sm font-medium">{lastUpdated}</p>
            </div>
          </div>
        </header>

        {/* Gradient Divider */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-gradientFlow"></div>

        {/* CONTENT */}
        <article className="px-6 sm:px-10 lg:px-14 py-10 space-y-14 text-slate-200">

          {/* NAVIGATION */}
          <nav className="mb-8 flex flex-wrap gap-3 text-xs sm:text-sm">
            {[
              "collection",
              "use",
              "sharing",
              "security",
              "rights",
              "contact",
            ].map((item, i) => (
              <a
                key={i}
                href={`#${item}`}
                className="
                  px-3 py-1 rounded-lg 
                  bg-white/5 
                  hover:bg-purple-600/20 
                  border border-white/10 hover:border-purple-300 
                  transition-all 
                  animate-hoverRise
                "
              >
                {item.replace(/^\w/, (c) => c.toUpperCase())}
              </a>
            ))}
          </nav>

          {/* SECTIONS */}
          <Section id="collection" title="1. Information We Collect">
            <p>
              We collect information that helps {projectName} run and improve:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Technical Data:</strong> IP, device type, geolocation (with permission).</li>
              <li><strong>Sensor Data:</strong> Noise levels, AQI readings.</li>
              <li><strong>Account Data:</strong> Name, email, profile data.</li>
              <li><strong>Usage Data:</strong> Feature usage, analytics.</li>
            </ul>
          </Section>

          <Section id="use" title="2. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide live sensor services and environment reports.</li>
              <li>Analyze patterns to improve accuracy.</li>
              <li>AI insights and smart predictions.</li>
              <li>User support and notifications.</li>
            </ul>
          </Section>

          <Section id="sharing" title="3. Sharing & Third Parties">
            <p>We never sell your personal data. We may share:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>With service providers for hosting, analytics, maps.</li>
              <li>Aggregated/anonymized data for research.</li>
              <li>Legal authorities if required by law.</li>
            </ul>
          </Section>

          <Section id="cookies" title="4. Cookies & Tracking">
            <p>We use cookies for functionality, personalization, and analytics.</p>
          </Section>

          <Section id="security" title="5. Security">
            <p>
              We use technical and physical safeguards, but no internet data is
              100% secure.
            </p>
          </Section>

          <Section id="rights" title="6. Your Rights">
            <p>You may request access, correction, or deletion of your data.</p>
          </Section>

          <Section id="children" title="7. Children">
            <p>We do not collect data from children under 13.</p>
          </Section>

          <Section id="contact" title="8. Contact">
            <p>
              Email us at{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-purple-300 underline"
              >
                {contactEmail}
              </a>
            </p>
          </Section>

          <Section id="changes" title="9. Changes to this Policy">
            <p>We will notify major changes through updates or alerts.</p>
          </Section>

          {/* ACTION BUTTONS */}
          <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex gap-4">
              <Link
                to="/"
                className="
                px-5 py-2 rounded-xl text-sm font-medium
                bg-slate-800 hover:bg-slate-700
                border border-white/10 
                hover:border-purple-400/40
                hover:shadow-purple-500/20
                transition-all
              "
              >
                Home
              </Link>

              <button
                onClick={() => window.print()}
                className="
                px-5 py-2 rounded-xl text-sm font-medium
                bg-purple-600 hover:bg-purple-700
                shadow-lg shadow-purple-500/30
                transition-all
              "
              >
                Print
              </button>
            </div>

            <p className="text-sm text-slate-400">
              Questions? Contact {" "}
              <a href={`mailto:${contactEmail}`} className="underline text-purple-300">
                {contactEmail}
              </a>
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}

/* ============================
   Reusable Section Component
=============================== */
function Section({ id, title, children }) {
  return (
    <section
      id={id}
      className="
      space-y-4 
      animate-sectionReveal 
      scroll-mt-28
    "
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-purple-300">
        {title}
      </h2>
      <div className="leading-relaxed text-slate-300">{children}</div>

      {/* Glow divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"></div>
    </section>
  );
}
