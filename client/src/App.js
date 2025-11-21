// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import NoisePage from './pages/NoisePage';
import AirPage from './pages/AirPage';
import WeatherPage from './pages/WeatherPage';
import Login from './components/Login';
import Signup from './components/Signup';
import AiPredictionPage from './pages/AiPredictionPage';
import PrivacyPolicy from './pages/privacy';
import Terms from './pages/Terms';


function AppContent() {
  const location = useLocation();

  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <div className="pt-20 px-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/noise" element={<NoisePage />} />
          <Route path="/air" element={<AirPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/ai_predict" element={<AiPredictionPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
