const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const {
  isLoggedIn,
  isNotLoggedIn,
} = require("../middlewares/auth.middlewares.js");

/* GET home page */

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

router.get("/main", isLoggedIn, (req, res) => {
  res.render("main.hbs");
});

router.get("/private", isLoggedIn, (req, res) => {
  res.render("private.hbs");
});

router.get("/profile",isLoggedIn, (req, res) => {
  res.render("profile.hbs", req.session.user);
});

router.get("/", (req, res, next) => {
  res.render("index.hbs");
});

router.get("/signup", isNotLoggedIn, (req, res) => {
  res.render("signup.hbs");
});

router.get("/login",isNotLoggedIn, (req, res) => {
  res.render("login.hbs");
});

//LOGIN
router.post("/login", (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.render("login.hbs", { errorMessage: "field(s) are blank" });
    return;
  }
  User.findOne({ username: req.body.username })
    .then((foundUser) => {
      if (!foundUser) {
        res.render("login.hbs", { errorMessage: "user does not exist" });
        return;
      }
      const isValidPassword = bcryptjs.compareSync(
        req.body.password,
        foundUser.password
      );
      if (!isValidPassword) {
        res.render("login.hbs", { errorMessage: "password incorrect" });
        return;
      }
      //   session is for cookies
      req.session.user = foundUser;
      res.render("profile.hbs", foundUser);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/signup", (req, res) => {
  // both input fields must be full conditonal
  if (!req.body.username || !req.body.password) {
    res.send("field(s) are blank");
    return;
  }
  //   see if email(username in this lab cuz model is different) already exists in db
  User.findOne({ username: req.body.username })
    .then((foundUser) => {
      if (foundUser) {
        res.send("user already exists");
        return;
      }
      return User.create({
        username: req.body.username,
        password: bcryptjs.hashSync(req.body.password),
      });
    })
    .then((createdUser) => {
      res.send(createdUser);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
