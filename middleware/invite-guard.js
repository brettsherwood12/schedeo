"use strict";

const Event = require("../models/event");

module.exports = (req, res, next) => {
  const id = req.params.id;
  Event.findById(id)
    .then((event) => {
      console.log(event.invitees);
      if (event.invitees.includes(req.user._id)) {
        next();
      }
    })
    .catch((error) => {
      next(error);
    });
};
