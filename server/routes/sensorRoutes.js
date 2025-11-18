// server/routes/sensorRoutes.js

const express = require('express');
const router = express.Router();
const {
  getSensors,
  addSensor
} = require('../controllers/sensorController');

// GET all sensor data
router.get('/', getSensors);

// POST new sensor data
router.post('/', addSensor);

module.exports = router;
