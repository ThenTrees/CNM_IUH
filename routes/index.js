const express = require("express");
const app = express();

// define routes subject
const subjectRoute = require("./subject.route");

// subject path
app.use("/subjects", subjectRoute);

module.exports = app;
