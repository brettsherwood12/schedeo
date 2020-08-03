"use strict";

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("./models/user");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");

const createRandomToken = () => {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 15; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then((user) => {
      callback(null, user);
    })
    .catch((error) => {
      callback(error);
    });
});

passport.use(
  "local-sign-up",
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    (req, email, password, callback) => {
      const name = req.body.name;
      bcryptjs
        .hash(password, 10)
        .then((hash) => {
          return User.create({
            name,
            email,
            passwordHash: hash,
            token: createRandomToken(),
          });
        })
        .then((user) => {
          callback(null, user);
        })
        .then(() => {
          transport.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: process.env.NODEMAILER_EMAIL,
            subject: "User signed up successfully",
            text: "Welcome",
          });
        })
        .catch((error) => {
          callback(error);
        });
    }
  )
);

passport.use(
  "local-sign-in",
  new LocalStrategy({ usernameField: "email" }, (email, password, callback) => {
    let user;
    User.findOne({
      email,
    })
      .then((document) => {
        user = document;
        return bcryptjs.compare(password, user.passwordHash);
      })
      .then((passwordMatchesHash) => {
        if (passwordMatchesHash) {
          callback(null, user);
        } else {
          callback(new Error("WRONG_PASSWORD"));
        }
      })
      .catch((error) => {
        callback(error);
      });
  })
);
