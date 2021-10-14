const mongoose = require('mongoose');

const FlightSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
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
});
module.exports = mongoose.model('flight', FlightSchema);
