const Router = require("express").Router();
const protectRoute = require("../middlewares/authentication/authenticate");
const { createLink, userLinks, getLink, deleteLink } = require("../controllers/link/linkController");
const Validator = require("../middlewares/validation/linkValidation");
const api404 = require("../middlewares/api404");

// create a link
// get all links by user
// get a particular link
// delete a link

Router.all("*", protectRoute);

Router.route("/")
	.get(userLinks)
	.post(new Validator().body(["link"]).exec(), createLink);

Router.route("/:_id")
	.all(new Validator().params(["link_id"]).exec())
	.get(getLink)
	.delete(deleteLink);

Router.use(api404);

module.exports = Router;
