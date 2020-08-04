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

// router.post('/event/:id', (req, res) => {
//   const id = req.params.id;
//   const idDate = req.body.id;

//   let parentEvent;
//   Event.findById(id)
//     .then(parent => {
//       parentEvent = parent;
//       let doc;
//       return (doc = parent.dates.id(idDate));
//     })
//     .then(doc => {
//       doc.votes++;
//       parentEvent.markModified(doc);
//       parentEvent.save();
//     });
// });

router.post('/event/:id', (req, res) => {
  const id = req.params.id;
  const idDate = req.body.id;

  for (let i = 0; i < idDate.length; i++) {
    let parentEvent;
    Event.findById(id)
      .then(parent => {
        parentEvent = parent;
        let doc;
        return (doc = parent.dates.id(idDate[i]));
      })
      .then(doc => {
        doc.votes++;
        parentEvent.markModified(doc);
        parentEvent.save();
      });
  }
});

module.exports = router;
