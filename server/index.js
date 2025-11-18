const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { default: User } = require('./models/user.model.js');
const app = express();
const PORT = 5000;
app.use(cors());

// MongoDB model for Air Data
const airDataSchema = new mongoose.Schema({
  lat: Number,
  lon: Number,
  address: String,
  aqi: Number,
  category: String,
  pm25: Number,
  pm10: Number,
  timestamp: { type: Date, default: Date.now }
});
const AirData = mongoose.model("AirData", airDataSchema);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/smartenvmonitor', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Hey, It is successfully connected to MongoDB!'))
.catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Hello from the Civintel Nexus server!');
});

// POST route to save live AQI or searched location data
app.post("/api/air-data", async (req, res) => {
  try {
    const data = new AirData(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET route to fetch recent AQI data for chart/trends
app.get("/api/air-data/trend", async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const data = await AirData.find({
      lat: { $gte: lat - 0.05, $lte: lat + 0.05 },
      lon: { $gte: lon - 0.05, $lte: lon + 0.05 },
      timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // last 7 days
    }).sort({ timestamp: 1 }); // oldest first
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Optional: GET route to fetch latest entries for debug
app.get("/api/air-data/latest", async (req, res) => {
  try {
    const data = await AirData.find().sort({ timestamp: -1 }).limit(10);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// User router
app.post('/User', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'Email already registered' });
    }
    const newuser = new User({
      firstname,
      lastname,
      email,
      password,
    });
    await newuser.save();
    res.status(201).json({ message: 'user registered ssuccefully !' });
  } catch (error) {
    console.error('Signup error', error.message);
    res.status(500).json({ message: 'server error' });
  }
});

// Login and Logout Router
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: 'User not found!' });
    }

    if (user.password != password) {
      return res.status(400).send({ message: 'invalid credentials' });
    }

    if (user) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
});

app.get('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
