const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
const Airport = require('../models/Airport');

router.get('/', async (_, res) => {
  try {
    const list = await Flight.find()
      .populate({
        path: 'departure',
        select: 'code title -_id',
        populate: { path: 'weather', select: 'code title -_id' },
      })
      .populate({
        path: 'destination',
        select: 'code title -_id',
        populate: { path: 'weather', select: 'code title -_id' },
      })
      .populate({ path: 'meal', select: 'code title -_id' })
      .exec();
    res.json(list);
  } catch (err) {
    console.error(err.message);
    const code = 400;
    res.status(code).json({ code, msg: 'Bad request' });
  }
});

// Get flight status
router.get('/:code/status', async (req, res) => {
  try {
    let flight = await Flight.findOne({ code: req.params.code })
      .populate({
        path: 'departure',
        select: 'code title status -_id',
        populate: { path: 'weather', select: 'code title -_id' },
      })
      .populate({
        path: 'destination',
        select: 'code title status -_id',
        populate: { path: 'weather', select: 'code title -_id' },
      })
      .populate({ path: 'meal', select: 'code title -_id' })
      .exec();
    if (!flight) {
      return res.status(404).json({ msg: 'Flight not found' });
    }

    // Get destination and departure
    const {
      departure: {
        weather: { code: departureWeather },
        status: departureStatus,
      },
      destination: {
        weather: { code: destinationWeather },
        status: destinationStatus,
      },
    } = flight;

    const flightFields = {};
    /**
     * If weather conditions are: 'snow', 'thunder' flight should be cancelled
     * If weather conditions are: 'fog', 'rainy'
     *  OR any departure airport or destination is busy
     *  then flight should be delayed
     * */
    const cancellableWeather = ['snow', 'thunder'];
    const delayableBadWeather = ['fog', 'rainy'];

    if (
      cancellableWeather.includes(departureWeather) ||
      cancellableWeather.includes(destinationWeather)
    ) {
      flightFields.status = 'cancelled';
    } else if (
      delayableBadWeather.includes(departureWeather) ||
      delayableBadWeather.includes(destinationWeather) ||
      departureStatus === 'busy' ||
      destinationStatus === 'busy'
    ) {
      flightFields.status = 'delayed';
    } else {
      flightFields.status = 'scheduled';
    }
    flight = await Flight.findOneAndUpdate(
      req.params.code,
      { $set: flightFields },
      { new: true, useFindAndModify: false }
    );
    res.json(flight);
  } catch (err) {
    console.error(err.message);
    const code = 400;
    res.status(code).json({ code, msg: 'Bad request' });
  }
});

router.post('/', async (req, res) => {
  const { code, airline, title, departure, destination, date, status, meal } =
    req.body;
  try {
    const newFlight = new Flight({
      code,
      airline,
      title,
      departure,
      destination,
      date,
      status,
      meal,
    });
    const flight = await newFlight.save();
    res.json(flight);
  } catch (err) {
    console.error(err.message);
    const code = 400;
    res.status(code).json({ code, msg: 'Bad request' });
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
    console.error(err.message);
    const code = 400;
    res.status(code).json({ code, msg: 'Bad request' });
  }
});

module.exports = router;
