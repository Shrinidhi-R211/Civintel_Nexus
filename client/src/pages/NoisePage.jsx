// NoisePage.jsx (Tailwind version)
// Replace your existing NoisePage.jsx with this file.
// Requirements: TailwindCSS configured, react-leaflet & leaflet installed.

import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon (same as your previous fix)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function NoisePage() {
  // --- Measurement / audio states (kept logic)
  const [decibel, setDecibel] = useState(0);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [isTenSecondMode, setIsTenSecondMode] = useState(false);
  const [measuringSince, setMeasuringSince] = useState(null);

  // Results after measurement stops
  const [avgDb, setAvgDb] = useState(null);
  const [maxDb, setMaxDb] = useState(null);
  const [minDb, setMinDb] = useState(null);
  const [variability, setVariability] = useState(null);
  const [category, setCategory] = useState("");
  const [peakEvents, setPeakEvents] = useState([]); // [{time, db, severity}]
  const [error, setError] = useState("");

  // Timer UI
  const [timer, setTimer] = useState(0);

  // Location & address (shared)
  const [coords, setCoords] = useState([13.0827, 80.2707]);
  const [englishAddress, setEnglishAddress] = useState("Fetching location...");
  const [localAddress, setLocalAddress] = useState("");
  const [showMapModal, setShowMapModal] = useState(false);

  // Card 3 / submission states
  const [isManualMode, setIsManualMode] = useState(false);
  const [inputDb, setInputDb] = useState("");
  const [showManualForm, setShowManualForm] = useState(false);

  // Map modal search
  const [searchQuery, setSearchQuery] = useState("");

  // Audio refs & samples (kept your logic)
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const rafRef = useRef(null);
  const samplesRef = useRef([]); // collected samples: [{t: secondsFromStart, db}]
  const startTimeoutRef = useRef(null);

  // smoothing param for live display
  const SMOOTH_ALPHA = 0.33;

  // preserve original estimateDb
  const estimateDb = (volume) => {
    const minDb = 5;
    const maxDb = 150;
    const scaled = minDb + Math.log10(1 + 9 * Math.min(Math.max(volume, 0), 1)) * (maxDb - minDb);
    const val = Math.round(scaled);
    return isFinite(val) ? val : minDb;
  };

  const classifyCategory = (db) => {
    if (db <= 50) return { label: "Safe", color: "bg-green-500" };
    if (db <= 70) return { label: "Moderate", color: "bg-yellow-500" };
    if (db <= 85) return { label: "Loud", color: "bg-orange-500" };
    return { label: "Hazardous", color: "bg-red-600" };
  };

  // fetch both english and local address given lat/lon
  const fetchAddresses = async (lat, lon) => {
    try {
      const [enRes, localRes] = await Promise.all([
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`
        ),
        // Using accept-language=* is not supported; we'll attempt to fetch with the user's browser language first,
        // and then fallback to 'en'. But to request a local-language address, we can use 'accept-language' with navigator.language.
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=${encodeURIComponent(
            navigator.language || "en"
          )}`
        ),
      ]);
      const enData = await enRes.json();
      const localData = await localRes.json();
      setEnglishAddress(enData.display_name || "Unknown");
      setLocalAddress(localData.display_name || enData.display_name || "");
    } catch (err) {
      setEnglishAddress("Location error");
      setLocalAddress("");
    }
  };

  // initial geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords([latitude, longitude]);
        fetchAddresses(latitude, longitude);
      },
      () => {
        setEnglishAddress("Location unavailable");
        setLocalAddress("");
      },
      { enableHighAccuracy: true, maximumAge: 60_000, timeout: 5000 }
    );

    // cleanup on unmount
    return () => {
      stopMeasuring();
    };
    // eslint-disable-next-line
  }, []);

  // --- Audio measurement logic (kept same)
  const initAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyser);

      return true;
    } catch (err) {
      console.error("Microphone init error:", err);
      setError("Microphone access error. Check browser permissions.");
      return false;
    }
  };

  const cleanupAudio = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
    sourceRef.current = null;
  };

  const sampleLoop = (startedAt) => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const bufferLength = analyser.fftSize;
    const data = new Uint8Array(bufferLength);

    const loop = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const x = (data[i] - 128) / 128;
        sum += x * x;
      }
      const volume = Math.sqrt(sum / data.length);
      const rawDb = estimateDb(volume);

      setDecibel((prev) => {
        if (!prev || prev === 0) return rawDb;
        const sm = Math.round(SMOOTH_ALPHA * rawDb + (1 - SMOOTH_ALPHA) * prev);
        return sm;
      });

      const tSec = (Date.now() - startedAt) / 1000;
      samplesRef.current.push({ t: tSec, db: rawDb });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  };

  const analyzeSamples = (samples) => {
    if (!samples || samples.length === 0) {
      return {
        avg: null,
        max: null,
        min: null,
        variability: null,
        category: "",
        peaks: [],
      };
    }
    const dbs = samples.map((s) => s.db);
    const avg = Math.round(dbs.reduce((a, b) => a + b, 0) / dbs.length);
    const max = Math.max(...dbs);
    const min = Math.min(...dbs);
    const variabilityScore = max - min;

    const peaks = [];
    const THRESH_LOW = 80;
    const THRESH_HIGH = 100;
    let currentPeak = null;
    for (let i = 0; i < samples.length; i++) {
      const s = samples[i];
      if (s.db >= THRESH_LOW) {
        if (!currentPeak) {
          currentPeak = {
            startIdx: i,
            endIdx: i,
            maxSample: s,
          };
        } else {
          currentPeak.endIdx = i;
          if (s.db > currentPeak.maxSample.db) currentPeak.maxSample = s;
        }
      } else {
        if (currentPeak) {
          const severity = currentPeak.maxSample.db >= THRESH_HIGH ? "high" : "normal";
          peaks.push({
            time: Number(currentPeak.maxSample.t.toFixed(2)),
            db: currentPeak.maxSample.db,
            severity,
          });
          currentPeak = null;
        }
      }
    }
    if (currentPeak) {
      const severity = currentPeak.maxSample.db >= THRESH_HIGH ? "high" : "normal";
      peaks.push({
        time: Number(currentPeak.maxSample.t.toFixed(2)),
        db: currentPeak.maxSample.db,
        severity,
      });
    }

    const cat = classifyCategory(max).label;

    return {
      avg,
      max,
      min,
      variability: variabilityScore,
      category: cat,
      peaks,
    };
  };

  // --- Measurement controls (kept logic) ---
  const beginMeasurement = async ({ tenSeconds = false } = {}) => {
    setError("");
    setAvgDb(null);
    setMaxDb(null);
    setMinDb(null);
    setVariability(null);
    setCategory("");
    setPeakEvents([]);
    samplesRef.current = [];
    setTimer(0);
    setDecibel(0);

    const ok = await initAudio();
    if (!ok) return;

    const startedAt = Date.now();
    setMeasuringSince(startedAt);
    setIsMeasuring(!tenSeconds);
    setIsTenSecondMode(tenSeconds);

    sampleLoop(startedAt);

    // timer tick
    const tick = () => {
      setTimer(Math.floor((Date.now() - startedAt) / 1000));
      if ((isTenSecondModeRef.current && Date.now() - startedAt < 10000) || (!isTenSecondModeRef.current && isMeasuringRef.current)) {
        startTimeoutRef.current = setTimeout(tick, 250);
      }
    };
    isMeasuringRef.current = !tenSeconds;
    isTenSecondModeRef.current = tenSeconds;
    tick();

    if (tenSeconds) {
      if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
      startTimeoutRef.current = setTimeout(() => {
        stopMeasuring({ triggeredBy: "10s" });
      }, 10000);
    }
  };

  // refs to prevent stale closures
  const isMeasuringRef = useRef(isMeasuring);
  const isTenSecondModeRef = useRef(isTenSecondMode);
  useEffect(() => {
    isMeasuringRef.current = isMeasuring;
  }, [isMeasuring]);
  useEffect(() => {
    isTenSecondModeRef.current = isTenSecondMode;
  }, [isTenSecondMode]);

  const stopMeasuring = ({ triggeredBy = "manual" } = {}) => {
    if (startTimeoutRef.current) {
      clearTimeout(startTimeoutRef.current);
      startTimeoutRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    setIsMeasuring(false);
    setIsTenSecondMode(false);
    isMeasuringRef.current = false;
    isTenSecondModeRef.current = false;

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
    sourceRef.current = null;

    const samples = samplesRef.current.slice();
    const results = analyzeSamples(samples);

    if (results && results.avg !== null) {
      setAvgDb(results.avg);
      setMaxDb(results.max);
      setMinDb(results.min);
      setVariability(results.variability);
      setCategory(results.category);
      setPeakEvents(results.peaks);
    } else {
      setError("No samples recorded. Try again.");
    }

    setTimer(Math.floor((Date.now() - (measuringSince || Date.now())) / 1000));
    setMeasuringSince(null);
  };

  const toggleMeasure = async () => {
    if (isMeasuringRef.current) {
      stopMeasuring({ triggeredBy: "manual" });
    } else {
      await beginMeasurement({ tenSeconds: false });
    }
  };

  const startTenSeconds = async () => {
    if (isMeasuringRef.current) {
      stopMeasuring({ triggeredBy: "start-10s" });
      setTimeout(() => {
        beginMeasurement({ tenSeconds: true });
      }, 300);
    } else {
      await beginMeasurement({ tenSeconds: true });
    }
  };

  // --- Input handling for manual field (preserve validation)
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputDb(val);
    if (val === "") {
      setError("");
      return;
    }
    const num = Number(val);
    if (!isNaN(num)) {
      if (num < 5 || num > 150) setError("Enter dB between 5 and 150");
      else setError("");
    } else setError("Please enter a valid number.");
  };

  // --- Map modal & searching logic ---
  // MapModal component inside page so it can use parent's state setters
  function MapModal({ initialCoords, onClose, onConfirm }) {
    const [localCoords, setLocalCoords] = useState(initialCoords || coords);
    const [localSearch, setLocalSearch] = useState("");
    const [searching, setSearching] = useState(false);

    // Update coords when initialCoords change
    useEffect(() => {
      setLocalCoords(initialCoords || coords);
    }, [initialCoords]);

    // reverse geocode for preview inside modal
    const [previewEnglish, setPreviewEnglish] = useState("");
    const [previewLocal, setPreviewLocal] = useState("");

    const reverseGeocodePreview = async (lat, lon) => {
      try {
        const [enRes, localRes] = await Promise.all([
          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`
          ),
          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=${encodeURIComponent(
              navigator.language || "en"
            )}`
          ),
        ]);
        const enData = await enRes.json();
        const localData = await localRes.json();
        setPreviewEnglish(enData.display_name || "");
        setPreviewLocal(localData.display_name || enData.display_name || "");
      } catch {
        setPreviewEnglish("Unable to fetch address");
        setPreviewLocal("");
      }
    };

    useEffect(() => {
      reverseGeocodePreview(localCoords[0], localCoords[1]);
    }, [localCoords]);

    // search function using Nominatim
    const searchLocation = async () => {
      if (!localSearch.trim()) return;
      setSearching(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          localSearch
        )}&format=json&addressdetails=1&limit=1`;
        const res = await fetch(url);
        const data = await res.json();
        if (!data || data.length === 0) {
          alert("Location not found");
          setSearching(false);
          return;
        }
        const { lat, lon } = data[0];
        setLocalCoords([parseFloat(lat), parseFloat(lon)]);
      } catch (err) {
        console.error(err);
        alert("Search error");
      } finally {
        setSearching(false);
      }
    };

    // component to attach click-to-place marker and keep map centered when coords change
    function MapClickHandlerModal({ coords, setCoords }) {
      useMapEvents({
        click(e) {
          const { lat, lng } = e.latlng;
          setCoords([lat, lng]);
        },
      });
      return null;
    }

    // set map view on coords change
    function MapAutoCenter({ center }) {
      const map = useMap();
      useEffect(() => {
        if (center && map) {
          map.setView(center, map.getZoom());
        }
      }, [center, map]);
      return null;
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">Select Location</div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // confirm selection
                    onConfirm(localCoords, previewEnglish, previewLocal);
                  }}
                  className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Confirm location
                </button>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md outline-none"
                placeholder="Search location (city, address, place)..."
              />
              <button
                onClick={searchLocation}
                disabled={searching}
                className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          <div className="h-[420px]">
            <MapContainer
              center={localCoords}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              whenCreated={() => {}}
            >
              <MapAutoCenter center={localCoords} />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={localCoords} />
              <MapClickHandlerModal coords={localCoords} setCoords={setLocalCoords} />
            </MapContainer>
          </div>

          <div className="p-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-indigo-600">Local Address</div>
                <div className="text-sm">{previewLocal || "—"}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-indigo-600">English Address</div>
                <div className="text-sm">{previewEnglish || "—"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Map modal handlers in parent
  const handleOpenMap = () => {
    setShowMapModal(true);
  };
  const handleCloseMap = () => {
    setShowMapModal(false);
  };
  const handleConfirmMap = (newCoords, engAddr, locAddr) => {
    setCoords(newCoords);
    setEnglishAddress(engAddr || englishAddress);
    setLocalAddress(locAddr || localAddress);
    setShowMapModal(false);
  };

  // Search from the small map section (outside modal) - uses Nominatim
  const searchLocationFromCard = async () => {
    if (!searchQuery.trim()) return;
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        searchQuery
      )}&format=json&addressdetails=1&limit=1`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data || data.length === 0) {
        alert("Location not found");
        return;
      }
      const { lat, lon } = data[0];
      setCoords([parseFloat(lat), parseFloat(lon)]);
      await fetchAddresses(lat, lon);
    } catch (err) {
      console.error(err);
      alert("Search error");
    }
  };

  // --- Submission logic (stubs) ---

  // Called when user presses Submit in auto mode
  const submitAutoReading = async () => {
    if (avgDb === null) {
      alert("No measurement available to submit. Please measure first.");
      return;
    }
    const payload = {
      mode: "auto",
      timestamp: Date.now(),
      coords,
      address: englishAddress,
      localAddress,
      avgDb,
      maxDb,
      minDb,
      variability,
      peaks: peakEvents,
      durationSec: timer,
      // optionally include samplesRef.current if you want raw samples (beware size)
      // samples: samplesRef.current
    };

    // Replace the following with your API call to save into "automatic" DB
    try {
      console.log("Auto payload to send:", payload);
      // await fetch('/api/noise/auto', {method: 'POST', body: JSON.stringify(payload)})
      alert("Auto reading submitted (demo). Check console for payload.");
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    }
  };

  // Manual submission goes to a separate manual DB (Option A) — so we don't corrupt auto dataset
  const submitManualEntry = async () => {
    if (!inputDb || error) {
      setError("Please enter a valid decibel value.");
      return;
    }
    const payload = {
      mode: "manual",
      timestamp: Date.now(),
      coords,
      address: englishAddress,
      localAddress,
      manualDb: Number(inputDb),
      note: "", // optionally add a notes field from UI
    };

    try {
      console.log("Manual payload to send (manual DB):", payload);
      // await fetch('/api/noise/manual', {method:'POST', body: JSON.stringify(payload)})
      alert("Manual entry submitted (demo). Check console for payload.");
      setInputDb("");
      setShowManualForm(false);
      setIsManualMode(false);
    } catch (err) {
      console.error(err);
      alert("Manual submission failed.");
    }
  };

  // Small render helper for final results inside card 2
  const renderFinalResults = () => {
    if (avgDb === null && maxDb === null) return null;
    const catObj = classifyCategory(maxDb);
    return (
      <div className="mt-4 flex gap-4">
        <div className="flex-1 rounded-xl p-4 bg-slate-900 text-white">
          <h4 className="text-sm font-semibold">Safety Verdict</h4>
          <div className="mt-2 flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${catObj.color}`}></div>
            <div>
              <div className="font-bold text-lg">{catObj.label}</div>
              <div className="text-sm text-slate-200 mt-1">
                Peak: {maxDb} dB {peakEvents.length > 0 && <span>({peakEvents.length} peak{peakEvents.length>1?'s':''})</span>}
              </div>
            </div>
          </div>

          {peakEvents.length > 0 && (
            <div className="mt-3">
              <div className="text-sm font-semibold">Peak Events</div>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {peakEvents.map((p, idx) => (
                  <li key={idx}>
                    {p.time}s → {p.db} dB {p.severity === "high" ? "(High)" : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex-1 rounded-xl p-4 bg-white text-slate-900 shadow">
          <h4 className="text-sm font-semibold">Statistics</h4>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-500">Average</div>
              <div className="font-bold">{avgDb} dB</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Minimum</div>
              <div className="font-bold">{minDb} dB</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Peak (Max)</div>
              <div className="font-bold">{maxDb} dB</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Variability</div>
              <div className="font-bold">{variability} dB</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // unmount cleanup
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
      cleanupAudio();
    };
    // eslint-disable-next-line
  }, []);

  // --- JSX & layout (Tailwind) ---
  return (
    <div className="min-h-screen bg-[#f5f5fa] text-[#0f172a] antialiased">
      {/* HERO */}
      <section
        className="min-h-[60vh] grid place-items-center relative p-6 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=1500&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/10 pointer-events-none" />
        <div className="relative z-10 text-center w-[96%] max-w-[1100px]">
          <h1 className="text-[clamp(2.2rem,6vw,3.7rem)] font-extrabold leading-tight mb-3 drop-shadow-[0_1px_9px_#e3faff91]">
            Noise Pollution Monitoring
          </h1>
          <p className="text-[clamp(1rem,2vw,1.25rem)] font-semibold text-[#282a35] opacity-95 max-w-[860px] mx-auto">
            Silence is golden, but noise is everywhere. Monitor and take action.
          </p>
        </div>
      </section>

      {/* CARDS */}
      <section className="py-10 bg-[#f5f7fa]">
        <div className="w-[94%] max-w-[1120px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* Card 1 */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#71b7e6] to-[#9b59b6] text-white shadow-lg transform transition hover:-translate-y-1 hover:scale-[1.01]">
            <h3 className="text-xl font-bold mb-2">Noise Overview</h3>
            <p className="font-medium leading-relaxed">
              Noise pollution negatively affects human health and environmental quality. Monitoring noise levels enables timely mitigation and healthier communities.
            </p>
            <a
              className="inline-block mt-4 px-4 py-2 rounded-lg bg-white text-[#31263c] font-bold shadow"
              href="https://en.wikipedia.org/wiki/Noise_pollution"
              target="_blank"
              rel="noreferrer"
            >
              View Guide
            </a>
          </div>

          {/* Card 2 (Live Measurement) */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#f7971e] to-[#ffd200] text-[#312818] shadow-lg transform transition hover:-translate-y-1 hover:scale-[1.01]">
            <h3 className="text-xl font-bold mb-2">Live Measurement</h3>

            <div className="mt-2">
              <p className="text-2xl font-bold">
                {isMeasuring || isTenSecondMode ? (
                  <>
                    <span>{decibel}</span> dB
                    <span className="text-sm font-medium text-slate-700 ml-3"> (Measuring {timer}s)</span>
                  </>
                ) : (
                  <span>{decibel}</span>
                )}
              </p>

              <div className="flex gap-3 mt-4">
                <button onClick={toggleMeasure} className="px-4 py-2 rounded-xl font-bold bg-white text-slate-800 hover:bg-indigo-600 hover:text-white transition">
                  {isMeasuring ? "Stop" : "Measure"}
                </button>
                <button onClick={startTenSeconds} disabled={isMeasuring || isTenSecondMode} className="px-4 py-2 rounded-xl font-bold bg-white text-slate-800 hover:bg-indigo-600 hover:text-white transition disabled:opacity-50">
                  10s Measure
                </button>
              </div>

              {/* final results */}
              { (avgDb !== null || maxDb !== null) && (
                <div className="mt-4">
                  {renderFinalResults()}
                </div>
              )}
            </div>
          </div>

          {/* Card 3 (Submit Data) */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#21d4fd] to-[#b721ff] text-white shadow-lg transform transition hover:-translate-y-1 hover:scale-[1.01]">
            <h3 className="text-xl font-bold mb-2">Submit Noise Data</h3>

            {/* Location display bubbles (Option B) */}
            <div className="mt-3 space-y-3">
              <div className="bg-white/80 text-slate-900 rounded-lg p-3 drop-shadow-sm animate-fadeInUp">
                <div className="text-xs font-semibold text-indigo-600">🌐 Local Address</div>
                <div className="text-sm">{localAddress || "—"}</div>
              </div>
              <div className="bg-white/80 text-slate-900 rounded-lg p-3 drop-shadow-sm animate-fadeInUp">
                <div className="text-xs font-semibold text-indigo-600">🇬🇧 English Address</div>
                <div className="text-sm">{englishAddress || "—"}</div>
              </div>
            </div>

            {/* Auto mode compact message */}
            {!isManualMode && (
              <div className="mt-4">
                <p className="text-sm font-medium">
                  Your noise measurements have been captured automatically. Review the details above and press <span className="font-bold">Submit</span> to save them to the database.
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={submitAutoReading}
                    className="px-4 py-2 rounded-lg bg-white text-slate-900 font-bold hover:bg-indigo-600 hover:text-white transition"
                  >
                    Submit
                  </button>

                  <button
                    onClick={() => setShowMapModal(true)}
                    className="px-4 py-2 rounded-lg bg-white text-slate-900 font-bold hover:bg-indigo-600 hover:text-white transition"
                  >
                    Search Location
                  </button>

                  <button
                    onClick={() => {
                      setIsManualMode(true);
                      setShowManualForm(true);
                    }}
                    className="px-3 py-2 rounded-lg bg-white/30 border border-white/40 text-white font-semibold hover:bg-white/50 transition"
                  >
                    Manual
                  </button>
                </div>
              </div>
            )}

            {/* Manual mode (revealed) */}
            {isManualMode && (
              <div className="mt-4">
                <p className="text-sm mb-2">Enter noise level manually (not recommended).</p>
                <input
                  type="text"
                  value={inputDb}
                  onChange={handleInputChange}
                  placeholder="Enter dB"
                  className="w-full px-3 py-2 rounded-lg text-slate-900 font-semibold outline-none"
                />
                {error && <div className="text-red-500 font-semibold mt-2">{error}</div>}

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={submitManualEntry}
                    className="px-4 py-2 rounded-lg bg-white text-slate-900 font-bold hover:bg-indigo-600 hover:text-white transition"
                  >
                    Submit Manual
                  </button>
                  <button
                    onClick={() => {
                      setIsManualMode(false);
                      setShowManualForm(false);
                      setInputDb("");
                      setError("");
                    }}
                    className="px-4 py-2 rounded-lg bg-white/30 border border-white/40 text-white font-semibold hover:bg-white/50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowMapModal(true)}
                    className="px-4 py-2 rounded-lg bg-white text-slate-900 font-bold hover:bg-indigo-600 hover:text-white transition"
                  >
                    Search Location
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#fcb69f] to-[#ff6e7f] text-white shadow-lg transform transition hover:-translate-y-1 hover:scale-[1.01]">
            <h3 className="text-xl font-bold mb-2">AI Prediction</h3>
            <p className="text-sm">
              Our AI model forecasts noise pollution trends using environmental data, urban activity patterns, and past readings. Future updates will bring improved accuracy for your location.
            </p>
            <a className="inline-block mt-4 text-sm underline font-semibold" href="https://www.epa.gov/noise-pollution" target="_blank" rel="noreferrer">
              Data source: EPA Noise Pollution Data
            </a>
          </div>
        </div>
      </section>

      {/* Map modal */}
      {showMapModal && (
        <MapModal
          initialCoords={coords}
          onClose={handleCloseMap}
          onConfirm={handleConfirmMap}
        />
      )}

      {/* CONCLUSION */}
      <section className="text-center py-12 bg-gradient-to-b from-[#ebf0fa] to-[#e0e3e5] border-t border-white/20">
        <h2 className="text-2xl font-bold">Conclusion</h2>
        <p className="mt-4 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#9b59b6] to-[#71b7e6]">
          Noise pollution is everywhere, but awareness and measurement empower us to act. Use this platform to track, learn, and reduce noise in your surroundings.
        </p>
      </section>

      {/* Tailwind animation util classes (requires config) */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.45s ease-out both; }
      `}</style>
    </div>
  );
}
