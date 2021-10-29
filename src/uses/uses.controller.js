const uses = require("../data/uses-data");
const e = require("express");

function useExists(req, res, next) {
  const { useId } = req.params;
  const foundUse = uses.find((use) => use.id === Number(useId));
  if (foundUse) {
    res.locals.uses = foundUse;
    return next();
  } else {
    next({
      status: 404,
      message: `Use id not found: ${useId}`,
    });
  }
}

function list(req, res, next) {
  res.json({ data: uses });
}

function read(req, res, next) {
  res.json({ data: res.locals.uses });
}

function destroy(req, res, next) {
  const { useId } = req.params;
  const index = uses.findIndex((use) => use.id === Number(useId));
  res.sendStatus(204);
}

module.exports = {
  list,
  read: [useExists, read],
  delete: [useExists, destroy],
};
