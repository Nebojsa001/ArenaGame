const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const userRouter = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use("/api/v1/users", mongoSanitize());
app.use("/api/v1/users", xss());
app.use("/api/v1/users", helmet());
app.use(rateLimit({ windowMs: 3 * 60 * 1000, max: 3000 })); //100 zahtjeva u 3 minute

console.log(process.env.NODE_DEV);
app.use(bodyParser.json({ limit: "20mb" }));

app.use(express.static(`${__dirname}/..`));
//Routes
app.use("/api/v1/users", userRouter);

module.exports = app;
