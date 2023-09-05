const Router = require("express").Router();

const { redirectLink } = require("../controllers/link/linkController");

Router.route("/:url").get(redirectLink);

module.exports = Router;
