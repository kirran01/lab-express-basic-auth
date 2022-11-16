const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index.hbs");
});

router.get("/signup", (req, res) => {
  res.render("signup.hbs");
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
