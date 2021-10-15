const mongoose = require('mongoose');

const FlightSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  airline: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  departure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'airport',
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'airport',
  },
  date: {
    type: String,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
  },
  meal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'meal',
  },
});
module.exports = mongoose.model('flight', FlightSchema);
