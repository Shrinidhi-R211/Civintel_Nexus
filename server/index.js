require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user.model.js');
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
const { GoogleGenerativeAI } = require("@google/generative-ai");
const NoiseData = require("./models/NoiseData.js");


// Middleware
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// MongoDB model for Air Data
const airDataSchema = new mongoose.Schema({
  lat: Number,
  lon: Number,
  address: String,
  aqi: Number,
  category: String,
  pm25: Number,
  pm10: Number,
  timestamp: { type: Date, default: Date.now },
});
const AirData = mongoose.model('AirData', airDataSchema);

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    console.log('Hey, It is successfully connected to MongoDB Atlas!')
  )
  .catch((err) => console.error('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Hello from the Civintel Nexus server!');
});
// POST route to save live AQI or searched location data
app.post('/api/air-data', async (req, res) => {
  try {
    const data = new AirData(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET route to fetch recent AQI data for chart/trends
app.get('/api/air-data/trend', async (req, res) => {
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
app.get('/api/air-data/latest', async (req, res) => {
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

// Login Router
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

//Logout Router
app.get('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

app.get('/search-location/:text', async (req, res) => {
  const { text } = req.params;

  if (!text) {
    return res.status(400).json({ message: 'Search text is required' });
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
    text
  )}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'CivintelNexus/1.0 (https://github.com/Shrinidhi-R211/Civintel_Nexus)',
      },
    });

    const data = await response.json();

    if (data.length === 0) {
      return res.status(404).json({ message: 'No location found' });
    }

    // Extract needed info
    const location = {
      lat: data[0].lat,
      lon: data[0].lon,
      displayName: data[0].display_name,
    };

    res.json(location);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error while searching location' });
  }
});

app.get('/geocode/:lat/:lon', async (req, res) => {
  const { lat, lon } = req.params;

  const latitude = Number(lat);
  const longitude = Number(lon);

  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'CivintelNexus/1.0 (https://github.com/Shrinidhi-R211/Civintel_Nexus)',
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({ error: 'Failed to fetch address' });
  }
});

app.put('/edit', async (req, res) => {
  try {
    const { name, bio, dob, city, phone, occupation, country, state, id } =
      req.body; // fields sent from client

    console.log(req.body);
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, bio, dob, city, phone, occupation, country, state },
      { new: true } // return updated doc
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post("/noiseanalyzer", async (req, res) => {
  const data = req.body
    const prompt = `
    You are a noise pollution analysis expert. Analyze the following NOISE LEVEL dataset and generate a simple, clear explanation.

Use this structure:

1. **Current Noise Level (dB)**  
   - Explain what the latest noise value means in real-life terms  
     (e.g., similar to traffic, loud music, conversation, etc.)

2. **Average Noise Level**  
   - Compare it with the current dB.  
   - Mention if the noise is higher or lower than usual.

3. **Trend Analysis**  
   - Describe whether noise is increasing, decreasing, or stable.  
   - Explain why this might be happening.

4. **Predicted Noise Levels**  
   - Interpret the predicted dB values for the next hours.  
   - Mention whether they may cross harmful thresholds.

5. **Short Recommendation**  
   - Provide 2–3 small tips (ear safety, avoiding exposure, etc.)

Here is the data to analyze:
${JSON.stringify(data, null, 2)}
    `
  
   try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);

    res.json({ text: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } 
});



app.post("/airanalyzer", async (req, res) => {
  const data = req.body;

  const prompt = `
You are an environmental analytics expert. Analyze the following AIR QUALITY dataset and produce a clear, human-friendly explanation.

Use this structure:

1. **Current AQI**  
   - Explain the meaning of the latest air quality value.  
   - Mention if it is safe or harmful for health.

2. **Average AQI**  
   - Compare it with the current value.  
   - Say whether the environment is improving or getting worse.

3. **Trend Analysis**  
   - Describe the trend (increasing/decreasing/stable).  
   - Explain what this means for the next few hours.

4. **Predicted Values**  
   - Explain the upcoming predicted values in simple language.  
   - Mention if the levels are expected to enter a dangerous zone.

5. **Short Recommendation**  
   - Provide 2–3 practical suggestions for people nearby.

Here is the data to analyze:
${JSON.stringify(data, null, 2)}
  `
   try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);

    res.json({ text: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } 
});

app.post("/api/noise", async (req, res) => {
//  console.log(req.body);
  try {
    const saved = await NoiseData.create(req.body);
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save noise data" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
