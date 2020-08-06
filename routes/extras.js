'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const Event = require('../models/event');
const Comment = require('../models/comment');
const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary: cloudinary.v2
});
const upload = multer({ storage });

router.post(
  '/:id/comment',
  routeGuard,
  upload.single('image'),
  (req, res, next) => {
    const id = req.params.id;
    const { content } = req.body;
    let url;
    if (req.file) {
      url = req.file.path;
    }

    Comment.create({
      event: id,
      content,
      creator: req.user,
      pictureUrl: url
    })
      .then(post => {
        res.redirect(`/event/${id}`);
      })
      .catch(error => {
        next(error);
      });
  }
);

router.get('/:id/tasks', routeGuard, (req, res, next) => {
  const id = req.params.id;
  Event.findById(id)
    .populate('tasks.assignedTo')
    .then(event => {
      res.render('event/tasks', { event });
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:id/tasks', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const { task } = req.body;
  Event.findByIdAndUpdate(id, {
    $push: { tasks: { assignedTo: req.user._id, description: task } }
  })
    .then(() => {
      res.redirect('back');
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:id/availability', routeGuard, (req, res, next) => {
  const id = req.params.id;

  Event.findById(id)
    .populate('dates.voters')
    .then(event => {
      res.render('event/availability', { event });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
