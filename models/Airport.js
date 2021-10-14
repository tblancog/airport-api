const mongoose = require('mongoose');

const AiportSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  weatherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'weather',
  },
});
module.exports = mongoose.model('airport', AiportSchema);
