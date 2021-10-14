const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');

router.get('/', async (_, res) => {
  try {
    const list = await Meal.find();
    res.json(list);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', async (req, res) => {
  const { code, title } = req.body;
  try {
    const newMeal = new Meal({
      code,
      title,
    });
    const meal = await newMeal.save();
    res.json(meal);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
