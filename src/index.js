import express from "express";
import path from "path";
import morgan from "morgan";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";

import route from "./routes/index.js";
import { connectDB } from "./config/db/index.js";

const app = express();
const port = 3000;

// Fix __dirname trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect DB
await connectDB();

// Static file
app.use(express.static(path.join(__dirname, "public")));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logger
app.use(morgan("combined"));

// Template engine
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

// Routes
route(app);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
