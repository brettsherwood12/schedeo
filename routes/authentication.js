'use strict';

const { Router } = require('express');

const passport = require('passport');

const router = new Router();

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

module.exports = router;
