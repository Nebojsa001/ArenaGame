const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");

const userRouter = require("./routes/userRoutes");

const app = express();
// Sigurnosni middleware-i
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https://arenacloudtv.com"], //dozvola za slike sa ovog urla
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);
app.use(cors()); // CORS podrška
app.use(bodyParser.json({ limit: "20mb" }));
app.use(mongoSanitize());
app.use("/api/v1/users", xss());

app.use(rateLimit({ windowMs: 3 * 60 * 1000, max: 3000 })); //100 zahtjeva u 3 minute

console.log(process.env.NODE_DEV);

app.use(express.static(`${__dirname}/..`));
//Routes
app.use("/api/v1/users", userRouter);

module.exports = app;
