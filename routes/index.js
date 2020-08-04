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

module.exports = router;
