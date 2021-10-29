const express = require("express");
const app = express();
const urlRouter = require("./urls/urls.router");
const useRouter = require("./uses/uses.router");

app.use(express.json());

app.use("/urls", urlRouter);
app.use("/uses", useRouter);

app.use((req, res, next) => {
  next(`Not found: ${req.originalUrl}`);
});

app.use((error, req, res, next) => {
  const { status = 404, message = `${req.originalUrl}` } = error;
  res.status(status).json({ error: message });
});

module.exports = app;
