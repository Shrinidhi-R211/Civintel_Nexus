const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    dob: String,
    bio: String,
    occupation: String,
    country: String,
    state: String,
    city: String,
    phone: Number,
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = mongoose.model('User', UserSchema);
