require("dotenv").config();
const express = require("express");
const router = require("./routes");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const errorHandler = require("./middleware/errorHandler");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
app.use(errorHandler);

module.exports = app;
//
