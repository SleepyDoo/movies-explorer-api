const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    unique: true,
    type: String,
    required: true,
  },
  password: {
    select: false,
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
