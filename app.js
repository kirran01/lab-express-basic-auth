const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

//here
mongoose
  .connect("mongodb://localhost:27017/lab-express-basic-auth")
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.use(
  session({
    secret: "keyboardcat",
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax",
      secure: false,
      httpOnly: true,
      maxAge: 600000, // 60 * 1000 ms === 1 min
    },
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/lab-express-basic-auth",
      // ttl => time to live
      // ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
    }),
  })
);

// default value for title local
const projectName = "lab-express-basic-auth";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
