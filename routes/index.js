'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const Event = require('../models/event');
const User = require('../models/user');

router.get('/', (req, res, next) => {
  if (req.user) {
    Event.find({ invitees: { $in: req.user._id } })
      .then(events => {
        res.render('index', { events });
      })
      .catch(error => {
        next(error);
      });
  } else {
    res.render('index');
  }
});

router.get('/profile', routeGuard, (req, res, next) => {
  res.render('user');
});

router.post('/profile', routeGuard, (req, res, next) => {
  const id = req.user._id;
  const { name, email } = req.body;

  User.findByIdAndUpdate(id, { name, email })
    .then(() => {
      res.redirect('/profile');
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
});

module.exports = router;
