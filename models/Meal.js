const mongoose = require('mongoose');

const MealSchema = mongoose.Schema({
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
module.exports = mongoose.model('meal', MealSchema);
