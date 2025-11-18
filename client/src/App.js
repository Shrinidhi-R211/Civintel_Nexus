// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import NoisePage from './pages/NoisePage';
import AirPage from './pages/AirPage';
import WeatherPage from './pages/WeatherPage';
import Login from './components/Login';
import Signup from './components/Signup';
import AiPredictionPage from './pages/AiPredictionPage';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-20 px-4">
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />
          <Route
            path="/noise"
            element={<NoisePage />}
          />
          <Route
            path="/air"
            element={<AirPage />}
          />
          <Route
            path="/weather"
            element={<WeatherPage />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/Signup"
            element={<Signup />}
          />
          <Route
            path="/ai_predict"
            element={<AiPredictionPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
