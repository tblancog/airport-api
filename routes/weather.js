const express = require('express');
const router = express.Router();
const Weather = require('../models/Weather');

router.get('/', async (_, res) => {
  try {
    const list = await Weather.find();
    res.json(list);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', async (req, res) => {
  const { code, title } = req.body;
  try {
    const newWeather = new Weather({
      code,
      title,
    });
    const weather = await newWeather.save();
    res.json(weather);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
