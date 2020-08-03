"use strict";

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
  },
  active: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
  },
});

module.exports = mongoose.model("User", schema);
