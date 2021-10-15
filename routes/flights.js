const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
const Airport = require('../models/Airport');

router.get('/', async (_, res) => {
  try {
    const list = await Flight.find();
    res.json(list);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// Get flight availability
router.get('/:id/availability', async (req, res) => {
  try {
    let flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ msg: 'Flight not found' });
    }

    flight = await Flight.findById(req.params.id);

    const { status: departureStatus } = Airport.findById(flight.departure);
    const { status: destinationStatus } = Airport.findById(flight.destination);

    // If destination or departure airport is other than available then set flight as delayed
    if (departureStatus !== 'ontime' || destinationStatus !== 'ontime') {
      flight.status = 'delayed';
      flight = await Flight.findByIdAndUpdate(
        req.params.id,
        { $set: flight },
        { new: true, useFindAndModify: false }
      );
    } else {
      flight.status = 'ontime';
    }
    res.send(`Flight '${flight.code}' is ${flight.status}`);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/', async (req, res) => {
  const { code, departure, destination, date, status } = req.body;
  try {
    const newFlight = new Flight({
      code,
      departure,
      destination,
      date,
      status,
    });
    const flight = await newFlight.save();
    res.json(flight);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// Change status of flight
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;

  const flightFields = {};
  if (status) flightFields.status = status;

  try {
    let flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ msg: 'Flight not found' });
    }

    flight = await Flight.findByIdAndUpdate(
      req.params.id,
      { $set: flightFields },
      { new: true, useFindAndModify: false }
    );
    res.json(flight);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
