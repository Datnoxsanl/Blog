const express = require("express");
const path = require("path");
const morgan = require("morgan");
const { engine } = require("express-handlebars");

const app = express();
const port = 3000;
// https:localhost:3000


app.use(express.static(path.join(__dirname,'public'))); 
// http://localhost:3000/img/logo.jpg


app.use(express.urlencoded({extended: true}));
app.use(express.json());



//https
app.use(morgan("combined"));

//template engine
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

app.get("/", (req, res) => {
  // res.send('Hello World! 123')
  res.render("home");
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.get("/search", (req, res) => {
  res.render("search");
});

app.post("/search", (req, res) => {
  console.log(req.body);
  res.send("");
});



//127.0.0.1
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
