"use strict";

const { Router } = require("express");
const router = new Router();
const routeGuard = require("./../middleware/route-guard");
const Event = require("../models/event");

router.get("/", (req, res, next) => {
  let user;
  if (req.user) {
    Event.find({ invitees: { $in: req.user._id } })
      .then((events) => {
        res.render("index", { events });
      })
      .catch((error) => {
        next(error);
      });
  } else {
    res.render("index");
  }
});

router.get("/profile", routeGuard, (req, res, next) => {
  let user;
  if (req.user) {
    Event.find({ invitees: { $in: req.user._id } })
      .then((events) => {
        res.render("user", { events });
      })
      .catch((error) => {
        next(error);
      });
  } else {
    res.render("user");
  }
});

module.exports = router;
