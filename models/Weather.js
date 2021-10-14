const mongoose = require('mongoose');

const WeatherSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model('weather', WeatherSchema);
