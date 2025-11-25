// AiPredictionPage.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import logo from './images/civintel_nexus_logo.png'; // update with your actual logo path
import { FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
} from "chart.js";
import { Line, Bar, Radar } from "react-chartjs-2";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AIResponseModal from "../modals/AIResponseModal";

/* ---------- ChartJS register ---------- */
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
);

/* ---------- Leaflet icon fix for bundlers ---------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

/* ---------- Helpers: math & date ---------- */

// Ordinary least squares regression
function linearRegression(xs, ys) {
  const n = xs.length;
  if (n === 0) return { slope: 0, intercept: 0 };
  const xMean = xs.reduce((a, b) => a + b, 0) / n;
  const yMean = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0,
    den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - xMean) * (ys[i] - yMean);
    den += (xs[i] - xMean) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = yMean - slope * xMean;
  return { slope, intercept };
}

// Convert array of timestamp strings/Date to numeric milliseconds.
// Accepts ISO or common formats (we normalize earlier), but new Date should work with ISO.
function toNumericTimes(tsArray) {
  return tsArray.map((t) => {
    const d = new Date(t);
    return d.getTime();
  });
}

// Predict future points via regression; returns ISO timestamps + value
function predictNextPoints(timestamps, values, numFuture = 3) {
  if (!timestamps.length || !values.length) return [];
  const xs = toNumericTimes(timestamps);
  const { slope, intercept } = linearRegression(xs, values);

  // average spacing (ms)
  let intervals = [];
  for (let i = 1; i < xs.length; i++) intervals.push(xs[i] - xs[i - 1]);
  const avgInterval = intervals.length ? intervals.reduce((a, b) => a + b, 0) / intervals.length : 3600 * 1000;
  const lastX = xs[xs.length - 1];

  const result = [];
  for (let i = 1; i <= numFuture; i++) {
    const nextX = lastX + avgInterval * i;
    const predVal = slope * nextX + intercept;
    result.push({ timestamp: new Date(nextX).toISOString(), value: Math.round(predVal * 10) / 10 });
  }
  return result;
}

// Rolling average (not used heavily now but available)
function rollingAverage(values, window = 3) {
  if (!values.length) return null;
  const res = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1);
    res.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return res;
}

/* ---------- Date formatting helpers ---------- */

// Format ISO timestamp to "DD-MM-YYYY HH:mm" for display
function formatLabelFromISO(isoString) {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString; // fallback
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

// Try to parse dd-mm-yyyy or dd-mm-yyyy hh:mm and return ISO string
function parsePossiblyFormattedTimestamp(ts) {
  // If it's already ISO or parseable, just return new Date().toISOString()
  const d = new Date(ts);
  if (!isNaN(d.getTime())) return d.toISOString();

  // Try dd-mm-yyyy or dd-mm-yyyy hh:mm
  const match = String(ts).match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})(?:[ T](\d{1,2}):(\d{1,2}))?$/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);
    const hours = Number(match[4] ?? 0);
    const minutes = Number(match[5] ?? 0);
    const dt = new Date(year, month, day, hours, minutes);
    if (!isNaN(dt.getTime())) return dt.toISOString();
  }

  // fallback to current time ISO
  return new Date().toISOString();
}

/* ---------- Color helpers ---------- */
function hexToRgba(hex, alpha = 1) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Shade hex by additive 'amount' (-100..100). Returns valid 6-char hex.
function shadeHex(hex, amount = -20) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/* ---------- Small map components ---------- */

// Flies map to coords and renders marker
function FlyToMarker({ coords, zoom = 13 }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (!coords || !map) return;
    try {
      map.flyTo([coords.lat, coords.lon], zoom, { duration: 0.9 });
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);
  return coords ? <Marker position={[coords.lat, coords.lon]} /> : null;
}

// Listens for clicks and calls setMarker with latlng
function MapClickToPlace({ setMarker }) {
  useMapEvents({
    click(e) {
      setMarker(e.latlng);
    },
  });
  return null;
}

/* ---------- Main component ---------- */
export default function AiPredictionPage() {
  // state
  const [loc, setLoc] = useState({ lat: 13.0827, lon: 80.2707, name: "Unknown" });
  const [noiseHistory, setNoiseHistory] = useState([]); // {value, timestamp: ISO}
  const [airHistory, setAirHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [binfo,setbinfo]=useState('')

  const [activeNoiseChart, setActiveNoiseChart] = useState("line");
  const [activeAirChart, setActiveAirChart] = useState("line");

  const [noisePred, setNoisePred] = useState([]);
  const [airPred, setAirPred] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);
  const [noiseSummary, setNoiseSummary] = useState({id:'noise'});
  const [airSummary, setAirSummary] = useState({id:'air'});

  const [mapOpen, setMapOpen] = useState(false);
  const [mapSearch, setMapSearch] = useState("");
  const [mapMarker, setMapMarker] = useState(null);
  const mapRef = useRef(null);

  /* ----------------- On mount: geolocation then fetchHistories ----------------- */
  useEffect(() => {
    setLoading(true);
    let cancelled = false;

    async function init() {
      try {
        // Preferred flow: if geolocation available, use it and immediately fetch histories for that position.
        if (navigator.geolocation) {
          await new Promise((resolve) =>
            navigator.geolocation.getCurrentPosition(
              (p) => {
                const { latitude, longitude } = p.coords;
                setLoc({ lat: latitude, lon: longitude, name: "Current location" });
                // fetch histories immediately with these coords (avoid stale closure)
                fetchHistories(latitude, longitude);
                resolve();
              },
              () => {
                // if user denies or error, fetch with fallback loc
                fetchHistories(loc.lat, loc.lon);
                resolve();
              },
              { enableHighAccuracy: true }
            )
          );
        } else {
          // no geolocation => fetch with fallback loc
          await fetchHistories(loc.lat, loc.lon);
        }
      } catch (err) {
        console.error("init error:", err);
        // fallback mocks
        setNoiseHistory(generateMockSeries(12, 60, 5));
        setAirHistory(generateMockSeries(12, 90, 10));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ----------------- Fetch histories (backend) ----------------- */
  async function fetchHistories(lat, lon) {
    try {
      const [noiseRes, airRes] = await Promise.allSettled([
        axios.get("/api/noise-data", { params: { lat, lon } }),
        axios.get("/api/air-data", { params: { lat, lon } }),
      ]);

      if (noiseRes.status === "fulfilled" && Array.isArray(noiseRes.value.data) && noiseRes.value.data.length) {
        setNoiseHistory(normalizeSeries(noiseRes.value.data));
      } else {
        setNoiseHistory(generateMockSeries(12, 65, 6));
      }

      if (airRes.status === "fulfilled" && Array.isArray(airRes.value.data) && airRes.value.data.length) {
        setAirHistory(normalizeSeries(airRes.value.data));
      } else {
        setAirHistory(generateMockSeries(12, 110, 12));
      }
    } catch (err) {
      console.error("fetchHistories error:", err);
      setNoiseHistory(generateMockSeries(12, 65, 6));
      setAirHistory(generateMockSeries(12, 110, 12));
    }
  }

  /* ----------------- normalize backend series ----------------- */
  function normalizeSeries(arr) {
    // unify any backend shape into { value: number, timestamp: ISO-string }
    return arr
      .map((d) => {
        const value = d.value ?? d.aqi ?? d.db ?? d.decibel ?? d.pm25 ?? d.pm10 ?? null;
        const rawTs = d.timestamp ?? d.time ?? d.createdAt ?? new Date().toISOString();
        const isoTs = parsePossiblyFormattedTimestamp(rawTs);
        return { value: Number(value), timestamp: isoTs };
      })
      .filter((d) => typeof d.value === "number" && !Number.isNaN(d.value))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  /* ----------------- generateMockSeries (returns ISO timestamps) ----------------- */
  function generateMockSeries(points = 12, baseline = 70, variance = 6) {
    const now = Date.now();
    const arr = [];
    for (let i = points - 1; i >= 0; i--) {
      const dt = new Date(now - i * 60 * 60 * 1000); // hourly series
      const jitter = (Math.sin(i / 2) + Math.random() * 0.8) * variance;
      const iso = dt.toISOString(); // store ISO for safe parsing
      arr.push({ value: Math.round((baseline + jitter) * 10) / 10, timestamp: iso });
    }
    return arr;
  }

  /* ----------------- compute predictions when histories change ----------------- */
  useEffect(() => {
    if (noiseHistory.length) {
      const timestamps = noiseHistory.map((d) => d.timestamp);
      const values = noiseHistory.map((d) => d.value);
      const preds = predictNextPoints(timestamps, values, 3);
      setNoisePred(preds);
      setNoiseSummary(makeSummary(values, preds));
    }
  }, []);

  useEffect(() => {
    if (airHistory.length) {
      const timestamps = airHistory.map((d) => d.timestamp);
      const values = airHistory.map((d) => d.value);
      const preds = predictNextPoints(timestamps, values, 3);
      setAirPred(preds);
      setAirSummary(makeSummary(values, preds));
    }
  }, []);

  function makeSummary(values, preds) {
    const latest = values[values.length - 1];
    const avg = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
    const trend = preds.length
      ? preds[preds.length - 1].value > latest
        ? "increasing"
        : preds[preds.length - 1].value < latest
        ? "decreasing"
        : "stable"
      : "stable";
    return { latest, avg, trend, predicted: preds };
  }

  /* ----------------- Chart payload builder ----------------- */
  function buildChartPayload(history, preds, chartType = "line", label = "Value", color = "#6D28D9") {
    // labels displayed should be formatted friendly labels (DD-MM-YYYY HH:mm)
    const labels = history.map((d) => formatLabelFromISO(d.timestamp));
    const histValues = history.map((d) => d.value);
    const predLabels = preds.map((p) => formatLabelFromISO(p.timestamp));
    const predValues = preds.map((p) => p.value);

    const allLabels = [...labels, ...predLabels];
    const histDataset = [...histValues, ...Array(predValues.length).fill(null)];
    const predDataset = [...Array(histValues.length).fill(null), ...predValues];

    const base = {
      labels: allLabels,
      datasets: [
        {
          label: label + " (observed)",
          data: histDataset,
          borderColor: color,
          backgroundColor: hexToRgba(color, 0.12),
          tension: chartType === "smooth" ? 0.6 : 0.2,
          fill: chartType === "area",
          pointRadius: 3,
        },
        {
          label: label + " (predicted)",
          data: predDataset,
          borderDash: [6, 6],
          borderColor: shadeHex(color, -30),
          backgroundColor: hexToRgba(shadeHex(color, -30), 0.08),
          tension: chartType === "smooth" ? 0.6 : 0.2,
          fill: false,
          pointStyle: "rectRot",
          pointRadius: 4,
        },
      ],
    };

    if (chartType === "radar") {
      const radarLabels = allLabels.slice(-8);
      const radarDataHist = history.slice(-radarLabels.length).map((d) => d.value);
      const radPreds = preds.slice(0, Math.max(0, radarLabels.length - radarDataHist.length)).map((p) => p.value);
      const radarAll = [...radarDataHist, ...radPreds];
      return {
        labels: radarLabels,
        datasets: [
          { label: "Observed", data: radarDataHist, borderColor: color, backgroundColor: hexToRgba(color, 0.14) },
          {
            label: "Predicted",
            data: radarAll.map((v, i) => (i < radarDataHist.length ? null : v)).map((v) => (v === undefined ? null : v)),
            borderColor: shadeHex(color, -30),
            backgroundColor: hexToRgba(shadeHex(color, -30), 0.08),
          },
        ],
      };
    }

    return base;
  }

  /* ----------------- Chart renderer ----------------- */
  function ChartRenderer({ chartType, payload, label, color }) {
    if (!payload) return null;
    const commonOpts = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        tooltip: { mode: "index", intersect: false },
      },
      interaction: { mode: "index", intersect: false },
    };

    if (chartType === "bar") return <Bar data={payload} options={{ ...commonOpts }} />;
    if (chartType === "radar")
      return <Radar data={payload} options={{ ...commonOpts, scales: { r: { beginAtZero: true } } }} />;
    return (
      <Line
        data={payload}
        options={{
          ...commonOpts,
          elements: { line: { tension: payload.datasets?.[0]?.tension ?? 0.2 } },
        }}
      />
    );
  }

  /* ----------------- Map search (Nominatim) ----------------- */
  async function handleMapSearch() {
    if (!mapSearch.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearch)}&limit=1`
      );
      const arr = await res.json();
      if (!arr || !arr.length) return;
      const first = arr[0];
      const lat = parseFloat(first.lat);
      const lon = parseFloat(first.lon);
      const name = first.display_name;
      const marker = { lat, lon, name };
      setMapMarker(marker);
      setLoc({ lat, lon, name });
      await fetchHistories(lat, lon);
      // ensure mapRef flies if exist
      if (mapRef.current) {
        try {
          mapRef.current.flyTo([lat, lon], 13, { duration: 0.9 });
        } catch (e) {}
      }
    } catch (err) {
      console.error("geocode error", err);
    }
  }

  // store created map instance
  function onMapCreated(mapInstance) {
    mapRef.current = mapInstance;
  }

  // when mapMarker changes and mapRef available, fly to it
  useEffect(() => {
    if (mapMarker && mapRef.current) {
      try {
        mapRef.current.flyTo([mapMarker.lat, mapMarker.lon], 13, { duration: 0.9 });
      } catch (e) {}
    }
  }, [mapMarker]);

  /* ----------------- Prediction card component (local menu state) ----------------- */
  function PredictionCard({ title, history, preds, activeChart, setActiveChart, color, summary, onOpenMap }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const payload = buildChartPayload(history, preds, activeChart, title, color);

    const sendinfo = async (info, title) => {
  console.log(info, title);

  const url =
    title === "Noise Prediction (dB)"
      ? "http://localhost:5000/noiseanalyzer"
      : "http://localhost:5000/airanalyzer";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    });

    const data = await res.json(); // FIXED ✔✔✔
    console.log("Server Response:", data);
    setbinfo(data.text);
  } catch (err) {
    console.error("Error sending info:", err);
  }
};

    


    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 12, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 relative overflow-hidden"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 mt-1">
              Location: <span className="font-semibold">{loc.name ?? `${loc.lat.toFixed(3)}, ${loc.lon.toFixed(3)}`}</span>
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen((s) => !s)}
              aria-label="chart switcher"
              className="p-2 rounded-md bg-white shadow-sm border border-slate-100 hover:scale-105 transition"
            >
              ☰
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-slate-200 z-50">
                {["line", "bar", "area", "smooth", "radar"].map((opt) => (
                  <button
                    key={opt}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                    onClick={() => {
                      setActiveChart(opt);
                      setIsMenuOpen(false);
                    }}
                  >
                    {opt === "line" && "Line"}
                    {opt === "bar" && "Bar"}
                    {opt === "area" && "Area"}
                    {opt === "smooth" && "Smooth Curve"}
                    {opt === "radar" && "Radar"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 h-64 md:h-72 rounded-lg p-2 bg-gradient-to-b from-white/60 to-white/30 border border-slate-100">
          <ChartRenderer chartType={activeChart} payload={payload} label={title} color={color} />
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-slate-600">
              Latest: <span className="font-bold text-slate-800">{summary.latest ?? "-"}</span>
            </div>
            <div className="text-slate-500 text-sm">
              Avg: <span className="font-semibold">{summary.avg ?? "-"}</span> | Trend: <span className="capitalize">{summary.trend ?? "-"}</span>
            </div>
            <div className="text-slate-500 text-xs mt-1">
              Predicted (next {summary.predicted?.length ?? 0}): {summary.predicted?.map((p) => p.value).join(", ") ?? "-"}
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold shadow" onClick={() => onOpenMap(true)}>
              Select Location
            </button>
            <button
              className="px-4 py-2 rounded-full border border-slate-200 bg-white font-semibold hover:bg-slate-50"
              onClick={()=>(sendinfo(summary,title),setIsModalOpen(true))}
            >
              AI analyzer
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  

  /* ----------------- main render ----------------- */
  return (
    <div className="min-h-screen mt-20 bg-[linear-gradient(135deg,#f5f7fb,_#eef2ff)] p-6 md:p-10 font-sans text-slate-900">
      <header className="max-w-6xl mx-auto text-center mb-8">
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-4xl md:text-5xl font-extrabold">
          AI Predictions — Noise & Air
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }} className="mt-3 text-slate-600 max-w-2xl mx-auto">
          Localized trend analysis and short-term forecasts driven by statistical extrapolation and rolling analysis. Select chart styles per card to visualize results.
        </motion.p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <PredictionCard
          title="Noise Prediction (dB)"
          history={noiseHistory}
          preds={noisePred}
          activeChart={activeNoiseChart}
          setActiveChart={setActiveNoiseChart}
          color="#7c3aed"
          summary={noiseSummary}
          onOpenMap={() => setMapOpen(true)}
        />

        <PredictionCard
          title="Air Prediction (AQI / PM2.5 proxy)"
          history={airHistory}
          preds={airPred}
          activeChart={activeAirChart}
          setActiveChart={setActiveAirChart}
          color="#0ea5e9"
          summary={airSummary}
          onOpenMap={() => setMapOpen(true)}
        />
      </main>

      <section className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white/70 p-6 rounded-2xl shadow">
          <h3 className="text-lg font-bold mb-4">Advantages</h3>
          <ul className="space-y-3 text-slate-600">
            <li className="flex gap-3 items-start">
              <span className="w-3 h-3 rounded-full bg-gradient-to-b from-indigo-500 to-sky-400 inline-block mt-2" /> Localized predictions & trend insights
            </li>
            <li className="flex gap-3 items-start">
              <span className="w-3 h-3 rounded-full bg-gradient-to-b from-indigo-500 to-sky-400 inline-block mt-2" /> Multiple chart styles for design & analysis
            </li>
            <li className="flex gap-3 items-start">
              <span className="w-3 h-3 rounded-full bg-gradient-to-b from-indigo-500 to-sky-400 inline-block mt-2" /> Responsive map modal with geocoded search
            </li>
          </ul>
        </div>

        <div className="bg-white/70 p-6 rounded-2xl shadow">
          <h3 className="text-lg font-bold mb-4">Disadvantages / Limitations</h3>
          <ul className="space-y-3 text-slate-600">
            <li>Predictions are simulated client-side (statistical extrapolation). Replace with ML model for production.</li>
            <li>Data quality depends on backend history granularity and accuracy.</li>
            <li>Radar & area charts may render differently depending on data density.</li>
          </ul>
        </div>
      </section>

      <footer className="bg-slate-300  text-slate-700 py-10 px-6 rounded-xl">
  <div className="max-w-6xl mx-auto flex lg:flex-row md:flex-row md:justify-between gap-10">
    
    {/* About Section */}
    <div className="flex-1 space-y-4">
      <img
        src={logo} // make sure logo is imported
        alt="Civintel Nexus Logo"
        className="h-12 w-auto object-contain"
      />
      <p className="text-black font-semibold leading-relaxed">
        Civintel Nexus — environmental intelligence for healthier communities.
      </p>
    </div>

    {/* Contact Section */}
    <div className="flex-1 space-y-4">
      <h3 className="text-2xl font-extrabold text-gray-500">Contact Us</h3>
      <p className="text-slate-700 text-sm">
        <strong>Email:</strong> <a href="contact@civintelnexus.com"> contact@civintelnexus.com</a>
      </p>
      <p className="text-slate-700 text-sm">
        <strong>Phone:</strong> +91 87489 24512
      </p>

      <div className="flex gap-4 mt-2">
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="p-2 rounded-full bg-pink-500 hover:bg-slate-300 transition-colors flex items-center justify-center"
        >
          <FaInstagram
    size={40}
    className="transition-all duration-300 group-hover:fill-gradientInstagram"
    style={{
      fill: "white", // default color
    }}
    onMouseEnter={e =>
      (e.currentTarget.style.fill =
        "url(#instagramGradient)")
    }
    onMouseLeave={e => (e.currentTarget.style.fill = "white")}
  />
  <svg width="0" height="0">
    <defs>
      <linearGradient id="instagramGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f58529" />
        <stop offset="50%" stopColor="#dd2a7b" />
        <stop offset="100%" stopColor="#8134af" />
      </linearGradient>
    </defs>
  </svg>
        </a>
        <a
          href="https://twitter.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="p-2 rounded-full bg-sky-300 hover:bg-slate-300 transition-colors"
        >
          <FaTwitter
      size={40}
      className="transition-all duration-300"
      style={{ fill: "white" }}
      onMouseEnter={e => (e.currentTarget.style.fill = "url(#twitterGradient)")}
      onMouseLeave={e => (e.currentTarget.style.fill = "white")}
    />
    <svg width="0" height="0">
      <defs>
        <linearGradient id="twitterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1DA1F2" />
          <stop offset="50%" stopColor="#0d8ddb" />
          <stop offset="100%" stopColor="#0a74c2" />
        </linearGradient>
      </defs>
    </svg>
        </a>
        <a
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="p-2 rounded-full bg-blue-400 hover:bg-slate-300 transition-colors"
        >
          <FaLinkedin
      size={40}
      className="transition-all duration-300"
      style={{ fill: "white" }}
      onMouseEnter={e => (e.currentTarget.style.fill = "url(#linkedinGradient)")}
      onMouseLeave={e => (e.currentTarget.style.fill = "white")}
    />
    <svg width="0" height="0">
      <defs>
        <linearGradient id="linkedinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0077b5" />
          <stop offset="50%" stopColor="#005f93" />
          <stop offset="100%" stopColor="#004970" />
        </linearGradient>
      </defs>
    </svg>
        </a>
      </div>
    </div>

    {/* Links Section */}
    <div className="flex-1 flex flex-col justify-between">
      <div className="flex flex-col gap-2 text-slate-500">
        <a href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
        <a href="/terms" className="hover:text-slate-900 transition-colors">Terms</a>
      </div>
    </div>
  </div>

  {/* Copyright */}
  <div className="mt-10 border-t border-slate-700 pt-4 text-center text-slate-400 text-sm">
    © {new Date().getFullYear()} Civintel Nexus. All rights reserved.
  </div>
</footer>

   <AIResponseModal open={isModalOpen} onClose={()=>setIsModalOpen(false)} binfo={binfo}>

          </AIResponseModal>

      {/* Map Modal */}
      {mapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMapOpen(false)}></div>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-60 w-full max-w-4xl h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute top-4 left-4 z-30">
              <button onClick={() => setMapOpen(false)} className="px-3 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-bold shadow-lg">← Back</button>
            </div>

            <div className="flex flex-col md:flex-row h-full">
              <div className="flex-1 h-64 md:h-auto">
                <MapContainer whenCreated={onMapCreated} center={[loc.lat, loc.lon]} zoom={11} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {mapMarker && <FlyToMarker coords={mapMarker} zoom={13} />}
                  <MapClickToPlace setMarker={(latlng) => {
                    const marker = { lat: latlng.lat, lon: latlng.lng, name: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}` };
                    setMapMarker(marker);
                    setLoc({ lat: marker.lat, lon: marker.lon, name: marker.name });
                  }} />
                </MapContainer>
              </div>

              <div className="w-full md:w-96 bg-white p-4 border-l border-slate-100 overflow-y-auto">
                <div className="mb-4">
                  <label className="text-sm font-medium text-slate-700">Search location</label>
                  <div className="flex gap-2 mt-2">
                    <input value={mapSearch} onChange={(e) => setMapSearch(e.target.value)} placeholder="Type address or place" className="flex-1 px-3 py-2 border rounded-md outline-none" />
                    <button onClick={handleMapSearch} className="px-3 py-2 rounded-md bg-sky-600 text-white font-semibold">Go</button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Search uses Nominatim (OpenStreetMap)</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold">Current Marker</h4>
                  {mapMarker ? (
                    <div className="mt-2 text-sm text-slate-700">
                      <div className="font-medium">{mapMarker.name}</div>
                      <div className="text-xs text-slate-500">{mapMarker.lat.toFixed(5)}, {mapMarker.lon.toFixed(5)}</div>
                      <div className="mt-3 flex gap-2">
                        <button className="px-3 py-2 rounded-md bg-indigo-600 text-white" onClick={() => { setLoc({ lat: mapMarker.lat, lon: mapMarker.lon, name: mapMarker.name }); setMapOpen(false); fetchHistories(mapMarker.lat, mapMarker.lon); }}>
                          Use location
                        </button>
                        <button className="px-3 py-2 rounded-md border" onClick={() => { setMapMarker(null); }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 mt-2">No marker yet. Use the search or click on the map to set a marker.</div>
                  )}
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold">Tips</h4>
                  <ul className="mt-2 text-sm text-slate-600 space-y-2">
                    <li>Search - marker will auto-place and map will zoom in.</li>
                    <li>Click anywhere on the map to drop a marker manually.</li>
                    <li>Press "Use location" to close modal and update predictions for that spot.</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
