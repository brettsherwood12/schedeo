"use strict";

const { Router } = require("express");
const router = new Router();
const routeGuard = require("./../middleware/route-guard");
const Event = require("../models/event");
const { createTransport } = require("nodemailer");
const multer = require("multer");
const cloudinary = require("cloudinary");
const multerStorageCloudinary = require("multer-storage-cloudinary");

const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary: cloudinary.v2,
});
const upload = multer({ storage });

router.get("/create", (req, res, next) => {
  res.render("event/create");
});

function getDates(arr) {
  return arr.reduce((acc, date) => {
    return [...acc, { date: new Date(date), votes: 0 }];
  }, []);
}

router.post("/create", upload.single("image"), (req, res) => {
  console.log(req.body);
  let url;
  if (req.file) {
    url = req.file.path;
  }
  const { name, location, date, description } = req.body;
  Event.create({
    name,
    creator: req.session.userId,
    location,
    dates: getDates(date),
    description,
    pictureUrl: url,
  }).then((event) => {
    console.log(event);
  });
});

router.get("/", (req, res, next) => {
  Event.find()
    .then((events) => {
      res.render("event/events", { events });
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/:id/tasks", (req, res, next) => {
  const id = req.params.id;
  Event.findById(id)
    .populate("tasks.assignedTo")
    .then((event) => {
      console.log(event);
      res.render("event/tasks", { event });
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/:id/tasks", (req, res, next) => {
  const id = req.params.id;
  const { task } = req.body;
  Event.findByIdAndUpdate(id, { $push: { tasks: { assignedTo: req.user._id, description: task } } })

    .then(() => {
      res.redirect("back");
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;

  Event.findById(id)
    .then((event) => {
      if (event) {
        console.log(event);
        res.render("event/display", { event });
      } else {
        next();
      }
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
