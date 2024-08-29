const express = require("express");
const cors = require("cors");
const app = express();

const userRouter = require("./routes/userRoutes");

// const corsOptions = {
//   origin: "http://127.0.0.1:5500",
//   //origin: "https://arena-cloud-game.netlify.app",
//   //origin: "https://arenacloudgame.netlify.app",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   allowedHeaders: "Content-Type,Authorization",
// };

app.use(express.json());
app.use(cors());

console.log(process.env.NODE_DEV);

app.use(express.static(`${__dirname}/..`));
//Routes
app.use("/api/v1/users", userRouter);

module.exports = app;
