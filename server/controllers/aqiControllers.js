const fetch = require("node-fetch"); // install via npm i node-fetch@2

const getCurrentAQI = async (req, res) => {
  try {
    const apiKey = "c590a4444f4b23d540a145db0d5d1bc9"; // replace with your key
    const lat = 13.2110;  // Srinivaspur Taluk latitude
    const lon = 78.1392;  // Srinivaspur Taluk longitude

    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    // Extract AQI and category
    const aqiValue = data.list[0].main.aqi; // 1-5 scale
    let category = "";

    if (aqiValue === 1) category = "Good";
    else if (aqiValue === 2) category = "Fair";
    else if (aqiValue === 3) category = "Moderate";
    else if (aqiValue === 4) category = "Poor";
    else category = "Very Poor";

    res.json({ value: aqiValue, category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching AQI" });
  }
};

module.exports = { getCurrentAQI };
