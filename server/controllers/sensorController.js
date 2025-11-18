// server/controllers/sensorController.js

let sensorData = []; // In-memory storage (can be replaced with DB later)

// GET all sensor readings
const getSensors = (req, res) => {
  res.json(sensorData);
};

// POST a new sensor reading
const addSensor = (req, res) => {
  const { temperature, humidity, airQuality } = req.body;
  if (temperature && humidity && airQuality) {
    const newSensor = {
      id: sensorData.length + 1,
      timestamp: new Date(),
      temperature,
      humidity,
      airQuality
    };
    sensorData.push(newSensor);
    res.status(201).json(newSensor);
  } else {
    res.status(400).json({ message: 'Missing required sensor data' });
  }
};

module.exports = {
  getSensors,
  addSensor
};
