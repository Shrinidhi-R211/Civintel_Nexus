import React from "react";
import { Link } from "react-router-dom";

// PrivacyPolicy.jsx
// A responsive, accessible privacy policy page component for the SmartEnvMonitor project.
// Uses Tailwind-style utility classes (JSX-friendly). Replace contact details and company name as needed.

const PrivacyPolicy = ({ projectName = "SmartEnvMonitor", contactEmail = "privacy@smartenvmonitor.example" }) => {
  const lastUpdated = "November 21, 2025"; // update as needed

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#0b1220] text-slate-100 p-6 md:p-12 lg:p-20">
      <section className="max-w-5xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl ring-1 ring-white/6 overflow-hidden">
        {/* Header */}
        <header className="px-6 py-8 md:px-12 md:py-12 lg:px-16 lg:py-16">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight">Privacy Policy</h1>
              <p className="mt-2 text-sm text-slate-300">How {projectName} collects, uses, and protects your data.</p>
            </div>

            <div className="flex-shrink-0 text-right">
              <p className="text-xs text-slate-400">Last updated</p>
              <p className="text-sm font-medium">{lastUpdated}</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <article className="px-6 pb-10 md:px-12 md:pb-14 lg:px-16 lg:pb-20">
          <nav className="mb-6">
            <ul className="flex flex-wrap gap-3 text-xs md:text-sm">
              <li><a href="#collection" className="underline-offset-2 hover:underline">Data we collect</a></li>
              <li><a href="#use" className="underline-offset-2 hover:underline">How we use it</a></li>
              <li><a href="#sharing" className="underline-offset-2 hover:underline">Sharing & 3rd parties</a></li>
              <li><a href="#security" className="underline-offset-2 hover:underline">Security</a></li>
              <li><a href="#rights" className="underline-offset-2 hover:underline">Your rights</a></li>
              <li><a href="#contact" className="underline-offset-2 hover:underline">Contact</a></li>
            </ul>
          </nav>

          <section id="collection" className="prose prose-invert max-w-none mb-8">
            <h2>1. Information we collect</h2>
            <p>
              We collect information that helps {projectName} run and improve. This includes:
            </p>
            <ul>
              <li><strong>Device & Technical Data:</strong> IP address, device type, browser, OS, geolocation (only when you grant permission).</li>
              <li><strong>Sensor & Environmental Data:</strong> Noise levels, AQI readings, timestamps and the location associated with a submitted reading.</li>
              <li><strong>Account Information:</strong> If you create an account: name, email, and any profile details you provide.</li>
              <li><strong>Usage Data:</strong> Pages you visit, features you use, and preferences (analytics and crash reports).</li>
            </ul>
          </section>

          <section id="use" className="prose prose-invert max-w-none mb-8">
            <h2>2. How we use your information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Provide and maintain the service, including maps, live readings, and reporting features.</li>
              <li>Improve the product and personalize the experience.</li>
              <li>Analyze trends and produce aggregated, anonymized insights.</li>
              <li>Communicate with you regarding updates, security notices, or support requests.</li>
            </ul>
          </section>

          <section id="sharing" className="prose prose-invert max-w-none mb-8">
            <h2>3. Sharing & Third parties</h2>
            <p>
              We do not sell personal data. We may share data in the following limited situations:
            </p>
            <ul>
              <li><strong>Service Providers:</strong> Vendors that help us run the service (hosting, analytics, maps). They only receive the data necessary to perform their function.</li>
              <li><strong>Aggregated Data:</strong> We may publish aggregated or anonymized datasets for research or public benefit.</li>
              <li><strong>Legal:</strong> When required by law or to protect our rights, safety, or property.</li>
            </ul>
          </section>

          <section id="cookies" className="prose prose-invert max-w-none mb-8">
            <h2>4. Cookies & Tracking</h2>
            <p>
              We use cookies and similar technologies for essential site functionality and analytics. You can control cookie preferences through your browser settings. Note that disabling some cookies may affect functionality.
            </p>
          </section>

          <section id="security" className="prose prose-invert max-w-none mb-8">
            <h2>5. Security</h2>
            <p>
              We implement reasonable administrative, technical, and physical safeguards to protect user data. However no method of transmission over the internet is 100% secure — if you suspect a security issue, contact us immediately.
            </p>
          </section>

          <section id="retention" className="prose prose-invert max-w-none mb-8">
            <h2>6. Data retention</h2>
            <p>
              We retain personal data only as long as necessary to provide the service and comply with legal obligations. Aggregated or anonymized data may be retained indefinitely.
            </p>
          </section>

          <section id="rights" className="prose prose-invert max-w-none mb-8">
            <h2>7. Your rights</h2>
            <p>
              Depending on where you live, you may have rights to access, correct, or delete your personal data, or to restrict processing. To exercise these rights, contact us at the email below.
            </p>
          </section>

          <section id="children" className="prose prose-invert max-w-none mb-8">
            <h2>8. Children</h2>
            <p>
              Our service is not intended for children under 13. We do not knowingly collect personal data from children under 13. If you believe we have collected information about a child, please contact us.
            </p>
          </section>

          <section id="thirdparty" className="prose prose-invert max-w-none mb-8">
            <h2>9. Third-party links and services</h2>
            <p>
              Our product may contain links to third-party sites and services (maps, social logins). Those services have their own privacy practices — we encourage you to review them.
            </p>
          </section>

          <section id="contact" className="prose prose-invert max-w-none mb-8">
            <h2>10. Contact</h2>
            <p>
              For privacy questions, data requests, or concerns please email us at <a href={`mailto:${contactEmail}`} className="underline font-medium">{contactEmail}</a>.
            </p>
          </section>

          <section id="changes" className="prose prose-invert max-w-none mb-8">
            <h2>11. Changes to this policy</h2>
            <p>
              We may update this policy occasionally. When changes are significant we will provide a more prominent notice. Continued use after changes indicates acceptance.
            </p>
          </section>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-3">
              <Link to="/" className="inline-block px-4 py-2 rounded-md bg-slate-700/60 hover:bg-slate-700 text-sm font-medium">Home</Link>
              <button
                onClick={() => window.print()}
                className="inline-block px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-sm font-medium"
              >
                Print
              </button>
            </div>

            <div className="text-sm text-slate-400">Questions? Contact us at <a href={`mailto:${contactEmail}`} className="underline">{contactEmail}</a>.</div>
          </div>
        </article>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
