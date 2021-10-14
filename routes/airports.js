const express = require('express');
const router = express.Router();
const Airport = require('../models/Airport');

router.get('/', async (_, res) => {
  try {
    const list = await Airport.find();
    res.json(list);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', async (req, res) => {
  const { code, title, city, status, weatherId } = req.body;
  try {
    const newAirport = new Airport({ code, title, city, status, weatherId });
    const airport = await newAirport.save();
    res.json(airport);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
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
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
