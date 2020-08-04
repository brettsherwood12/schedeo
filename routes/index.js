'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const Event = require('../models/event');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/private', routeGuard, (req, res, next) => {
  res.render('private');
});

router.get('/profile', (req, res, next) => {
  res.render('user');
});

//change next route to event.js

router.get('/event/:id/availability', (req, res, next) => {
  const id = req.params.id;

  Event.findById(id)
    .populate('dates.voters')
    .then(event => {
      //   console.log(event.dates[0].voters);
      console.log(event.dates[0]);
      res.render('event/availability', { event });
    })
    .catch(error => {
      next(error);
    });
});

router.post('/event/:id', (req, res, next) => {
  const id = req.params.id;
  const idDate = req.body.id;
  console.log(idDate.length);

  for (let i = 0; i < idDate.length; i++) {
    let parentEvent;
    Event.findById(id)
      .then(parent => {
        parentEvent = parent;
        let doc;
        return (doc = parent.dates.id(idDate[i]));
      })
      .then(doc => {
        doc.voters.push(req.user._id);
        doc.votes++;
        console.log(doc);
        parentEvent.markModified(doc);
        parentEvent.save();
      })
      .catch(error => {
        next(error);
      });
  }
});

module.exports = router;
