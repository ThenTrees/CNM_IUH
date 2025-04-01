const express = require("express");
const app = express();

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));

// render interface
app.use(express.static("./views"));
app.set("view engine", "ejs");
app.set("views", "./views");

// Import routes
app.use("/", require("./routes/index"));

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000/");
});
