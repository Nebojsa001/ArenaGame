const express = require("express");
const cors = require("cors");
const app = express();

const userRouter = require("./routes/userRoutes");

const corsOptions = {
  origin: "https://arenacloudgame.netlify.app/",
  //origin: "http://127.0.0.1:5500",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(express.json());
app.use(cors(corsOptions));

console.log(process.env.NODE_DEV);

//Routes
app.use("/api/v1/users", userRouter);

module.exports = app;
