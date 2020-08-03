"use strict";

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  locationName: {
    type: String,
    required: true,
  },
  location: {
    coordinates: [
      {
        type: Number,
        min: -180,
        max: 180,
      },
    ],
    type: {
      type: String,
      default: "Point",
    },
  },
  dates: [
    {
      date: {
        type: Date,
      },
      votes: {
        type: Number,
      },
    },
  ],
  description: {
    type: String,
  },
  pictureUrl: {
    type: String,
  },
  invitees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  tasks: [
    {
      description: {
        type: String,
      },
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },
  ],
});

module.exports = mongoose.model("User", schema);
