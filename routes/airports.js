const express = require('express');
const router = express.Router();
const Airport = require('../models/Airport');

// Ger a list of airports
router.get('/', async (_, res) => {
  try {
    const list = await Airport.find().populate({
      path: 'weather',
      select: 'title',
    });
    res.json(list);
  } catch (err) {
    console.error(err.message);
    const code = 400;
    res.status(code).json({ code, msg: 'Bad request' });
  }
});

// Create airport
router.post('/', async (req, res) => {
  const { code, title, city, status, weather } = req.body;
  try {
    const newAirport = new Airport({ code, title, city, status, weather });
    const airport = await newAirport.save();
    res.json(airport);
  } catch (err) {
    console.error(err.message);
    const code = 400;
    res.status(code).json({ code, msg: 'Bad request' });
  }
});

// Change status of airport
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;

  const airportFields = {};
  if (status) airportFields.status = status;

  try {
    let airport = await Airport.findById(req.params.id);
    if (!airport) {
      return res.status(404).json({ msg: 'Airport not found' });
    }

    airport = await Airport.findByIdAndUpdate(
      req.params.id,
      { $set: airportFields },
      { new: true, useFindAndModify: false }
    );
    res.json(airport);
  } catch (err) {
    console.error(err.message);
    const code = 400;
    res.status(code).json({ code, msg: 'Bad request' });
  }
});

module.exports = router;
