'use strict';

const { Router, json } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const Event = require('../models/event');
const Comment = require('../models/comment');
const axios = require('axios');
const { createTransport } = require('nodemailer');
const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary: cloudinary.v2
});
const upload = multer({ storage });

router.get('/create', (req, res, next) => {
  res.render('event/create');
});

function getPhoto(searchTerm) {
  //const url = `https://api.unsplash.com/photos?clientid=${process.env.UNSPLASH_ACCESS_KEY}&orientation=landscape&query=${searchTerm}`;
  const url = 'https://jsonplaceholder.typicode.com/posts/1';
  axios.get(url).then(response => {
    console.log(response);
  });
}

function getDates(arr) {
  return arr.reduce((acc, date) => {
    return [...acc, { date: new Date(date), votes: 0 }];
  }, []);
}

router.post('/create', upload.single('image'), (req, res, next) => {
  const { name, location, date, description } = req.body;
  let url;
  if (req.file) {
    url = req.file.path;
  } else {
    getPhoto(name);
  }
  Event.create({
    name,
    creator: req.user,
    location,
    dates: getDates(date),
    description,
    pictureUrl: url,
    invitees: req.user
  })
    .then(event => {
      res.redirect(`/event/${event._id}`);
    })
    .catch(error => {
      next(error);
    });
});

router.get('/myevents', (req, res, next) => {
  const userId = req.user._id;

  Event.find({ creator: userId })
    .then(events => {
      res.render('event/my-events', { events });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  let event;

  Event.findById(id)
    .then(data => {
      event = data;
      return Comment.find({ event: id }).populate('creator');
    })
    .then(comments => {
      if (event) {
        res.render('event/display', { event, comments });
      } else {
        next();
      }
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:id', (req, res, next) => {
  const id = req.params.id;
  const idDate = req.body.id;
  let parentEvent;

  if (typeof idDate === 'string') {
    Event.findById(id)
      .then(parent => {
        parentEvent = parent;
        let doc;
        return (doc = parent.dates.id(idDate));
      })
      .then(doc => {
        doc.voters.push(req.user._id);
        doc.votes++;
        parentEvent.markModified(doc);
        parentEvent.save();
        res.redirect(`/event/${parentEvent._id}`);
      })
      .catch(error => {
        next(error);
      });
  } else {
    for (let i = 0; i < idDate.length; i++) {
      Event.findById(id)
        .then(parent => {
          parentEvent = parent;
          let doc;
          return (doc = parent.dates.id(idDate[i]));
        })
        .then(doc => {
          doc.voters.push(req.user._id);
          doc.votes++;
          parentEvent.markModified(doc);
          parentEvent.save();
          res.redirect(`/event/${parentEvent._id}`);
        })
        .catch(error => {
          next(error);
        });
    }
  }
});

router.post('/:id/delete', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const userId = req.user._id;

  Event.findOneAndDelete({ _id: id, creator: userId })
    .then(() => {
      res.redirect('/');
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:id/join', (req, res, next) => {
  const id = req.params.id;

  Event.findById(id)
    .then(event => {
      res.render('event/join', { event });
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:id/join', (req, res, next) => {
  const id = req.params.id;
  Event.findByIdAndUpdate(id, { $push: { invitees: req.user._id } })
    .then(() => {
      res.redirect(`/event/${id}`);
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
