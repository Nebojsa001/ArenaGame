const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

console.log(process.env.NODE_ENV);

//konfiguracija

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const DBL = process.env.DATABASE_LOCAl;
//povizivanje mongodb
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful!");
  });

//definisanje seme

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
