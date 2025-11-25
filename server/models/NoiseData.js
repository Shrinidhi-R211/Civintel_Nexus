const mongoose = require("mongoose");

const PeakSchema = new mongoose.Schema({
  time: {
    type: Number,
    required: true,
  },
  db: {
    type: Number,
    required: true,
  },
  severity: {
    type: String,
    enum: ["normal", "high", "critical", "low"],
    default: "normal",
  }
}, { _id: false });

const NoiseDataSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },

  localAddress: {
    type: String,
  },

  coords: {
    type: [Number], // [lat, lng]
    required: true,
    validate: {
      validator: v => v.length === 2,
      message: "coords must contain exactly 2 numbers [lat, lng]"
    }
  },

  avgDb: {
    type: Number,
    required: true,
  },

  minDb: {
    type: Number,
    required: true,
  },

  maxDb: {
    type: Number,
    required: true,
  },

  variability: {
    type: Number,
    required: true,
  },

  durationSec: {
    type: Number,
    default: 0,
  },

  mode: {
    type: String,
    enum: ["auto", "manual"],
    default: "auto",
  },

  peaks: {
    type: [PeakSchema],
    default: []
  },

  timestamp: {
    type: Number, // keeping timestamp as raw epoch like your data
    required: true,
  }

}, { timestamps: true, strict:false });

module.exports = mongoose.model("NoiseData", NoiseDataSchema);
