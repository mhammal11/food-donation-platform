const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = 8080;
const { auth } = require("express-oauth2-jwt-bearer");

const checkJwt = auth({
  audience: "http://localhost:8080",
  issuerBaseURL: `https://dev-duea60qwusk7ks7d.us.auth0.com`,
});

// Configure CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend origin for development server
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Enable credentials for CORS
  })
);

var logger = require("./middleware/logger");
var donorRouter = require("./routes/donorRouter");
var charityRouter = require("./routes/charityRouter");
var inventoryRouter = require("./routes/inventoryRouter");
var reservationRouter = require("./routes/reservationRouter");
var roleRouter = require("./routes/roleRouter");

mongoose.connect(process.env.MONGO_DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(logger);
// app.use(checkJwt);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.resolve(__dirname, "../client/build")));

// donorRouter.use(authorize.donorRole);
// charityRouter.use(authorize.charityRole);

app.use("/api/donors", donorRouter);
app.use("/api/charities", charityRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/reservations", reservationRouter);
app.use("/api/role", roleRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(process.env.PORT || port, () => {
  console.log(`App listening on port ${process.env.PORT || port}`);
});
