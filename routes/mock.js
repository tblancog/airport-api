const express = require('express');
const router = express.Router();
const Weather = require('../models/Weather');
const Meal = require('../models/Meal');
const Airport = require('../models/Airport');
const Flight = require('../models/Flight');

const listOfWeather = [
  {
    code: 'sunny',
    title: 'Sunny skies',
  },
  {
    code: 'partly-cloudy',
    title: 'Partly cloudy',
  },
  {
    code: 'cloudy',
    title: 'Cloudy',
  },
  {
    code: 'rainy',
    title: 'Rainy',
  },
  {
    code: 'fog',
    title: 'Fog',
  },
  {
    code: 'snow',
    title: 'Snow',
  },
  {
    code: 'thunder',
    title: 'TunderStorms',
  },
];

const meals = [
  {
    code: 'spagetti',
    title: 'Spagetti',
  },
  {
    code: 'chicken',
    title: 'Chicken',
  },
  {
    code: 'salad',
    title: 'Salad',
  },
];

const airports = [
  {
    code: 'EZE',
    title: 'Aeropuerto Internacional Ezeiza',
    city: 'Buenos Aires',
    status: 'available',
  },
  {
    code: 'NYC',
    title: 'NYC International Airport',
    city: 'New York',
    status: 'busy',
  },
  {
    code: 'CCS',
    title: 'Aeropuerto Internacional Simón Bolívar',
    city: 'Caracas',
    status: 'available',
  },
];

const flights = [
  {
    code: 'ABC123',
    airline: 'American Airlines',
    title: 'NYC-EZE',
    date: new Date('12/01/2021').toISOString(),
    status: 'scheduled',
  },
  {
    code: 'XYZ123',
    airline: 'Conviasa',
    title: 'CSS-EZE',
    date: new Date('12/02/2021').toISOString(),
    status: 'scheduled',
  },
  {
    code: 'LMN600',
    airline: 'Aerolíneas Argentinas',
    title: 'EZE-CCS',
    date: new Date('12/02/2021').toISOString(),
    status: 'scheduled',
  },
];

router.post('/', async (_, res) => {
  // 1. Insert list of weathers
  await Weather.insertMany(listOfWeather);

  // 2. Insert list
  await Meal.insertMany(meals);

  // 3. Insert airports
  const snowy = await Weather.findOne({ code: 'snow' });
  // eze
  const eze = await new Airport({
    ...airports[0],
    weather: snowy,
  }).save();

  const sunny = await Weather.findOne({ code: 'sunny' });
  // NYC
  const nyc = await new Airport({
    ...airports[1],
    weather: sunny,
  }).save();

  const cloudy = await Weather.findOne({ code: 'cloudy' });
  // CCS
  const ccs = await new Airport({
    ...airports[2],
    weather: cloudy,
  }).save();

  // 4. Insert some flights with meals
  const chicken = await Meal.findOne({ code: 'chicken' });
  const salad = await Meal.findOne({ code: 'salad' });
  await new Flight({
    ...flights[0],
    departure: nyc,
    destination: ccs,
    meal: chicken,
  }).save();

  await new Flight({
    ...flights[1],
    departure: ccs,
    destination: eze,
    meal: salad,
  }).save();

  await new Flight({
    ...flights[2],
    departure: eze,
    destination: ccs,
    meal: salad,
  }).save();

  res.send('Done');
});

module.exports = router;
