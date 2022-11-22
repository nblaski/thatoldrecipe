const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  confirmed: {
    type: String,
    defaultValue: false,
    
  },
  isAdmin: {
    type: String,
    defaultValue: false,
  },
  role: {
    type: String,
    required: true,
    default: "basic"
  },
  date: {
    type: Date,
    default: Date.now
  },
  profileImgURL: {
    type: String,
    default: "/images/profileIcon/default.png"
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
