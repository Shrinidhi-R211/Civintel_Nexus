import React, { useState, useEffect, useRef } from "react";
import styles from "./AirPage.module.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Keyboard,
  Mousewheel,
  EffectCreative,
} from "swiper/modules";
import "swiper/css";
import 'swiper/css/effect-creative';
import "swiper/css/navigation";
import "swiper/css/pagination";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [35, 35],
});

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

const AirPage = () => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [coords, setCoords] = useState({ lat: 12.9716, lon: 77.5946 });
  const [address, setAddress] = useState("Fetching...");
  const [aqi, setAqi] = useState(0);
  const [aqiCategory, setAqiCategory] = useState("");
  const [pm25, setPm25] = useState(0);
  const [pm10, setPm10] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "AQI Over Last 7 Days",
        data: [],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.3)",
        tension: 0.3,
      },
    ],
  });

  // Fetch geolocation and AQI
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lon: longitude });
          await fetchLiveAQI(latitude, longitude);
          fetchAddress(latitude, longitude);
          sendDataToBackend(latitude, longitude);
        },
        (err) => console.warn("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/air-data/trend", {
          params: { lat: coords.lat, lon: coords.lon },
        });

        if (res.data && res.data.length > 0) {
          const dailyData = {};
          res.data.forEach((d) => {
            const date = new Date(d.timestamp).toLocaleDateString();
            if (!dailyData[date]) dailyData[date] = { sum: d.aqi, count: 1 };
            else {
              dailyData[date].sum += d.aqi;
              dailyData[date].count += 1;
            }
          });
          let labels = Object.keys(dailyData).sort((a, b) => new Date(a) - new Date(b));
          if (labels.length > 7) labels = labels.slice(-7);
          const data = labels.map((date) => Math.round(dailyData[date].sum / dailyData[date].count));
          setChartData({
            labels,
            datasets: [
              {
                label: "AQI Over Last 7 Days",
                data,
                borderColor: "#2563eb",
                backgroundColor: "rgba(37, 99, 235, 0.3)",
                tension: 0.3,
              },
            ],
          });
        }
      } catch (err) {
        console.error("Trend fetch error:", err);
      }
    };
    fetchTrend();
  }, [coords]);

  const fetchLiveAQI = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=c590a4444f4b23d540a145db0d5d1bc9`
      );
      const data = await res.json();
      if (data && data.list && data.list.length > 0) {
        const aqiValue = data.list[0].main.aqi;
        const aqiMap = [0, 50, 100, 150, 200, 300];
        const categories = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
        setAqi(aqiMap[aqiValue]);
        setAqiCategory(categories[aqiValue - 1]);
        setPm25(data.list[0].components.pm2_5);
        setPm10(data.list[0].components.pm10);
      }
    } catch (err) {
      console.error("AQI fetch error:", err);
    }
  };

  const fetchAddress = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`
      );
      const data = await res.json();
      if (data && data.display_name) setAddress(data.display_name);
    } catch {
      setAddress("Unable to fetch address");
    }
  };

  const sendDataToBackend = async (lat, lon) => {
    try {
      await axios.post("http://localhost:5000/api/air-data", {
        lat,
        lon,
        address,
        aqi,
        category: aqiCategory,
        pm25,
        pm10,
      });
    } catch (err) {
      console.error("Backend error:", err);
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setCoords({ lat: parseFloat(lat), lon: parseFloat(lon) });
        setAddress(display_name);
        await fetchLiveAQI(parseFloat(lat), parseFloat(lon));
        sendDataToBackend(parseFloat(lat), parseFloat(lon));
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleMapClick = (latlng) => {
    setCoords({ lat: latlng.lat, lon: latlng.lng });
    fetchAddress(latlng.lat, latlng.lng);
  };

  const sections = [
    {
      content: (
        <>
          <h1>Air Quality Index (AQI)</h1>
          <p>
            AQI indicates how polluted the air currently is or how polluted it is forecast to become.
            Values range 0–500, with higher values meaning higher pollution and health risks.
            <br />
            <a 
              href="https://en.wikipedia.org/wiki/Air_pollution" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-4 transition-all duration-300 hover:underline-offset-8"
            >
             Learn more about Air Pollution →
            </a>

          </p>
        </>
      ),
    },
    {
      content: (
        <>
          <h2>Live AQI</h2>
          <div className={styles.aqiValue}>{aqi}</div>
          <p className={styles.aqiCategory}>{aqiCategory}</p>
          <p style={{ fontSize: "0.9rem" }}>📍 {address}</p>
          <p style={{ fontSize: "0.9rem" }}>PM2.5: {pm25} µg/m³ | PM10: {pm10} µg/m³</p>
        </>
      ),
    },
    {
      content: (
        <>
          <h2>Check Nearby AQI</h2>
          <br />
          <br />
          <button className={styles.mapBtn} onClick={() => setIsMapOpen(true)}>
            View Map
          </button>
        </>
      ),
    },
    {
      content: (
        <>
          <h2>Air Quality Trends</h2>
          <div className={styles.chartWrapper}>
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </>
      ),
    },
    {
      content: (
        <>
          <h2>AI Predictions</h2>
          <p>
            Based on recent patterns, air quality may worsen in the coming days. Stay tuned for more 
            accurate predictions powered by AI.
          </p>
        </>
      ),
    },
  ];

  const advantages = [
    "Accurate real-time AQI data",
    "GPS based AQI detection",
    "Historical and trend analysis",
    "AI-driven future predictions",
    "Clean visualizations",
  ];

  const disadvantages = [
    "Depends on consistent data sources",
    "Location accuracy may vary",
    "Limited region support",
    "AI models need training",
  ];

  return (
    <div className={styles.airPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1>Air Quality Monitoring</h1>
          <p>See live air pollution data and trends to breathe smarter.</p>
        </div>
      </section>

      {/* Advantages & Disadvantages */}
      <section className={styles.advDisadvSection}>
        <div className={styles.advantages}>
          <h2>Advantages</h2>
          <ul>{advantages.map((a, i) => (<li key={i}>{a}</li>))}</ul>
        </div>
        <div className={styles.disadvantages}>
          <h2>Disadvantages</h2>
          <ul>{disadvantages.map((d, i) => (<li key={i}>{d}</li>))}</ul>
        </div>
      </section>

      {/* Cards Carousel */}
      <section className={styles.carousel}>
        <Swiper
          modules={[Navigation, Pagination, Keyboard, Mousewheel, EffectCreative]}
          effect={"creative"}
          creativeEffect={{
            prev: {
              shadow: true,
              translate: ["-120%", 0, -500],
              rotate: [0, 100, 0],
            },
            next: {
              shadow: true,
              translate: ["120%", 0, -500],
              rotate: [0, -100, 0],
            },
          }}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={window.innerWidth > 1024 ? 3 : window.innerWidth > 640 ? 2 : 1}
          navigation
          pagination={{ clickable: true }}
          keyboard={{ enabled: true }}
          mousewheel={true}
          className={styles.swiperContainer}
        >
          {sections.map((section, idx) => (
            <SwiperSlide key={idx}>
              <div className={styles.card}>{section.content}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Map Modal */}
      {isMapOpen && (
        <div className={styles.mapModal}>
          <div className={styles.mapContainer}>
            <button className={styles.closeBtn} onClick={() => setIsMapOpen(false)}>✖</button>

            <div className={styles.mapSearchBox}>
              <input
                type="text"
                placeholder="Search address..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button onClick={handleSearch}>Go</button>
            </div>

            <MapContainer
              center={[coords.lat, coords.lon]}
              zoom={12}
              scrollWheelZoom={true}
              style={{ height: "90%", width: "100%", borderRadius: "12px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[coords.lat, coords.lon]} icon={markerIcon} />
              <MapClickHandler onMapClick={handleMapClick} />
            </MapContainer>
          </div>
        </div>
      )}

      {/* Conclusion */}
      <section className={styles.conclusion}>
        <h2>Conclusion</h2>
        <p>Empowering communities with foresight into air quality for healthier living.</p>
      </section>
    </div>
  );
};

export default AirPage;
