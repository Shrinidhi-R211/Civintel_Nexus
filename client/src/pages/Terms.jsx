import React from "react";
import { Link } from "react-router-dom";

// Advanced, premium-grade Terms & Conditions Page
// Fully redesigned with cinematic gradients, glass morphism, 3D depth, layered shadows,
// neon-edge borders, section dividers, floating elements, and scroll-based elegance.
// TailwindCSS ONLY.

const TermsAndConditions = ({ projectName = "SmartEnvMonitor", contactEmail = "support@smartenvmonitor.example" }) => {
  const lastUpdated = "November 21, 2025";

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#06070d] text-slate-100">
      {/* Animated Background Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.35),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(56,189,248,0.25),transparent_60%)] animate-pulse-slow blur-3xl"></div>

      {/* Decorative Layered Shapes */}
      <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-indigo-600/20 blur-3xl animate-float-slow"></div>
      <div className="absolute top-1/2 right-0 w-[22rem] h-[22rem] rounded-full bg-cyan-500/10 blur-2xl animate-float-medium"></div>

      {/* Content Container */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:px-12 lg:px-20">

        {/* Header Card */}
        <div className="mb-16 rounded-3xl bg-white/5 backdrop-blur-xl p-10 shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-white/10 hover:shadow-[0_0_35px_rgba(0,0,0,0.5)] transition-all duration-500">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
            Terms & Conditions
          </h1>
          <p className="text-slate-300 mt-3 text-base md:text-lg">
            A detailed overview of your rights, responsibilities, and legal boundaries while using {projectName}.
          </p>
          <p className="text-sm text-slate-500 mt-4">Last updated: {lastUpdated}</p>
        </div>

        {/* Main Content */}
        <div className="space-y-20">

          {/* Section Block */}
          <div className="group relative rounded-3xl bg-white/5 backdrop-blur-xl p-10 border border-white/10 shadow-xl hover:shadow-3xl transition-all duration-500 hover:bg-white/10 hover:border-indigo-400/30">
            <h2 className="text-3xl font-semibold text-indigo-300 mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed text-slate-200">
              By using {projectName}, you acknowledge that you have read, understood, and agreed to abide by all terms stated herein. If you do not agree, you must discontinue use immediately.
            </p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-40"></div>
          </div>

          {/* Section Block */}
          <div className="group relative rounded-3xl bg-white/5 backdrop-blur-xl p-10 border border-white/10 shadow-xl hover:shadow-3xl hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-500">
            <h2 className="text-3xl font-semibold text-cyan-300 mb-4">2. Scope of Service</h2>
            <p className="leading-relaxed text-slate-200">
              {projectName} provides tools including live noise measurement, AQI analytics, environmental prediction UI, geolocation-based mapping, and user-submitted environmental data processing.
              The platform evolves continuously, and features may be added, removed, or modified.
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-1 text-slate-300">
              <li>Map-based geolocation utilities</li>
              <li>Interactive graphical analytics</li>
              <li>AI-driven environmental insights</li>
              <li>Noise and AQI monitoring capabilities</li>
            </ul>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40"></div>
          </div>

          {/* Section Block */}
          <div className="group relative rounded-3xl bg-white/5 backdrop-blur-xl p-10 border border-white/10 hover:bg-white/10 hover:border-purple-400/30 shadow-xl hover:shadow-3xl transition-all duration-500">
            <h2 className="text-3xl font-semibold text-purple-300 mb-4">3. User Conduct</h2>
            <p className="leading-relaxed text-slate-200">
              You agree not to misuse the service or engage in activities that may harm the system, other users, or the platform's data integrity.
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-1 text-slate-300">
              <li>No reverse-engineering, bypassing security, or hacking.</li>
              <li>No large-scale scraping or automated harvesting.</li>
              <li>No submitting fabricated or harmful data.</li>
              <li>No attempts to disrupt server operations.</li>
            </ul>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-40"></div>
          </div>

          {/* Section Block */}
          <div className="group relative rounded-3xl bg-white/5 backdrop-blur-xl p-10 border border-white/10 hover:bg-white/10 hover:border-emerald-400/30 shadow-xl hover:shadow-3xl transition-all duration-500">
            <h2 className="text-3xl font-semibold text-emerald-300 mb-4">4. Data & Environmental Submissions</h2>
            <p className="leading-relaxed text-slate-200">
              Environmental data such as noise levels and locations may be stored, aggregated, and analyzed. By submitting data, you grant a non-exclusive license for improvement, research, and predictive model development.
            </p>
          </div>

          {/* Section Block */}
          <div className="group relative rounded-3xl bg-white/5 backdrop-blur-xl p-10 border border-white/10 hover:bg-white/10 hover:border-rose-400/30 shadow-xl hover:shadow-3xl transition-all duration-500">
            <h2 className="text-3xl font-semibold text-rose-300 mb-4">5. Limitations of Liability</h2>
            <p className="leading-relaxed text-slate-200 mb-4">
              {projectName} is not responsible for damages caused by
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-300">
              <li>Inaccurate or delayed environmental readings</li>
              <li>System outages or maintenance downtime</li>
              <li>Interruption from third-party service failures</li>
              <li>Unauthorized access or account misuse</li>
            </ul>
          </div>

          {/* Section Block */}
          <div className="group relative rounded-3xl bg-white/5 backdrop-blur-xl p-10 border border-white/10 hover:bg-white/10 hover:border-yellow-400/30 shadow-xl hover:shadow-3xl transition-all duration-500">
            <h2 className="text-3xl font-semibold text-yellow-300 mb-4">6. Contact & Legal Requests</h2>
            <p className="leading-relaxed text-slate-200">
              For legal queries, concerns, takedown requests, or account deletion, contact us at:
            </p>
            <p className="mt-3 font-medium text-yellow-200 underline">{contactEmail}</p>
          </div>
        </div>

        {/* Bottom Action Row */}
        <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md"
          >
            Return Home
          </Link>

          <button
            onClick={() => window.print()}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Print Document
          </button>
        </div>
      </section>
    </main>
  );
};

export default TermsAndConditions;