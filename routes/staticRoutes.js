const Router = require("express").Router();
const { renderResetPassword } = require("../controllers/auth/authController");
const { redirectLink } = require("../controllers/link/linkController");

Router.route("/resetPassword").get(renderResetPassword);

Router.get(
	"/oauth2/redirect/google",
	passport.authenticate("google", {
		failureRedirect: "/login",
		successReturnToOrRedirect: "/",
	})
);

Router.route("/:url").get(redirectLink);

exports = module.exports = Router;
exports.Router = Router;
