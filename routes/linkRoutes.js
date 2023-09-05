const Router = require("express").Router();
const protectRoute = require("../middlewares/authentication/authenticate");
const { createLink, userLinks, getLink, deleteLink, patchLink } = require("../controllers/link/linkController");

// create a link
// get all links by user
// get a particular link
// delete a link
// modify a link

Router.all("*", protectRoute);

Router.route("/").get(userLinks).post(createLink);

Router.route("/:id").get(getLink).patch(patchLink).delete(deleteLink);

module.exports = Router;
