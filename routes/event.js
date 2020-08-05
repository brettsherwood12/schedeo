"use strict";

const { Router } = require("express");
const router = new Router();
const routeGuard = require("./../middleware/route-guard");
const inviteGuard = require("./../middleware/invite-guard");
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
    invitees: req.user,
  })
    .then((event) => {
      res.redirect(`/event/${event._id}`);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/", routeGuard, (req, res, next) => {
  Event.find({ invitees: { $in: req.user._id } })
    .then((events) => {
      res.render("event/events", { events });
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
        res.render("event/display", { event });
      } else {
        next();
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/:id", (req, res, next) => {
  const id = req.params.id;
  const idDate = req.body.id;

  for (let i = 0; i < idDate.length; i++) {
    let parentEvent;
    Event.findById(id)
      .then((parent) => {
        parentEvent = parent;
        let doc;
        return (doc = parent.dates.id(idDate[i]));
      })
      .then((doc) => {
        doc.voters.push(req.user._id);
        doc.votes++;
        console.log(doc);
        parentEvent.markModified(doc);
        parentEvent.save();
        res.redirect("/");
      })
      .catch((error) => {
        next(error);
      });
  }
});

router.get("/:id/tasks", (req, res, next) => {
  const id = req.params.id;
  Event.findById(id)
    .populate("tasks.assignedTo")
    .then((event) => {
      res.render("event/tasks", { event });
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/:id/tasks", (req, res, next) => {
  const id = req.params.id;
  const { task } = req.body;
  Event.findByIdAndUpdate(id, {
    $push: { tasks: { assignedTo: req.user._id, description: task } },
  })

    .then(() => {
      res.redirect("back");
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/:id/availability", (req, res, next) => {
  const id = req.params.id;

  Event.findById(id)
    .populate("dates.voters")
    .then((event) => {
      res.render("event/availability", { event });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
