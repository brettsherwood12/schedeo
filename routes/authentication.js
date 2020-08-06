'use strict';

<<<<<<< HEAD
const { Router } = require("express");
const passport = require("passport");
=======
const { Router } = require('express');

const passport = require('passport');

>>>>>>> 48b774dd4c0e0b013bf1703f0e8f2fd3db84847f
const router = new Router();
const User = require("../models/user");

router.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

router.post(
  '/sign-up',
  passport.authenticate('local-sign-up', {
    successRedirect: '/',
    failureRedirect: '/sign-up'
  })
);

router.get('/sign-in', (req, res) => {
  res.render('sign-in');
});

router.post(
  '/sign-in',
  passport.authenticate('local-sign-in', {
    successRedirect: '/',
    failureRedirect: '/sign-in'
  })
);

router.get('/:id/sign-up', (req, res) => {
  res.render('sign-up-display');
});

router.post(
  '/:id/sign-up',
  passport.authenticate('local-sign-up', {
    failureRedirect: '/sign-in'
  }),
  (req, res) => {
    const id = req.params.id;
    res.redirect(`/event/${id}/join`);
  }
);

router.get('/:id/sign-in', (req, res) => {
  res.render('sign-in-display');
});

router.post(
  '/:id/sign-in',
  passport.authenticate('local-sign-in', {
    failureRedirect: '/sign-in'
  }),
  (req, res) => {
    const id = req.params.id;
    res.redirect(`/event/${id}/join`);
  }
);

router.post('/sign-out', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get("/:token/activate", (req, res, next) => {
  const token = req.params.token;
  User.findOneAndUpdate({ token: token }, { active: true }).then(() => {
    res.render("auth/activate");
  });
});

module.exports = router;
