const mongoose = require("mongoose");

const airDataSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  address: { type: String, required: true },
  aqi: { type: Number, required: true },
  category: { type: String, required: true },
  pm25: { type: Number, required: true },
  pm10: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AirData", airDataSchema);
