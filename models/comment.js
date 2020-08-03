"use strict";

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  content: {
    type: String,
    required: true,
  },
  pictureUrl: {
    type: String,
  },
});

module.exports = mongoose.model("Comment", schema);
