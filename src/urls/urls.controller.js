const urls = require("../data/urls-data");
const uses = require("../data/uses-data");
const e = require("express");

let lastUrlId = urls.reduce((maxId, url) => Math.max(maxId, url.id), 0);

let lastUseId = uses.reduce((maxId, use) => Math.max(maxId, use.id), 0);

function urlExists(req, res, next) {
  const { urlId } = req.params;
  const foundUrl = urls.find((url) => url.id === Number(urlId));
  if (foundUrl) {
    res.locals.url = foundUrl;
    return next();
  } else {
    next({
      status: 404,
      message: `Url id not found: ${urlId}`,
    });
  }
}

function bodyHasHrefProperty(req, res, next) {
  const { data: { href } = {} } = req.body;
  if (href) {
    return next();
  } else {
    next({
      status: 400,
      message: `A "href" property is required`,
    });
  }
}

function list(req, res, next) {
  res.json({ data: urls });
}

function read(req, res) {
  const readUrl = res.locals.url;
  const newUse = {
    urlId: readUrl.id,
    id: ++lastUseId,
    time: Date.now(),
  };
  uses.push(newUse);
  res.json({ data: res.locals.url });
}

function create(req, res, next) {
  const { data: { href } = {} } = req.body;
  const newUrl = {
    href: href,
    id: ++lastUrlId,
  };
  urls.push(newUrl);
  res.status(201).json({ data: newUrl });
}

function update(req, res, next) {
  const url = res.locals.url;
  const originalHref = url.href;
  const { data: { href } = {} } = req.body;
  if (originalHref !== href) {
    url.href = href;
  }
  res.json({ data: res.locals.url });
}

function destroy(req, res, next) {
  const { urlId } = req.params;
  const index = urls.findIndex((url) => url.id === Number(urlId));
  const deletedUrls = urls.splice(index, 1);
  res.sendStatus(204);
}

module.exports = {
  list,
  read: [urlExists, read],
  create: [bodyHasHrefProperty, create],
  update: [urlExists, bodyHasHrefProperty, update],
  urlExists,
};
